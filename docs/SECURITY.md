# Segurança - Nossa Maternidade

> Políticas de segurança, RLS (Row Level Security), moderação de conteúdo e compliance LGPD.

---

## 🔐 Princípios de Segurança

### 1. Defense in Depth
- Múltiplas camadas de segurança
- Validação em cada camada (cliente → API → banco)
- Fail-safe defaults

### 2. Least Privilege
- Usuários têm acesso mínimo necessário
- Service roles apenas para operações críticas
- Secrets com escopo restrito

### 3. Data Minimization (LGPD)
- Coletar apenas dados necessários
- Anonimização quando possível
- Retenção limitada

---

## 🔒 Row Level Security (RLS)

### Políticas RLS no Supabase

**Tabela: `profiles`**
```sql
-- Usuários só veem seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Usuários só atualizam seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**Tabela: `conversations`**
```sql
-- Usuários só veem suas próprias conversas
CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (auth.uid() = user_id);

-- Usuários só criam conversas para si
CREATE POLICY "Users can create own conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Tabela: `messages` (moderação)**
```sql
-- Usuários veem mensagens de suas conversas
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND conversations.user_id = auth.uid()
  )
);

-- Moderação: admins podem ver todas as mensagens
CREATE POLICY "Admins can view all messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### Contract Tests para RLS

Ver `tests/contracts/rls.test.ts` (template abaixo).

---

## 🛡️ Moderação de Conteúdo

### Fluxo de Moderação

```
1. Usuário envia mensagem
   ↓
2. Edge Function: moderação-check
   ↓
3. IA Provider (Claude) analisa risco
   ↓
4. Se risk_level > THRESHOLD:
   → Flag: requires_human_review = true
   → Bloqueia publicação
   → Notifica admin
   ↓
5. Admin revisa manualmente
   ↓
6. Aprova ou rejeita
```

### Risk Levels

```typescript
// packages/shared/nat-ai/types.ts
export enum RiskLevel {
  SAFE = 0,           // Publicação imediata
  LOW = 1,            // Publicação com aviso
  MEDIUM = 2,         // Requer revisão humana
  HIGH = 3,           // Bloqueado + alerta admin
  CRITICAL = 4        // Bloqueado + notificação urgente
}
```

### Guardrails

**packages/shared/nat-ai/guardrails.ts:**
```typescript
export const MODERATION_RULES = {
  // Palavras proibidas (lista curta, complementa IA)
  BLOCKED_WORDS: ['...'],

  // Padrões suspeitos
  SUSPICIOUS_PATTERNS: [
    /(http|https):\/\/[^\s]+/g,  // Links externos
    /[0-9]{3,}/g,                 // Números longos (possível telefone)
  ],

  // Limites de taxa
  RATE_LIMITS: {
    messages_per_minute: 10,
    messages_per_hour: 100,
  },

  // Thresholds de risco
  RISK_THRESHOLDS: {
    SAFE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
  },
} as const;
```

---

## 🔑 Gestão de Secrets

### Nomenclatura Unificada

```bash
# Supabase
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# IA Providers
ANTHROPIC_API_KEY      # Claude
GEMINI_API_KEY         # Gemini
PERPLEXITY_API_KEY     # Perplexity
MANUS_API_KEY          # Manus

# Monitoramento
SENTRY_DSN
SENTRY_AUTH_TOKEN

# Expo/EAS
EAS_TOKEN
EXPO_PROJECT_ID

# Ambiente
APP_ENV                # dev | staging | prod
```

### Rotação de Secrets

**Frequência:**
- **Service roles**: Trimestral
- **API keys IA**: Mensal (se possível)
- **Tokens EAS**: Anual (ou quando expirar)

**Processo:**
1. Gerar novo secret
2. Atualizar em todos os ambientes (dev → staging → prod)
3. Testar em staging
4. Atualizar em produção
5. Invalidar secret antigo após 7 dias

Ver `docs/SECRETS_ROTATION_GUIDE.md`.

---

## 📋 Compliance LGPD

### Dados Coletados

**Minimização:**
- Nome (opcional)
- Email (obrigatório para conta)
- Data de nascimento (opcional)
- Gestação: semana atual (opcional)
- Mensagens de conversa (necessário para funcionalidade)

**Não coletamos:**
- CPF
- Endereço completo
- Telefone
- Dados de pagamento (se houver premium no futuro)

### Direitos do Usuário

**LGPD Art. 18:**
- ✅ **Acesso**: Usuário pode exportar dados
- ✅ **Correção**: Usuário pode editar perfil
- ✅ **Exclusão**: Usuário pode deletar conta
- ✅ **Portabilidade**: Export em JSON
- ✅ **Revogação de consentimento**: Deletar conta

### Implementação

**Edge Function: `export-user-data`**
```typescript
// Retorna todos os dados do usuário em JSON
export async function exportUserData(userId: string) {
  const profile = await getProfile(userId);
  const conversations = await getConversations(userId);
  const messages = await getMessages(userId);

  return {
    profile,
    conversations,
    messages,
    exportedAt: new Date().toISOString(),
  };
}
```

**Edge Function: `delete-user-data`**
```typescript
// Deleta todos os dados do usuário (LGPD)
export async function deleteUserData(userId: string) {
  // Soft delete (anonymize)
  await anonymizeProfile(userId);
  await anonymizeConversations(userId);
  await anonymizeMessages(userId);

  // Hard delete após 30 dias (job agendado)
  await scheduleHardDelete(userId, 30);
}
```

---

## 🔍 Auditoria e Logs

### Logs de Segurança

**Eventos logados:**
- Login/logout
- Tentativas de acesso negadas (RLS)
- Mensagens flagadas (moderação)
- Ações administrativas
- Exports/deletes de dados (LGPD)

**Formato:**
```typescript
{
  timestamp: string;
  event: 'login' | 'access_denied' | 'moderation_flag' | 'admin_action' | 'data_export';
  userId: string;
  metadata: Record<string, unknown>;
}
```

### Alertas

**Sentry Alerts:**
- Múltiplas tentativas de acesso negadas
- Risk level CRITICAL em moderação
- Falhas em RLS policies
- Exports/deletes em massa

---

## 🧪 Testes de Segurança

### Contract Tests (RLS)

**tests/contracts/rls.test.ts:**
```typescript
describe('RLS Policies', () => {
  it('should prevent users from viewing other users profiles', async () => {
    const user1 = await createTestUser();
    const user2 = await createTestUser();

    const profile = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user2.id)
      .setAuth(user1.id)
      .single();

    expect(profile.error).toBeTruthy();
    expect(profile.error.code).toBe('PGRST301');
  });

  it('should allow users to view own profile', async () => {
    const user = await createTestUser();

    const profile = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .setAuth(user.id)
      .single();

    expect(profile.data).toBeTruthy();
  });
});
```

### Security Scans

**GitHub Actions:**
```yaml
- name: Security Scan
  run: |
    npm audit --audit-level=high
    npx snyk test --severity-threshold=high
```

---

## 📚 Referências

- [LGPD - Lei Geral de Proteção de Dados](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Expo Security](https://docs.expo.dev/guides/security/)

---

**Última atualização:** 2025-01-27
**Mantido por:** Equipe Nossa Maternidade
