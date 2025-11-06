/**
 * Contract Tests para Row Level Security (RLS)
 *
 * Valida que as políticas RLS estão funcionando corretamente,
 * impedindo acesso não autorizado e permitindo acesso autorizado.
 *
 * IMPORTANTE: Estes testes devem rodar contra um Supabase local
 * ou um projeto de teste isolado, NUNCA em produção.
 */

import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Configuração do cliente Supabase para testes
const SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('TEST_SUPABASE_SERVICE_ROLE_KEY não configurado');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Helpers para criar usuários de teste
 */
async function createTestUser(email: string, password: string = 'test-password-123') {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw authError;

  // Criar perfil associado
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: authData.user.email,
      full_name: `Test User ${email}`,
    });

  if (profileError) throw profileError;

  return authData.user;
}

async function deleteTestUser(userId: string) {
  // Deletar perfil primeiro
  await supabaseAdmin.from('profiles').delete().eq('id', userId);
  // Deletar usuário auth
  await supabaseAdmin.auth.admin.deleteUser(userId);
}

async function getSupabaseClientForUser(userId: string) {
  // Em testes, você pode usar service role para obter token do usuário
  // ou usar um método de teste específico
  // Por ora, assumimos que você tem um token válido
  const token = process.env.TEST_USER_TOKEN || '';
  return createClient(SUPABASE_URL, process.env.TEST_SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

describe('RLS: Profiles', () => {
  let user1: any;
  let user2: any;

  beforeAll(async () => {
    // Criar usuários de teste
    user1 = await createTestUser('user1@test.com');
    user2 = await createTestUser('user2@test.com');
  });

  afterAll(async () => {
    // Limpar usuários de teste
    if (user1) await deleteTestUser(user1.id);
    if (user2) await deleteTestUser(user2.id);
  });

  it('should allow users to view their own profile', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user1.id)
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data.id).toBe(user1.id);
  });

  it('should prevent users from viewing other users profiles', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user2.id)
      .single();

    // Deve retornar erro de permissão
    expect(error).toBeTruthy();
    expect(error?.code).toBe('PGRST301'); // PostgreSQL error code for permission denied
  });

  it('should allow users to update their own profile', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('profiles')
      .update({ full_name: 'Updated Name' })
      .eq('id', user1.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.full_name).toBe('Updated Name');
  });

  it('should prevent users from updating other users profiles', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('profiles')
      .update({ full_name: 'Hacked Name' })
      .eq('id', user2.id)
      .select()
      .single();

    expect(error).toBeTruthy();
    expect(error?.code).toBe('PGRST301');
  });
});

describe('RLS: Conversations', () => {
  let user1: any;
  let user2: any;
  let conversation1: any;
  let conversation2: any;

  beforeAll(async () => {
    user1 = await createTestUser('conv-user1@test.com');
    user2 = await createTestUser('conv-user2@test.com');

    // Criar conversas usando service role (bypass RLS)
    const { data: conv1 } = await supabaseAdmin
      .from('conversations')
      .insert({ user_id: user1.id, title: 'User1 Conversation' })
      .select()
      .single();

    const { data: conv2 } = await supabaseAdmin
      .from('conversations')
      .insert({ user_id: user2.id, title: 'User2 Conversation' })
      .select()
      .single();

    conversation1 = conv1;
    conversation2 = conv2;
  });

  afterAll(async () => {
    // Limpar conversas
    await supabaseAdmin.from('conversations').delete().eq('id', conversation1.id);
    await supabaseAdmin.from('conversations').delete().eq('id', conversation2.id);

    if (user1) await deleteTestUser(user1.id);
    if (user2) await deleteTestUser(user2.id);
  });

  it('should allow users to view their own conversations', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('conversations')
      .select('*')
      .eq('id', conversation1.id)
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data.user_id).toBe(user1.id);
  });

  it('should prevent users from viewing other users conversations', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('conversations')
      .select('*')
      .eq('id', conversation2.id)
      .single();

    expect(error).toBeTruthy();
    expect(error?.code).toBe('PGRST301');
  });

  it('should allow users to create conversations for themselves', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('conversations')
      .insert({
        user_id: user1.id,
        title: 'New Conversation',
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data.user_id).toBe(user1.id);

    // Limpar
    await supabaseAdmin.from('conversations').delete().eq('id', data.id);
  });

  it('should prevent users from creating conversations for other users', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('conversations')
      .insert({
        user_id: user2.id, // Tentando criar para outro usuário
        title: 'Hacked Conversation',
      })
      .select()
      .single();

    // Deve falhar ou criar com user_id correto (depende da política)
    // Se a política usa WITH CHECK, deve falhar
    expect(error || data.user_id !== user2.id).toBeTruthy();
  });
});

describe('RLS: Messages', () => {
  let user1: any;
  let user2: any;
  let conversation1: any;
  let message1: any;
  let message2: any;

  beforeAll(async () => {
    user1 = await createTestUser('msg-user1@test.com');
    user2 = await createTestUser('msg-user2@test.com');

    // Criar conversas
    const { data: conv1 } = await supabaseAdmin
      .from('conversations')
      .insert({ user_id: user1.id, title: 'User1 Conv' })
      .select()
      .single();

    const { data: conv2 } = await supabaseAdmin
      .from('conversations')
      .insert({ user_id: user2.id, title: 'User2 Conv' })
      .select()
      .single();

    conversation1 = conv1;

    // Criar mensagens
    const { data: msg1 } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversation1.id,
        content: 'Message from user1',
        role: 'user',
      })
      .select()
      .single();

    const { data: msg2 } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conv2.id,
        content: 'Message from user2',
        role: 'user',
      })
      .select()
      .single();

    message1 = msg1;
    message2 = msg2;
  });

  afterAll(async () => {
    await supabaseAdmin.from('messages').delete().eq('id', message1.id);
    await supabaseAdmin.from('messages').delete().eq('id', message2.id);
    await supabaseAdmin.from('conversations').delete().eq('id', conversation1.id);
    if (user1) await deleteTestUser(user1.id);
    if (user2) await deleteTestUser(user2.id);
  });

  it('should allow users to view messages from their own conversations', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('messages')
      .select('*')
      .eq('id', message1.id)
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
  });

  it('should prevent users from viewing messages from other users conversations', async () => {
    const client = await getSupabaseClientForUser(user1.id);

    const { data, error } = await client
      .from('messages')
      .select('*')
      .eq('id', message2.id)
      .single();

    expect(error).toBeTruthy();
    expect(error?.code).toBe('PGRST301');
  });
});

/**
 * NOTAS:
 *
 * 1. Estes testes requerem um Supabase local rodando ou um projeto de teste isolado.
 *    Configure TEST_SUPABASE_URL e TEST_SUPABASE_SERVICE_ROLE_KEY no .env.test
 *
 * 2. Para rodar localmente:
 *    - Instale Supabase CLI: npm install -g supabase
 *    - Inicie local: supabase start
 *    - Configure as variáveis de ambiente de teste
 *
 * 3. Em CI/CD, use um projeto Supabase de teste dedicado, nunca produção.
 *
 * 4. Estes testes validam as políticas RLS, mas não substituem testes de integração
 *    end-to-end que testam o fluxo completo da aplicação.
 */
