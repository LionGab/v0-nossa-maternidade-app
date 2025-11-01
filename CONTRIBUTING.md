# Contribuindo para Nossa Maternidade

Obrigado por considerar contribuir para o Nossa Maternidade! Este documento fornece diretrizes para contribuição.

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Depois clone seu fork
git clone https://github.com/SEU-USUARIO/nossa-maternidade-app.git
cd nossa-maternidade-app
```

### 2. Configurar Ambiente

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Criar Branch

```bash
# Criar branch para sua feature/fix
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bug
```

## 📝 Workflow de Desenvolvimento

### Antes de Codificar

1. **Puxe as últimas mudanças:**
   ```bash
   git checkout main
   git pull origin main
   git checkout sua-branch
   git rebase main
   ```

### Durante o Desenvolvimento

2. **Execute em paralelo:**
   - Terminal 1: `pnpm dev` - Servidor de desenvolvimento
   - Terminal 2: `pnpm test:watch` - Testes em watch mode

3. **Antes de cada commit:**
   ```bash
   pnpm precommit  # Executa lint + testes
   ```

### Antes de Fazer Push

4. **Verificação completa:**
   ```bash
   pnpm check  # Lint + Test + Build
   ```

5. **Push para seu fork:**
   ```bash
   git push origin sua-branch
   ```

## 🧪 Testes

### Escrevendo Testes

- **Testes Unitários:** Use Vitest em `__tests__/`
- **Testes E2E:** Use Playwright em `e2e/`

```bash
# Executar testes unitários
pnpm test

# Executar E2E
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### Testes Esperados

- ✅ Todos os testes devem passar
- ✅ Coverage mínimo: 70%
- ✅ Todos os componentes críticos testados

## 📋 Padrões de Código

### TypeScript

- Use TypeScript para todos os arquivos `.ts` e `.tsx`
- Evite `any`, prefira tipos específicos
- Use interfaces para objetos de dados

### React

- Use function components
- Use hooks do React
- Mantenha componentes pequenos e focados

### Estilo

```bash
# Formatação automática
pnpm format

# Verificar lint
pnpm lint
pnpm lint:fix  # Corrigir automaticamente
```

### Commits

Use conventional commits:

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação
refactor: refatora código
test: adiciona testes
chore: tarefas de manutenção
```

## 🎯 Pull Request Process

### Antes de Abrir PR

1. ✅ Todos os testes passando
2. ✅ Build funcionando
3. ✅ Sem erros de lint
4. ✅ Código formatado
5. ✅ Coverage adequado

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Refatoração
- [ ] Documentação
- [ ] Teste

## Checklist
- [ ] Testes passando
- [ ] Build funcionando
- [ ] Lint OK
- [ ] Documentação atualizada
- [ ] Covereage adequado

## Screenshots
(se aplicável)

## Referências
(issues relacionadas)
```

## 🐛 Reportar Bugs

Use o template de issue:

```
**Descrição**
Descrição clara do bug

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja erro

**Comportamento Esperado**
O que deveria acontecer

**Screenshots**
Se aplicável

**Ambiente**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Versão: [e.g. 1.0.0]
```

## 💡 Sugestões de Features

Use o template de feature request:

```
**Descrição da Feature**
Descrição clara e detalhada

**Problema que Resolve**
Qual problema isso resolve?

**Solução Proposta**
Como você imagina que funciona?

**Alternativas Consideradas**
Outras opções pensadas

**Contexto Adicional**
Qualquer informação relevante
```

## 📚 Recursos

- [README.md](README.md) - Visão geral do projeto
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura
- [API_DOCS.md](API_DOCS.md) - Documentação de APIs
- [AUTOMATION.md](AUTOMATION.md) - Scripts de automação
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de problemas

## 🤝 Código de Conduta

Este projeto segue o [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/).

## 📞 Dúvidas?

Se tiver dúvidas, abra uma issue com a tag `question`.

---

**Obrigado por contribuir! 🎉**
