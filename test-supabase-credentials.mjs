import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mnszbkeuerjcevjvdqme.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc3pia2V1ZXJqY2V2anZkcW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTY3ODEsImV4cCI6MjA3NzQ5Mjc4MX0.f2jPp6KLzzrJPTt63FKNyDanh_0uw9rJ1-gbSvQFueo'

console.log('🔍 Testando credenciais do Supabase...\n')

// Teste 1: Criar cliente
console.log('1️⃣ Testando criação do cliente...')
try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Cliente criado com sucesso\n')

  // Teste 2: Verificar conexão com a API
  console.log('2️⃣ Testando conexão com a API...')
  const { data: healthCheck, error: healthError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)

  if (healthError && healthError.code !== 'PGRST116') {
    console.log('❌ Erro na conexão:', healthError.message)
    console.log('❌ Código:', healthError.code)
  } else {
    console.log('✅ Conexão com API funcionando\n')
  }

  // Teste 3: Testar login
  console.log('3️⃣ Testando login...')
  const email = 'eugabrielmktd@gmail.com'
  const password = 'adogo123'

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    console.log('❌ Erro no login:', authError.message)
    console.log('❌ Status:', authError.status)
  } else {
    console.log('✅ Login realizado com sucesso!')
    console.log('✅ Usuário:', authData.user?.email)
    console.log('✅ ID:', authData.user?.id)
    console.log('✅ Session:', authData.session ? 'Criada' : 'Não criada')
  }

  // Teste 4: Verificar tabelas
  console.log('\n4️⃣ Verificando acesso às tabelas...')
  const tables = ['profiles', 'baby_profiles', 'onboarding_responses']

  for (const table of tables) {
    const { error: tableError } = await supabase
      .from(table)
      .select('id')
      .limit(1)

    if (tableError) {
      console.log(`❌ Tabela ${table}:`, tableError.message)
    } else {
      console.log(`✅ Tabela ${table}: Acessível`)
    }
  }

} catch (error) {
  console.log('❌ Erro crítico:', error.message)
  console.log(error)
}
