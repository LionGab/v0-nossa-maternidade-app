# 🔧 Troubleshooting Netlify - Build Errors

## ❌ Erro: "Failed to fetch cache, continuing with build" e depois para

### Diagnóstico

O build está falhando silenciosamente após tentar buscar o cache. Os logs param antes de mostrar o erro real.

**⚠️ CAUSA COMUM:** O projeto usa `pnpm` (tem `pnpm-lock.yaml`) mas está configurado para `npm`!

### Soluções

#### 1. ✅ Verificar Build Command

Certifique-se de que o `netlify.toml` tem o comando correto:

```toml
[build]
  command = "npm install && npm run build"
  publish = ".next"
```

#### 2. ✅ Instalar Plugin Next.js

O plugin `@netlify/plugin-nextjs` precisa estar instalado. Vá em:

**Netlify Dashboard → Site settings → Plugins → Add plugin**

Ou adicione ao `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 3. ✅ Verificar Node Version

Configure no Netlify:

**Site settings → Build & deploy → Environment → Add variable**

```
NODE_VERSION = 20
```

Ou no `netlify.toml`:

```toml
[build.environment]
  NODE_VERSION = "20"
```

#### 4. ✅ Verificar Package Manager (IMPORTANTE!)

**Se o projeto usa `pnpm` (tem `pnpm-lock.yaml`):**

Configure no `netlify.toml`:

```toml
[build]
  command = "corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm run build"

[build.environment]
  PNPM_VERSION = "latest"
  PNPM_FLAGS = "--shamefully-hoist"
```

**Se usar `npm`:**

```toml
[build]
  command = "npm install && npm run build"
```

⚠️ **ERRO COMUM:** Usar `npm` quando o projeto usa `pnpm` causa build failures!

#### 5. ✅ Variáveis de Ambiente

Certifique-se de que TODAS as variáveis de ambiente estão configuradas:

**Site settings → Environment variables → Add variable**

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
OPENAI_API_KEY
GEMINI_API_KEY
PERPLEXITY_API_KEY
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
```

#### 6. ✅ Download Logs Completos

Para ver o erro real:

1. Vá em **Deploys** → clique no deploy falhado
2. Clique em **"Download logs"** no topo direito
3. Veja os logs completos para encontrar o erro real

#### 7. ✅ Build Local Primeiro

Teste o build localmente antes de fazer deploy:

```bash
npm install
npm run build
```

Se funcionar localmente, o problema está na configuração do Netlify.

#### 8. ✅ Limpar Cache do Netlify

1. Vá em **Site settings → Build & deploy → Post processing**
2. Clique em **"Clear cache and deploy site"**

#### 9. ✅ Verificar package.json

Certifique-se de que os scripts estão corretos:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

#### 10. ✅ Verificar next.config.mjs

O arquivo `next.config.mjs` deve existir na raiz do projeto.

---

## 🔍 Diagnóstico Avançado

### Verificar Logs Completos

1. **Netlify Dashboard** → **Deploys** → Deploy falhado
2. Clique em **"Download logs"**
3. Procure por erros como:
   - `ENOENT` (arquivo não encontrado)
   - `Module not found`
   - `Command failed`
   - `Build failed`

### Build Local com Output Detalhado

```bash
# Limpar cache
rm -rf .next node_modules package-lock.json

# Instalar do zero
npm install

# Build com output detalhado
npm run build 2>&1 | tee build.log
```

Envie o arquivo `build.log` se precisar de ajuda.

---

## 🚀 Configuração Recomendada para Netlify

### netlify.toml Completo

```toml
[build]
  command = "npm install && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"
  NPM_VERBOSE = "true"

[context.production.environment]
  NODE_ENV = "production"

[context.deploy-preview.environment]
  NODE_ENV = "development"
```

### Variáveis de Ambiente Necessárias

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ ANTHROPIC_API_KEY
✅ OPENAI_API_KEY
✅ GEMINI_API_KEY (opcional)
✅ PERPLEXITY_API_KEY (opcional)
✅ NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
```

---

## 📋 Checklist de Debugging

Antes de pedir ajuda, verifique:

- [ ] Build funciona localmente (`npm run build`)
- [ ] Todas as variáveis de ambiente configuradas no Netlify
- [ ] Plugin `@netlify/plugin-nextjs` instalado
- [ ] Node version 20 configurada
- [ ] `netlify.toml` na raiz do projeto
- [ ] Logs completos baixados e revisados
- [ ] Cache limpo no Netlify
- [ ] `package.json` tem script `build` correto

---

## 🆘 Ainda com Problemas?

Se nenhuma solução funcionou:

1. **Download logs completos** e compartilhe o erro real
2. **Teste build local** e compartilhe o resultado
3. **Verifique** se todas as dependências estão instaladas
4. **Consulte** a documentação do Netlify para Next.js:
   - [Netlify Next.js Docs](https://docs.netlify.com/integrations/frameworks/next-js/)

---

**Última atualização:** 2025-11-01
