# 🔒 Instalação do Pre-commit Hook de Segurança

Este hook bloqueia commits de arquivos `.env*` e alerta sobre possíveis secrets expostos.

---

## 📋 Instalação

### Opção 1: Git Hooks Nativo (Recomendado)

#### Windows (PowerShell)
```powershell
# Copiar script para .git/hooks
Copy-Item scripts/pre-commit-hook.ps1 .git/hooks/pre-commit

# Ou criar diretamente
Set-Content .git/hooks/pre-commit @"
#!/bin/sh
# Hook content here (mesmo conteúdo do script .sh)
"@
```

#### Linux/Mac
```bash
# Copiar script para .git/hooks
cp .git/hooks/pre-commit .git/hooks/pre-commit.backup  # Backup
cp scripts/pre-commit-hook.ps1 .git/hooks/pre-commit

# Ou usar o script shell diretamente
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# ... conteúdo do hook ...
EOF

# Tornar executável
chmod +x .git/hooks/pre-commit
```

---

### Opção 2: Usar Husky (Para projetos maiores)

Se quiser usar Husky para gerenciar hooks:

```bash
# Instalar Husky
npm install --save-dev husky

# Inicializar
npx husky install

# Adicionar hook
npx husky add .husky/pre-commit "node scripts/check-secrets.js"
```

Crie `scripts/check-secrets.js`:
```javascript
const { execSync } = require('child_process');

try {
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', {
    encoding: 'utf-8'
  }).split('\n').filter(Boolean);

  const envFiles = stagedFiles.filter(file =>
    /\.env$|\.env\.local$|\.env\.production$|\.env\.development$/.test(file) &&
    !/\.env\.example$/.test(file)
  );

  if (envFiles.length > 0) {
    console.error('❌ ERRO: Tentativa de commitar arquivo .env detectado!');
    console.error('Arquivos bloqueados:', envFiles);
    console.error('⚠️  NUNCA commite arquivos .env* com valores reais!');
    process.exit(1);
  }

  console.log('✅ Verificação de segurança concluída');
} catch (error) {
  console.error('Erro ao verificar secrets:', error.message);
  process.exit(1);
}
```

---

## ✅ Testar o Hook

### Teste 1: Tentar commitar .env.local (deve falhar)
```bash
# Criar arquivo de teste
echo "TEST_KEY=test123" > .env.local.test

# Tentar adicionar e commitar
git add .env.local.test
git commit -m "test"  # Deve falhar com mensagem de erro
```

### Teste 2: Commitar .env.example (deve passar)
```bash
git add .env.example
git commit -m "Update .env.example"  # Deve passar ✅
```

---

## 🔧 Desabilitar Hook (Temporariamente)

Se precisar fazer um commit sem o hook (não recomendado):

```bash
# Pular hook por um commit
git commit --no-verify -m "mensagem"

# ⚠️ ATENÇÃO: Use apenas em emergências e certifique-se de que não está commitando secrets!
```

---

## 📝 O que o Hook Faz

1. **Bloqueia commits de `.env*`** (exceto `.env.example`)
   - `.env`
   - `.env.local`
   - `.env.production`
   - `.env.development`

2. **Alerta sobre padrões suspeitos:**
   - JWT tokens (`eyJ...`)
   - API keys (`sk-`, `sk_`, `pk_`, `AIza`, `ghp_`, `xoxb-`, `xoxa-`)

3. **Permite `.env.example`:**
   - Arquivos `.env.example` são permitidos (são templates seguros)

---

## 🛡️ Proteções Adicionais

### 1. `.gitignore`
Certifique-se de que `.gitignore` contém:
```
.env*
!.env.example
```

### 2. Git Secret Scanning
Configure no GitHub:
- Settings → Security → Secret scanning
- Ativa automaticamente

### 3. CI/CD Checks
Adicione verificação no pipeline:
```yaml
# .github/workflows/security.yml
- name: Check for secrets
  run: |
    if git diff origin/main --name-only | grep -q '\.env'; then
      echo "❌ Arquivos .env detectados no diff!"
      exit 1
    fi
```

---

**Última atualização:** $(date)
