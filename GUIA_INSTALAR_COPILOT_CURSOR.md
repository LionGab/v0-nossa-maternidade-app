# 🚀 Guia: Instalar GitHub Copilot no Cursor

## 📋 Pré-requisitos

1. **GitHub Copilot Pro ativado**
   - Acesso ao [GitHub Copilot](https://github.com/features/copilot)
   - Plano Pro ativo

2. **Cursor instalado**
   - Cursor é baseado em VS Code, então funciona perfeitamente com extensões do VS Code

---

## 🎯 Método 1: Instalar via Marketplace (Recomendado)

### **Passo 1: Abrir Extensions**
1. Abra o Cursor
2. Pressione `Ctrl+Shift+X` (Windows/Linux) ou `Cmd+Shift+X` (macOS)
3. Ou clique no ícone de extensões na barra lateral

### **Passo 2: Buscar GitHub Copilot**
1. Na barra de busca, digite: `GitHub Copilot`
2. Você verá duas extensões:
   - **GitHub Copilot** (oficial)
   - **GitHub Copilot Chat** (opcional, para chat)

### **Passo 3: Instalar**
1. Clique em **"Install"** na extensão **GitHub Copilot**
2. Aguarde a instalação
3. Reinicie o Cursor se solicitado

### **Passo 4: Autenticar**
1. Após a instalação, você verá um prompt para autenticar
2. Clique em **"Sign in to GitHub"**
3. Autorize o acesso ao GitHub Copilot
4. Confirme a ativação

---

## 🎯 Método 2: Instalar via Command Palette

### **Passo 1: Abrir Command Palette**
1. Pressione `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (macOS)
2. Digite: `Extensions: Install Extensions`

### **Passo 2: Buscar e Instalar**
1. Digite: `GitHub Copilot`
2. Selecione a extensão oficial
3. Clique em **"Install"**

---

## ✅ Verificar Instalação

### **Teste Rápido:**
1. Abra um arquivo de código (`.js`, `.ts`, `.py`, etc.)
2. Digite um comentário ou função:
   ```javascript
   function calculateDaysBetweenDates(begin, end) {
   ```
3. Você deve ver sugestões de código aparecerem automaticamente
4. Pressione `Tab` para aceitar uma sugestão

### **Verificar Status:**
1. Abra o Command Palette (`Ctrl+Shift+P`)
2. Digite: `GitHub Copilot: Check Status`
3. Você deve ver: `✅ GitHub Copilot is active`

---

## 🎨 Configurações Recomendadas

### **1. Atalhos de Teclado**
Configure atalhos personalizados no Cursor:

```json
// settings.json
{
  "editor.inlineSuggest.enabled": true,
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.editor.enableAutoCompletions": true
}
```

### **2. Atalhos Personalizados**
- **Aceitar sugestão:** `Tab`
- **Próxima sugestão:** `Alt+]` (Windows/Linux) ou `Option+]` (macOS)
- **Sugestão anterior:** `Alt+[` (Windows/Linux) ou `Option+[` (macOS)
- **Rejeitar:** `Esc`
- **Aceitar palavra:** `Ctrl+→` (Windows/Linux) ou `Cmd+→` (macOS)

---

## 🔧 Solução de Problemas

### **Problema 1: Extensão não aparece**
**Solução:**
1. Verifique se você tem acesso ao GitHub Copilot Pro
2. Tente reiniciar o Cursor
3. Verifique sua conexão com a internet

### **Problema 2: Sugestões não aparecem**
**Solução:**
1. Verifique se a extensão está ativada:
   - `Ctrl+Shift+P` → `GitHub Copilot: Check Status`
2. Verifique se o GitHub Copilot está ativo na sua conta
3. Verifique se a detecção de duplicação está desabilitada (se necessário)

### **Problema 3: Erro de autenticação**
**Solução:**
1. Faça logout e login novamente:
   - `Ctrl+Shift+P` → `GitHub Copilot: Sign Out`
   - `Ctrl+Shift+P` → `GitHub Copilot: Sign In`
2. Verifique se você tem permissões no GitHub

---

## 🚀 Usar GitHub Copilot no Cursor

### **Sugestões Automáticas:**
1. Digite código normalmente
2. O Copilot sugere automaticamente
3. Pressione `Tab` para aceitar

### **Sugestões via Comentário:**
```javascript
// write a function to find all images without alternate text and give them a red border
```

### **Sugestões Alternativas:**
- Pressione `Alt+]` para ver próxima sugestão
- Pressione `Alt+[` para ver sugestão anterior

### **Aceitar Parcialmente:**
- `Ctrl+→` para aceitar próxima palavra
- Configure atalho personalizado para aceitar próxima linha

---

## 📚 Recursos Adicionais

### **GitHub Copilot Chat (Opcional)**
1. Instale a extensão **GitHub Copilot Chat**
2. Abra o chat com `Ctrl+Shift+P` → `GitHub Copilot: Open Chat`
3. Faça perguntas sobre seu código

### **Configurações Avançadas:**
- [Configurar GitHub Copilot](https://docs.github.com/pt/copilot/configuring-github-copilot/configuring-github-copilot-in-your-environment)
- [Atalhos de Teclado](https://docs.github.com/pt/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions)
- [Engenharia de Prompts](https://docs.github.com/pt/copilot/using-github-copilot/copilot-chat/prompt-engineering-for-copilot-chat)

---

## ✅ Checklist de Instalação

- [ ] GitHub Copilot Pro ativado
- [ ] Cursor instalado
- [ ] Extensão GitHub Copilot instalada
- [ ] Autenticação realizada
- [ ] Sugestões funcionando
- [ ] Atalhos configurados
- [ ] Teste realizado com sucesso

---

## 🎉 Pronto!

Agora você pode usar GitHub Copilot no Cursor!

**Próximos passos:**
1. Integrar com o plano de tarefas noturnas
2. Configurar automação via CLI
3. Usar Copilot Chat para perguntas

---

**Referências:**
- [Documentação Oficial GitHub Copilot](https://docs.github.com/pt/copilot)
- [Instalar no VS Code](https://code.visualstudio.com/docs/copilot/setup)
- [Cursor IDE](https://cursor.sh)

---

**Última atualização:** 2025-01-27
**Status:** ✅ Pronto para uso
