# 🤖 Automação de Desenvolvimento

Este documento descreve os scripts de automação disponíveis no projeto.

## Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev
```
Inicia o servidor de desenvolvimento Next.js em `http://localhost:3000`

### Qualidade de Código

#### Lint

```bash
npm run lint           # Executa ESLint
npm run lint:fix       # Executa ESLint e corrige problemas automaticamente
```

#### Formatação

```bash
npm run format         # Formata todos os arquivos com Prettier
```

### Testes

```bash
npm run test              # Executa todos os testes unitários
npm run test:watch        # Executa testes em modo watch
npm run test:ui           # Interface visual de testes
npm run test:coverage     # Executa testes com relatório de cobertura
npm run test:e2e          # Executa testes E2E com Playwright
npm run test:e2e:ui       # Interface visual de testes E2E
```

### Build e Deploy

```bash
npm run build          # Build de produção
npm run start          # Inicia servidor de produção
```

### Automação Completa

```bash
npm run precommit      # Executa lint:fix + test (antes do commit)
npm run check          # Executa lint + test + build (verificação completa)
```

## Workflow Recomendado

### Para Desenvolvimento Diário

1. **Durante o desenvolvimento:**
   ```bash
   npm run dev          # Terminal 1: Servidor de desenvolvimento
   npm run test:watch   # Terminal 2: Testes em watch mode
   ```

2. **Antes de cada commit:**
   ```bash
   npm run precommit    # Corrige e testa automaticamente
   ```

3. **Antes de fazer push:**
   ```bash
   npm run check        # Verificação completa
   ```

### Para Pull Requests

Sempre execute antes de abrir um PR:

```bash
npm run check          # Verificação completa
npm run test:coverage  # Verifica cobertura de testes
```

## Configuração de Hooks Git (Opcional)

Para automatizar ainda mais, você pode instalar husky:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run precommit"
```

Isso fará com que os testes rodem automaticamente antes de cada commit.

## Troubleshooting

### Erros de Lint

Se encontrar erros de lint que não podem ser corrigidos automaticamente:

1. Execute `npm run lint` para ver os erros
2. Corrija manualmente ou desabilite regras específicas se necessário

### Testes Falhando

1. Execute `npm run test:watch` para ver os erros em tempo real
2. Verifique os arquivos de teste em `__tests__/` e `e2e/`

### Build Falhando

1. Execute `npm run lint` para verificar erros de TypeScript
2. Execute `npm run test` para verificar se há testes falhando

## Próximas Melhorias

- [ ] Integrar Husky para hooks Git automáticos
- [ ] Configurar GitHub Actions para CI/CD
- [ ] Adicionar pre-push hooks
- [ ] Configurar dependabot para atualizações automáticas
