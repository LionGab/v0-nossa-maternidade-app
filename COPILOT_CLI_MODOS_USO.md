# 🚀 GitHub Copilot CLI - Modos de Uso e Automação

## 📋 Modos de Uso

### **1. Modo Interativo (Interactive Mode)** - Padrão

Inicie uma sessão interativa com o Copilot CLI:

```bash
# Iniciar sessão interativa
gh copilot

# Ou simplesmente
copilot
```

**Características:**
- Sessão contínua de conversação
- Você pode fazer múltiplas perguntas
- Copilot lembra o contexto da conversa
- Ideal para exploração e aprendizado

**Exemplo de Uso:**
```bash
$ copilot
Welcome to GitHub Copilot CLI!

> List my open PRs
> Show me the last 5 changes made to CHANGELOG.md
> Suggest improvements to content.js
```

---

### **2. Modo Programático (Programmatic Mode)** - Para Automação

Execute comandos únicos via linha de comando:

```bash
# Comando básico
copilot -p "Show me this week's commits and summarize them" --allow-tool 'shell(git)'

# Com aprovação automática (cuidado!)
copilot -p "Revert the last commit" --allow-all-tools

# Permitir ferramentas específicas
copilot -p "Commit the changes to this repo" --allow-tool 'shell(git)' --allow-tool 'write'
```

**Características:**
- Executa um comando e termina
- Ideal para automação e scripts
- Perfeito para tarefas noturnas
- Pode ser usado em pipelines CI/CD

---

## 🎯 Casos de Uso para Automação Noturna

### **Tarefas Locais (Local Tasks)**

#### **1. Gerar Testes Automatizados:**
```bash
copilot -p "Generate unit tests for all components in ./app directory with coverage. Save test files in appropriate test directories" --allow-tool 'write' --allow-tool 'shell'
```

#### **2. Refatorar Código:**
```bash
copilot -p "Refactor code in ./app directory following best practices and patterns. Generate a refactoring report in reports/" --allow-tool 'write' --allow-tool 'shell'
```

#### **3. Melhorar Documentação:**
```bash
copilot -p "Generate documentation for all components in ./app directory. Create JSDoc comments and a README in docs/ folder" --allow-tool 'write' --allow-tool 'shell'
```

#### **4. Analisar Performance:**
```bash
copilot -p "Analyze bundle size and performance of ./app. Check for large dependencies, unused code, and optimization opportunities. Generate a performance report in reports/" --allow-tool 'write' --allow-tool 'shell'
```

#### **5. Scan de Segurança:**
```bash
copilot -p "Scan ./app directory for security vulnerabilities. Check for exposed API keys, SQL injection risks, and other security issues. Generate a security report in reports/" --allow-tool 'write' --allow-tool 'shell(npm)' --allow-tool 'shell(git)'
```

---

### **Tarefas no GitHub.com (GitHub.com Tasks)**

#### **1. Listar PRs Abertos:**
```bash
copilot -p "List my open pull requests in OWNER/REPO"
```

#### **2. Trabalhar em uma Issue:**
```bash
copilot -p "I've been assigned this issue: https://github.com/OWNER/REPO/issues/1234. Start working on this for me in a suitably named branch" --allow-tool 'shell(git)' --allow-tool 'write'
```

#### **3. Criar PR com Mudanças:**
```bash
copilot -p "In the root of this repo, add a Node script called user-info.js that outputs information about the user who ran the script. Create a pull request to add this file to the repo on GitHub" --allow-tool 'shell(git)' --allow-tool 'write'
```

#### **4. Verificar Mudanças em PR:**
```bash
copilot -p "Check the changes made in PR https://github.com/OWNER/REPO/pull/57575. Report any serious errors you find in these changes"
```

#### **5. Criar Issue:**
```bash
copilot -p "Raise an improvement issue in OWNER/REPO. In src/someapp/somefile.py the \`file = open('data.txt', 'r')\` block opens a file but never closes it."
```

---

## 🔒 Segurança e Permissões

### **Trusted Directories**

Quando você inicia o Copilot CLI, ele pedirá confirmação para confiar no diretório:

- **Opção 1:** "The currently running session only" - apenas esta sessão
- **Opção 2:** "This and future sessions" - esta e futuras sessões

⚠️ **Atenção:** Escolha "This and future sessions" apenas se confiar no diretório!

---

### **Allowed Tools (Permissões de Ferramentas)**

#### **Opções de Aprovação:**

1. **`--allow-all-tools`** - Permite todas as ferramentas (CUIDADO!)
   ```bash
   copilot -p "Revert the last commit" --allow-all-tools
   ```

2. **`--allow-tool`** - Permite ferramenta específica
   ```bash
   copilot -p "Commit changes" --allow-tool 'shell(git)' --allow-tool 'write'
   ```

3. **`--deny-tool`** - Nega ferramenta específica
   ```bash
   copilot -p "..." --allow-all-tools --deny-tool 'shell(rm)' --deny-tool 'shell(git push --force)'
   ```

#### **Especificação de Ferramentas:**

- **`'shell(COMMAND)'`** - Permite comando shell específico
  ```bash
  --allow-tool 'shell(git)'
  --allow-tool 'shell(npm)'
  --deny-tool 'shell(rm)'
  ```

- **`'write'`** - Permite modificação de arquivos
  ```bash
  --allow-tool 'write'
  ```

- **`'MCP_SERVER_NAME'`** - Permite ferramentas de servidor MCP
  ```bash
  --allow-tool 'Supabase-MCP'
  --deny-tool 'Supabase-MCP(dangerous_tool)'
  ```

---

### **Configuração Recomendada para Automação Noturna**

#### **Permissões Seguras (Recomendado):**
```bash
# Permitir apenas ferramentas específicas
copilot -p "..." \
  --allow-tool 'write' \
  --allow-tool 'shell(git)' \
  --allow-tool 'shell(npm)' \
  --allow-tool 'shell(node)'
```

#### **Permissões com Negação (Mais Seguro):**
```bash
# Permitir tudo, exceto comandos perigosos
copilot -p "..." \
  --allow-all-tools \
  --deny-tool 'shell(rm)' \
  --deny-tool 'shell(rm -rf)' \
  --deny-tool 'shell(git push --force)' \
  --deny-tool 'shell(git push -f)'
```

#### **Permissões Totais (Apenas em Ambiente Isolado!):**
```bash
# Permitir tudo (CUIDADO!)
copilot -p "..." --allow-all-tools
```

⚠️ **Atenção:** Use `--allow-all-tools` apenas em:
- Ambiente isolado (VM, container)
- Sem acesso à internet
- Sistema dedicado para automação

---

## 📊 Integração com Plano Noturno

### **Exemplo de Script PowerShell:**

```powershell
# scripts/overnight-copilot.ps1

# FASE 1: Testes
Write-Step "Gerando testes com Copilot..."
copilot -p "Generate unit tests for all components in ./app directory with coverage" --allow-tool 'write' --allow-tool 'shell'

# FASE 2: Refatoração
Write-Step "Refatorando com Copilot..."
copilot -p "Refactor code in ./app directory following best practices. Generate a refactoring report in reports/" --allow-tool 'write' --allow-tool 'shell'

# FASE 3: Segurança
Write-Step "Scan de segurança com Copilot..."
copilot -p "Scan ./app directory for security vulnerabilities. Generate a security report in reports/" --allow-tool 'write' --allow-tool 'shell(npm)'

# FASE 4: Performance
Write-Step "Análise de performance com Copilot..."
copilot -p "Analyze bundle size and performance of ./app. Generate a performance report in reports/" --allow-tool 'write' --allow-tool 'shell'

# FASE 5: Documentação
Write-Step "Gerando documentação com Copilot..."
copilot -p "Generate documentation for all components in ./app directory. Create JSDoc comments in docs/" --allow-tool 'write' --allow-tool 'shell'
```

---

## 🎯 Uso de Modelos

### **Mudar Modelo:**

No modo interativo, use o comando `/model`:
```bash
$ copilot
> /model
# Selecione o modelo desejado
```

Modelos disponíveis:
- **Claude Sonnet 4** (padrão)
- **Claude Sonnet 4.5** (disponível na versão 0.0.329+)

---

## 📝 Quota de Solicitações

⚠️ **Importante:**
- Cada prompt no modo interativo = 1 solicitação premium
- Cada comando no modo programático = 1 solicitação premium
- Verifique sua quota em: [GitHub Copilot Requests](https://docs.github.com/pt/copilot/billing/copilot-requests)

---

## ✅ Checklist de Configuração

- [ ] GitHub CLI instalado (`gh --version`)
- [ ] Copilot CLI instalado (`gh copilot --version`)
- [ ] Autenticado (`gh auth login`)
- [ ] Diretório confiável configurado
- [ ] Permissões de ferramentas configuradas
- [ ] Scripts de automação criados
- [ ] Testado em modo dry-run
- [ ] Quota verificada

---

## 🎉 Pronto!

Agora você pode usar GitHub Copilot CLI para automação noturna!

**Próximos passos:**
1. Integrar com scripts de automação noturna
2. Configurar permissões adequadas
3. Testar em ambiente isolado
4. Agendar execução automática

---

**Referências:**
- [GitHub Copilot CLI Documentation](https://docs.github.com/pt/copilot/github-copilot-cli/using-github-copilot-cli)
- [GitHub Copilot CLI Security](https://docs.github.com/pt/copilot/github-copilot-cli/using-github-copilot-cli#security-considerations)

---

**Última atualização:** 2025-01-27
**Status:** ✅ Pronto para uso
