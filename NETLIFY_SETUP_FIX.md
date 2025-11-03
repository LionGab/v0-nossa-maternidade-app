# 🔧 Fix: Erro "Base directory does not exist: main"

## Problema

O erro ocorre quando o Netlify tenta interpretar a branch `main` como um diretório base.

## Solução Rápida

### No Netlify Dashboard:

1. Acesse seu site no Netlify Dashboard
2. Vá em **Site settings** → **Build & deploy** → **Build settings**
3. **IMPORTANTE**: Deixe o campo **"Base directory"** **VAZIO**
4. Certifique-se de que:
   - **Build command**: `npm install --legacy-peer-deps && npm run build`
   - **Publish directory**: (deixe vazio - o plugin Next.js gerencia isso)
   - **Branch**: `main`

### Ou via CLI:

```bash
netlify open
# Vá em Site settings → Build & deploy
# Remova qualquer valor em "Base directory"
```

## Configuração Correta

O `netlify.toml` agora tem `base = "."` explicitamente configurado para garantir que o base directory seja a raiz do projeto. Se o erro persistir:

1. **Remova configurações manuais** no Dashboard que conflitam com `netlify.toml`
2. **Use apenas o `netlify.toml`** para configurações de build
3. **Não defina** "Base directory" no Dashboard - o `netlify.toml` já gerencia isso

## Verificação

Após corrigir, faça um novo deploy:

```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

O build deve passar sem o erro de "Base directory does not exist".
