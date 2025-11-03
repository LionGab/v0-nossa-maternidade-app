# 🎯 Instruções para Cursor 2.0 + Claude

Este arquivo contém instruções específicas para usar o Cursor com Claude AI para implementar as correções e melhorias no projeto Nossa Maternidade.

---

## 🚀 Como Usar Este Documento

1. Abra o projeto no Cursor
2. Abra este arquivo (`CURSOR_INSTRUCTIONS.md`)
3. Use o Claude no Cursor para executar cada seção
4. Marque as tarefas conforme completa

## 🧠 Configurar MCPs no Cursor

Para que o Claude dentro do Cursor tenha acesso completo ao app, importe os MCPs essenciais (filesystem, git, Supabase e Brave Search).

1. Abra o Cursor e vá em **Settings → AI → Model Context Protocol (MCP)** (ou use `Ctrl/Cmd + Shift + P` → `Open MCP Settings`).
2. Clique em **Importar/Load from file** e selecione `cursor/mcp-config.json` deste repositório.
3. Ajuste os caminhos se o projeto estiver em outro diretório diferente de `/workspace` e preencha `BRAVE_API_KEY` com a sua chave.
4. Salve a configuração e reinicie o chat do Claude no Cursor para que os MCPs fiquem disponíveis.

> Dica: se preferir cadastrar manualmente, use os mesmos comandos exibidos no arquivo `cursor/mcp-config.json` (todos utilizam `npx`).

---

## 📋 Prompt Inicial para o Claude

\`\`\`
Olá Claude! Estou migrando o projeto "Nossa Maternidade" do v0 para desenvolvimento local.

Este é um app de maternidade com Next.js 15, Supabase, e Grok AI.

Por favor, leia os seguintes arquivos para entender o contexto:
1. CURSOR_MIGRATION_PLAN.md - Plano completo de migração
2. README.md - Overview do projeto
3. FIXES_CHECKLIST.md - Checklist de correções

Vamos começar pela FASE 1: Setup e Correções Críticas.

Você pode me ajudar a:
1. Verificar se o ambiente está configurado corretamente
2. Implementar a autenticação oficial do Supabase
3. Criar o middleware de proteção de rotas
4. Corrigir a trigger do banco de dados

Vamos começar?
\`\`\`

---

## 🔧 Comandos Úteis para o Claude

### Verificar Estado do Projeto

\`\`\`
Claude, por favor:
1. Liste todos os arquivos relacionados a autenticação
2. Verifique se há console.log("[v0]") no código
3. Identifique todas as APIs que precisam de validação
4. Liste todos os componentes que usam Supabase
\`\`\`

### Implementar Correções

\`\`\`
Claude, implemente a correção de autenticação:
1. Remova o arquivo lib/supabase/browser-client.ts
2. Crie lib/supabase/client.ts usando o padrão oficial do Supabase
3. Crie lib/supabase/server.ts para server-side
4. Crie middleware.ts para proteção de rotas
5. Atualize todas as páginas que usam autenticação

Use os exemplos do arquivo CURSOR_MIGRATION_PLAN.md seção 1.2
\`\`\`

### Adicionar Testes

\`\`\`
Claude, adicione testes para o sistema de onboarding:
1. Configure Vitest se ainda não estiver configurado
2. Crie testes para lib/validations/onboarding.ts
3. Crie testes para app/api/onboarding/route.ts
4. Crie testes E2E para o fluxo de onboarding

Use os exemplos do arquivo CURSOR_MIGRATION_PLAN.md seção 2.1 e 2.2
\`\`\`

### Refatorar Código

\`\`\`
Claude, refatore o componente GamificationWidget:
1. Remova todos os console.log
2. Adicione validação de props com Zod
3. Adicione tratamento de erros robusto
4. Use SWR para caching
5. Adicione loading states
6. Adicione testes unitários
\`\`\`

---

## 🎯 Prompts por Fase

### FASE 1: Setup e Correções Críticas

#### Prompt 1.1: Verificar Setup
\`\`\`
Claude, verifique se o ambiente está configurado corretamente:

1. Verifique se todas as dependências estão instaladas
2. Verifique se as variáveis de ambiente estão configuradas
3. Verifique se a conexão com Supabase está funcionando
4. Liste qualquer problema encontrado

Se encontrar problemas, sugira soluções.
\`\`\`

#### Prompt 1.2: Corrigir Autenticação
\`\`\`
Claude, implemente a autenticação oficial do Supabase:

Siga EXATAMENTE os passos da seção 1.2 do CURSOR_MIGRATION_PLAN.md:
1. Remova lib/supabase/browser-client.ts
2. Crie lib/supabase/client.ts (padrão oficial)
3. Crie lib/supabase/server.ts (padrão oficial)
4. Crie middleware.ts (proteção de rotas)
5. Atualize app/login/page.tsx
6. Atualize app/signup/page.tsx
7. Atualize todas as outras páginas que usam autenticação

Após implementar, teste o fluxo completo de login/signup.
\`\`\`

#### Prompt 1.3: Corrigir Trigger do Banco
\`\`\`
Claude, corrija a trigger handle_new_user() no Supabase:

1. Leia o script SQL da seção 1.3 do CURSOR_MIGRATION_PLAN.md
2. Crie um arquivo scripts/fix_handle_new_user.sql com o script
3. Me instrua como executar este script no Supabase

Explique o que a trigger faz e por que estava quebrada.
\`\`\`

#### Prompt 1.4: Remover Logs de Debug
\`\`\`
Claude, remova TODOS os console.log("[v0]") do código:

1. Busque por console.log("[v0]" em todos os arquivos
2. Remova cada ocorrência
3. Me mostre um resumo de quantos logs foram removidos e de quais arquivos

Mantenha apenas logs de erro importantes (console.error).
\`\`\`

#### Prompt 1.5: Adicionar Validação
\`\`\`
Claude, adicione validação com Zod em todas as APIs:

1. Crie schemas de validação em lib/validations/ para:
   - onboarding
   - chat
   - diary
   - community posts

2. Atualize as APIs para usar esses schemas:
   - app/api/onboarding/route.ts
   - app/api/multi-ai/chat/route.ts
   - app/api/diary/route.ts (se existir)

Use os exemplos da seção 1.5 do CURSOR_MIGRATION_PLAN.md
\`\`\`

---

### FASE 2: Testes e Qualidade

#### Prompt 2.1: Configurar Vitest
\`\`\`
Claude, configure Vitest para testes unitários:

1. Instale as dependências necessárias
2. Crie vitest.config.ts
3. Crie vitest.setup.ts
4. Adicione scripts no package.json:
   - "test": "vitest"
   - "test:ui": "vitest --ui"
   - "test:coverage": "vitest --coverage"

Use a configuração da seção 2.1 do CURSOR_MIGRATION_PLAN.md
\`\`\`

#### Prompt 2.2: Criar Testes Unitários
\`\`\`
Claude, crie testes unitários para os componentes principais:

1. Crie __tests__/lib/validations/ com testes para todos os schemas
2. Crie __tests__/components/ com testes para:
   - GamificationWidget
   - DarkModeToggle
   - AppSidebar

3. Crie __tests__/lib/hooks/ com testes para hooks customizados

Meta: 60%+ de cobertura de código
\`\`\`

#### Prompt 2.3: Configurar Playwright
\`\`\`
Claude, configure Playwright para testes E2E:

1. Instale Playwright
2. Crie playwright.config.ts
3. Crie e2e/auth.spec.ts com testes de autenticação
4. Crie e2e/onboarding.spec.ts com testes de onboarding
5. Crie e2e/gamification.spec.ts com testes de gamificação

Use os exemplos da seção 2.3 do CURSOR_MIGRATION_PLAN.md
\`\`\`

---

### FASE 3: Performance e Segurança

#### Prompt 3.1: Adicionar Indexes
\`\`\`
Claude, crie indexes no banco para melhorar performance:

1. Analise as queries mais comuns no código
2. Crie um arquivo scripts/add_indexes.sql com indexes apropriados
3. Me explique quais indexes você criou e por quê

Use os exemplos da seção 3.1 do CURSOR_MIGRATION_PLAN.md
\`\`\`

#### Prompt 3.2: Implementar Caching
\`\`\`
Claude, implemente caching com SWR:

1. Crie hooks customizados em lib/hooks/ para:
   - useGamification
   - useProfile
   - useCommunityPosts
   - useDiaryEntries

2. Atualize os componentes para usar esses hooks
3. Configure revalidação apropriada

Use os exemplos da seção 3.2 do CURSOR_MIGRATION_PLAN.md
\`\`\`

#### Prompt 3.3: Implementar Rate Limiting
\`\`\`
Claude, implemente rate limiting nas APIs:

1. Crie lib/rate-limit.ts usando Upstash
2. Adicione rate limiting em todas as APIs públicas
3. Configure limites apropriados para cada endpoint

Use os exemplos da seção 3.3 do CURSOR_MIGRATION_PLAN.md
\`\`\`

---

### FASE 4: Documentação e Deploy

#### Prompt 4.1: Criar Documentação
\`\`\`
Claude, crie documentação completa do projeto:

1. Atualize README.md com:
   - Setup detalhado
   - Estrutura do projeto
   - Como rodar testes
   - Como fazer deploy

2. Crie ARCHITECTURE.md explicando:
   - Estrutura de pastas
   - Fluxo de dados
   - Integrações
   - Decisões de arquitetura

3. Crie API_DOCS.md documentando todas as APIs

4. Crie TROUBLESHOOTING.md com problemas comuns e soluções
\`\`\`

#### Prompt 4.2: Configurar CI/CD
\`\`\`
Claude, configure CI/CD com GitHub Actions:

1. Crie .github/workflows/ci.yml
2. Configure jobs para:
   - Lint
   - Type check
   - Testes unitários
   - Testes E2E
   - Build

Use o exemplo da seção 4.2 do CURSOR_MIGRATION_PLAN.md
\`\`\`

#### Prompt 4.3: Configurar Monitoramento
\`\`\`
Claude, configure monitoramento e error tracking:

1. Configure Sentry para error tracking
2. Configure Vercel Analytics
3. Adicione logging estruturado
4. Configure alertas para erros críticos

Use os exemplos da seção 4.3 do CURSOR_MIGRATION_PLAN.md
\`\`\`

---

## 🔍 Prompts de Debugging

### Quando algo não funciona

\`\`\`
Claude, estou tendo um problema com [descreva o problema].

Por favor:
1. Analise o código relacionado
2. Identifique a causa raiz do problema
3. Sugira uma solução
4. Implemente a correção
5. Adicione testes para prevenir regressão

Arquivos relacionados: [liste os arquivos]
Mensagem de erro: [cole o erro]
\`\`\`

### Para entender código existente

\`\`\`
Claude, explique como funciona [componente/função/API]:

1. Qual é o propósito?
2. Como funciona internamente?
3. Quais são as dependências?
4. Há algum problema ou código smell?
5. Como poderia ser melhorado?

Arquivo: [caminho do arquivo]
\`\`\`

---

## 📊 Prompts de Análise

### Análise de Performance

\`\`\`
Claude, analise a performance do app:

1. Identifique queries lentas no banco
2. Identifique componentes pesados
3. Identifique oportunidades de caching
4. Identifique oportunidades de lazy loading
5. Sugira melhorias específicas com código
\`\`\`

### Análise de Segurança

\`\`\`
Claude, faça uma auditoria de segurança:

1. Verifique se todas as rotas estão protegidas
2. Verifique se há validação de entrada em todas as APIs
3. Verifique se as RLS policies estão corretas
4. Identifique vulnerabilidades potenciais
5. Sugira correções para cada problema encontrado
\`\`\`

### Análise de Código

\`\`\`
Claude, faça uma revisão de código:

1. Identifique código duplicado
2. Identifique code smells
3. Identifique oportunidades de refatoração
4. Verifique se há best practices sendo seguidas
5. Sugira melhorias específicas
\`\`\`

---

## 🎓 Dicas para Trabalhar com Claude no Cursor

### 1. Seja Específico
❌ "Corrija a autenticação"
✅ "Implemente autenticação usando @supabase/ssr seguindo o padrão oficial, removendo o browser-client.ts customizado"

### 2. Forneça Contexto
Sempre mencione:
- Qual arquivo você está trabalhando
- O que você está tentando fazer
- Qual erro você está vendo (se houver)

### 3. Peça Explicações
Não apenas peça código, peça explicações:
- "Por que essa abordagem é melhor?"
- "Quais são os trade-offs?"
- "Como isso funciona internamente?"

### 4. Revise o Código
Sempre revise o código que o Claude gera:
- Entenda o que ele faz
- Teste manualmente
- Adicione testes automatizados

### 5. Itere
Se a primeira solução não for perfeita:
- Peça melhorias específicas
- Sugira alternativas
- Discuta trade-offs

---

## ✅ Checklist de Uso

Antes de começar cada fase:
- [ ] Li o plano de migração completo
- [ ] Entendi o que precisa ser feito
- [ ] Tenho o ambiente configurado
- [ ] Fiz backup do código atual

Durante cada fase:
- [ ] Sigo os prompts na ordem
- [ ] Testo cada mudança
- [ ] Commito código funcionando
- [ ] Documento mudanças importantes

Após cada fase:
- [ ] Todos os testes passando
- [ ] Código revisado
- [ ] Documentação atualizada
- [ ] Mudanças commitadas

---

**Boa sorte com a implementação! 🚀**
