# ⚡ AÇÃO IMEDIATA - PRÓXIMOS 30 MINUTOS

## 🔴 CRÍTICO - FAÇA AGORA

### 1. Executar Migration no Supabase (5 minutos)

**O QUE FAZER:**
1. Acesse: https://mnszbkeuerjcevjvdqme.supabase.co
2. Faça login
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Abra o arquivo: `supabase/migrations/20250103_complete_setup.sql`
6. Copie TODO o conteúdo
7. Cole no SQL Editor
8. Clique em **RUN**
9. Aguarde mensagem de sucesso

**VERIFICAÇÃO:**
Execute estas queries no SQL Editor:
```sql
-- Deve retornar 1 linha
SELECT column_name FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'onboarding_completed';

-- Deve retornar 1 linha
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Deve retornar 1 linha
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
```

**SE FALHAR:** Pare tudo e me avise. SEM ISSO, NADA FUNCIONA.

---

### 2. Validar Variáveis de Ambiente (2 minutos)

**O QUE FAZER:**
```bash
npm run validate:env
```

**RESULTADO ESPERADO:**
- ✅ Variáveis obrigatórias: 2/2
- ✅ Variáveis opcionais: 5/6

**SE FALHAR:**
```bash
npm run create:env
npm run validate:env
```

---

### 3. Iniciar Servidor e Testar Signup (10 minutos)

**O QUE FAZER:**
```bash
npm run dev
```

**TESTE:**
1. Acesse: http://localhost:3000/signup
2. Preencha:
   - Email: teste@teste.com
   - Senha: senha123
   - Nome: Teste Usuário
3. Clique em "Criar Conta"
4. **DEVE:** Redirecionar para `/signup-success` ou `/onboarding`
5. **NÃO DEVE:** Mostrar erro 500 ou "Failed to fetch"

**VERIFICAÇÃO NO SUPABASE:**
1. Dashboard → Authentication → Users
2. Deve aparecer o usuário criado
3. Dashboard → Table Editor → profiles
4. Deve ter registro com `onboarding_completed = false`

**SE FALHAR:** Verificar logs do servidor, verificar trigger no Supabase.

---

### 4. Testar Login (5 minutos)

**O QUE FAZER:**
1. Acesse: http://localhost:3000/login
2. Faça login com:
   - Email: teste@teste.com
   - Senha: senha123
3. **DEVE:** Redirecionar para `/dashboard`
4. **NÃO DEVE:** Mostrar erro ou ficar em loop

**SE FALHAR:** Verificar autenticação, verificar middleware.

---

### 5. Testar Onboarding (8 minutos)

**O QUE FAZER:**
1. Após signup, completar onboarding:
   - Responder todas as perguntas
   - Clicar em "Finalizar"
2. **DEVE:** Redirecionar para `/dashboard`
3. **VERIFICAÇÃO NO SUPABASE:**
   - Dashboard → Table Editor → onboarding_responses
   - Deve ter registro
   - Dashboard → Table Editor → profiles
   - Deve ter `onboarding_completed = true`

**SE FALHAR:** Verificar API `/api/onboarding`, verificar coluna no Supabase.

---

## ✅ CHECKLIST RÁPIDO

Após os 30 minutos, você deve ter:

- [ ] Migration executada no Supabase
- [ ] Variáveis de ambiente validadas
- [ ] Servidor rodando
- [ ] Signup funcionando
- [ ] Login funcionando
- [ ] Onboarding funcionando
- [ ] Dados salvos no Supabase

---

## 🚨 SE ALGO FALHAR

1. **PARE TUDO**
2. **ANOTE O ERRO**
3. **VERIFIQUE OS LOGS**
4. **ME AVISE**

**NÃO TENTE CONTINUAR COM BUGS.**

---

## 📋 PRÓXIMOS PASSOS

Após completar os 30 minutos:

1. Continuar com **FASE 2** do `PLANO_ACAO_COMPLETO.md`
2. Testar todas as APIs
3. Implementar TODOs críticos
4. Implementar testes E2E

---

**⚡ COMECE AGORA: Execute a migration no Supabase!**
