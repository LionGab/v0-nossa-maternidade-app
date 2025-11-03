# 🔍 Explicação: Dois Sites Diferentes no Netlify

## Por Que Há Dois Sites?

1. **Production (Principal):**
   - URL: `https://nossamaternidade.netlify.app`
   - Deploy da branch configurada como "Production" (geralmente `main`)
   - Site que os usuários finais acessam

2. **Branch Deploy (Preview):**
   - URL: `https://devserver-main--nossamaternidade.netlify.app`
   - Deploy preview da branch `main`
   - Versão de teste/desenvolvimento

**Isso é normal no Netlify!** Cada branch e cada pull request gera um deploy preview único.

---

## Por Que o Onboarding Redireciona para Login?

### O Problema

O `/onboarding` **NÃO é uma rota pública**. Segundo o middleware (`proxy.ts`):

```16:17:proxy.ts
  // Rotas públicas que não requerem autenticação
  const publicRoutes = ["/", "/login", /signup", "/signup-success"]
```

**Rotas públicas:**
- `/` (home)
- `/login`
- `/signup`
- `/signup-success`

**Rotas protegidas (requerem autenticação):**
- `/onboarding` ← **PROTEGIDA**
- `/dashboard`
- `/chat`
- Todas as outras rotas

### O Fluxo Correto

```
1. Usuário acessa /signup
2. Preenche formulário e cria conta
3. Supabase cria usuário e redireciona para /onboarding
4. Usuário está AUTENTICADO (tem cookie de sessão)
5. Middleware permite acesso a /onboarding
6. Usuário completa onboarding
7. Redireciona para /dashboard
```

### Por Que Você Está Sendo Redirecionado?

Se você acessa `/onboarding` **sem estar autenticado**, o middleware detecta que não há sessão e redireciona para `/login`.

**Possíveis causas:**
1. **Cookie de sessão expirado** - Sua sessão expirou
2. **Cookie não foi salvo** - O signup não salvou o cookie corretamente (problema do Supabase)
3. **Acesso direto** - Você acessou `/onboarding` diretamente sem fazer signup/login primeiro
4. **URL malformada** - O parâmetro `onComplete=%28%29%3D%3Er%28%210%29` pode estar causando problemas

---

## 🔧 Soluções

### Solução 1: Fluxo Correto de Signup

1. **Acesse:** `https://nossamaternidade.netlify.app/signup`
2. **Preencha o formulário** e crie conta
3. **Após signup**, você será redirecionado automaticamente para `/onboarding`
4. **NÃO acesse `/onboarding` diretamente** sem estar autenticado

### Solução 2: Verificar Autenticação

Se você acabou de fazer signup e foi redirecionado para login:

1. **Verifique o console do browser (F12):**
   - Procure por erros relacionados ao Supabase
   - Verifique se há requisições falhando

2. **Verifique o Network tab:**
   - Procure por requisições para `supabase.co`
   - Veja se a URL está correta: `https://mnszbkeuerjcevjvdqme.supabase.co`
   - Se mostrar URL antiga (`bbcwitnbnosyfpjtzkr.supabase.co`), o problema está nas variáveis de ambiente

3. **Limpe cookies e tente novamente:**
   - Abra DevTools (F12) → Application → Cookies
   - Delete todos os cookies do site
   - Faça signup novamente

### Solução 3: Corrigir Parâmetro na URL

O parâmetro `onComplete=%28%29%3D%3Er%28%210%29` parece ser código JavaScript codificado (`()=>r(!0)`).

**Isso pode estar vindo de:**
- Um redirect malformado do Supabase
- Um link incorreto em algum lugar

**Solução:** Acesse `/onboarding` sem parâmetros:
- ❌ `https://nossamaternidade.netlify.app/onboarding?onComplete=%28%29%3D%3Er%28%210%29`
- ✅ `https://nossamaternidade.netlify.app/onboarding`

---

## 🔍 Verificar Qual Site Usar

### Para Testes/Desenvolvimento:
- Use: `https://devserver-main--nossamaternidade.netlify.app`
- É um deploy preview da branch `main`

### Para Produção:
- Use: `https://nossamaternidade.netlify.app`
- É o site principal que os usuários acessam

**Recomendação:** Use sempre o site de **produção** (`https://nossamaternidade.netlify.app`) para testes finais.

---

## ⚠️ Problema Principal: Signup "Failed to fetch"

O problema real que você está enfrentando é o **signup falhando** com "Failed to fetch". Isso acontece porque:

1. **Variáveis de ambiente incorretas** no Netlify
2. **URL do Supabase antiga** (`bbcwitnbnosyfpjtzkr.supabase.co` em vez de `mnszbkeuerjcevjvdqme.supabase.co`)

**Solução:** Siga o guia `CORRIGIR_SIGNUP_AGORA.md` para:
1. Deletar variáveis `EXPO_PUBLIC_*`
2. Atualizar `NEXT_PUBLIC_SUPABASE_URL`
3. Fazer deploy com cache limpo

---

## 📋 Checklist

- [ ] Usei o site de produção (`https://nossamaternidade.netlify.app`)
- [ ] Fiz signup primeiro (não tentei acessar `/onboarding` diretamente)
- [ ] Verifiquei que não há erros no console após signup
- [ ] Verifiquei no Network tab que a URL do Supabase está correta
- [ ] Limpei cookies e tentei novamente se necessário
- [ ] Acessei `/onboarding` apenas após fazer signup/login com sucesso

---

**Criado em:** 2025-11-03
