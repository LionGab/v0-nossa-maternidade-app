# 🚨 EXECUTAR AGORA - Corrigir Schema do Banco

## 🔍 Problema Identificado

```
column profiles.onboarding_completed does not exist
```

A tabela `profiles` existe, mas está faltando a coluna `onboarding_completed` que a aplicação precisa.

---

## ✅ Solução (2 minutos)

### Passo 1: Acesse o Supabase SQL Editor

1. Vá para: https://mnszbkeuerjcevjvdqme.supabase.co
2. Faça login se necessário
3. No menu lateral esquerdo, clique em: **SQL Editor**
4. Clique em: **New Query** (botão verde no canto superior direito)

### Passo 2: Execute o Script

1. Abra o arquivo: `scripts/add-missing-columns.sql`
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole no SQL Editor** do Supabase (Ctrl+V)
4. Clique no botão: **Run** (ou pressione Ctrl+Enter)

### Passo 3: Verifique o Resultado

Você deve ver mensagens como:
```
✅ Coluna onboarding_completed adicionada
✅ Coluna avatar_url adicionada
✅ Coluna phone adicionada
✅ Script de colunas faltantes executado com sucesso!
```

### Passo 4: Teste a Aplicação

```bash
# Reinicie o servidor (se estiver rodando)
# Ctrl+C no terminal e depois:
npm run dev
```

Acesse: http://localhost:3000/login

O erro `column profiles.onboarding_completed does not exist` deve desaparecer! ✅

---

## 📋 O que o Script Faz

O script `add-missing-columns.sql` adiciona:

1. **onboarding_completed** (boolean) - Controla se usuário completou onboarding
2. **avatar_url** (text) - URL da foto do perfil (futuro)
3. **phone** (text) - Telefone do usuário (futuro)
4. **Index** - Para buscas mais rápidas

Todas as adições são **seguras** e não afetam dados existentes.

---

## 🔧 Verificação

Depois de executar o script, você pode verificar no terminal:

```bash
node scripts/check-profiles-schema.mjs
```

Deve mostrar:
```
✅ Tabela profiles acessível
📋 Colunas atuais: ['id', 'email', 'full_name', 'created_at', 'updated_at', 'onboarding_completed', 'avatar_url', 'phone']
✅ Todas as colunas necessárias existem!
```

---

## ❓ Se Houver Erro

### Erro: "permission denied"
**Solução**: Você precisa estar logado como proprietário do projeto no Supabase.

### Erro: "relation profiles does not exist"
**Solução**: A tabela profiles não existe. Execute primeiro: `scripts/CONSOLIDATED_SETUP.sql`

---

## ⏭️ Próximos Passos

Depois que este script funcionar:

1. ✅ Testar login/signup
2. ✅ Completar onboarding
3. ✅ Testar perfil do bebê
4. ✅ Verificar outras funcionalidades

---

**Tempo estimado**: 2 minutos ⏱️

**Execute agora e me avise quando terminar!** 🚀
