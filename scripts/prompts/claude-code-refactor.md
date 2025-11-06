# 🔧 Prompt de Refatoração Profunda - Claude Code CLI

## Contexto
Baseado no relatório de análise gerado, refatore o código seguindo as melhores práticas mais recentes (2025) para Next.js 15, React 19, TypeScript 5.7.

## ⚠️ LIMITES DE SEGURANÇA - CRÍTICO

**IMPORTANTE**: Mesmo para refatoração, você está trabalhando em um repositório específico.

1. **Trabalhar APENAS no repositório atual**: Não acesse arquivos fora do repositório
2. **Auto Compact apenas para leitura**: Use auto compact para ler código, não para modificar
3. **Gerar código refatorado, não modificar diretamente**: Gere o código refatorado no relatório JSON, não modifique arquivos diretamente
4. **Esperar aprovação**: Mudanças devem ser revisadas antes de aplicar

**PROIBIDO**:
- ❌ Modificar arquivos diretamente sem permissão
- ❌ Executar comandos que alteram arquivos
- ❌ Acessar diretórios fora do repositório

**PERMITIDO**:
- ✅ Ler código usando auto compact
- ✅ Gerar código refatorado no relatório
- ✅ Sugerir mudanças específicas

## Instruções de Refatoração

### 1. APLICAR PRINCÍPIOS SOLID

Para cada módulo:
- **Single Responsibility**: Cada função/classe faz UMA coisa
- **Open/Closed**: Extensível sem modificar código existente
- **Liskov Substitution**: Substituições seguras
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Depender de abstrações

### 2. CLEAN CODE

- **Nomes descritivos**: `getUserData()` não `getData()`
- **Funções pequenas**: Máximo 50 linhas, idealmente 20
- **Sem side effects**: Funções puras quando possível
- **Comentários úteis**: Explicar "por quê", não "o quê"
- **Formatação consistente**: Prettier/ESLint

### 3. PADRÕES DE PROJETO

Aplique quando apropriado:
- **Factory**: Criação de objetos complexos
- **Strategy**: Algoritmos intercambiáveis
- **Observer**: Eventos e atualizações
- **Repository**: Abstração de dados
- **Service Layer**: Lógica de negócio separada

### 4. NEXT.JS 15 BEST PRACTICES

- **Server Components**: Usar por padrão
- **Client Components**: Apenas quando necessário
- **Streaming**: Usar `loading.tsx` e Suspense
- **Error Boundaries**: Tratamento de erros
- **Metadata API**: SEO otimizado
- **Route Handlers**: API routes modernos

### 5. REACT 19 PATTERNS

- **Hooks customizados**: Reutilizar lógica
- **Context API**: Estado global quando necessário
- **Memoization**: `useMemo`, `useCallback` adequados
- **Concurrent Features**: React 19 features quando aplicável

### 6. TYPESCRIPT STRICT

- **Zero `any`**: Tipos explícitos
- **Utility types**: `Pick`, `Omit`, `Partial` quando útil
- **Generics**: Reutilização de tipos
- **Type guards**: Validação de tipos

### 7. PERFORMANCE

- **Code splitting**: Lazy load de rotas
- **Tree shaking**: Imports específicos
- **Memoization**: Evitar re-renders
- **Image optimization**: Next.js Image component
- **Bundle analysis**: Identificar grandes dependências

### 8. SEGURANÇA

- **Input validation**: Zod schemas
- **Output encoding**: Sanitizar outputs
- **CSRF protection**: Tokens CSRF
- **Rate limiting**: Proteção de APIs
- **Secrets management**: Nunca em código

## Processo de Refatoração

1. **Backup**: Criar snapshot antes de refatorar
2. **Testes**: Garantir que testes passam antes
3. **Refatorar incrementalmente**: Pequenas mudanças
4. **Testar após cada mudança**: Garantir que funciona
5. **Documentar**: Comentários sobre decisões

## Formato do Relatório

```json
{
  "timestamp": "ISO 8601",
  "refactor_version": "2.0",
  "files_refactored": [],
  "changes_made": [
    {
      "file": "app/api/example/route.ts",
      "change_type": "refactor|optimize|security|cleanup",
      "description": "O que mudou",
      "before": "Código antigo",
      "after": "Código novo",
      "rationale": "Por que mudou"
    }
  ],
  "metrics": {
    "lines_removed": 0,
    "lines_added": 0,
    "complexity_reduced": 0,
    "test_coverage_maintained": true
  },
  "next_steps": []
}
```

## Critérios de Sucesso

- ✅ Código refatorado segue SOLID
- ✅ Zero `any` no TypeScript
- ✅ Testes ainda passam
- ✅ Performance mantida ou melhorada
- ✅ Segurança mantida ou melhorada

## Modelo e Auto Compact OBRIGATÓRIO

**IMPORTANTE**: Você DEVE usar auto compact para refatorar TODO o código afetado.

### Configuração Obrigatória:
- **Modelo**: `claude-opus` ou `claude-sonnet-4-5-20250929`
- **Context Window**: 200.000 tokens
- **Auto Compact Target**: 60.000 - 70.000 tokens
- **Modo**: `--print` com `--output-format json`

### Processo de Refatoração com Auto Compact:
1. Leia TODOS os arquivos que precisam refatoração
2. Compacte contexto mantendo relações importantes
3. Refatore código compactado
4. Valide mudanças linha por linha
5. NÃO pule arquivos - se necessário, compacte mais mas refatore tudo

### Validação:
- ✅ TODOS os arquivos listados no relatório foram refatorados
- ✅ Mudanças são consistentes entre arquivos relacionados
- ✅ Nenhum arquivo foi esquecido
