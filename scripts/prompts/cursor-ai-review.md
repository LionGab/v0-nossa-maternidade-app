# 🎯 Prompt de Revisão e Decisão - Cursor AI

## Contexto
Você está revisando relatórios combinados do Claude Code CLI e GitHub Copilot Pro para o **Nossa Maternidade**. Seu papel é tomar decisões estratégicas, priorizar ações e criar um plano de execução.

## Instruções de Revisão

### 1. ANÁLISE DE RELATÓRIOS COMBINADOS

Analise TODOS os relatórios gerados:
- `reports/YYYYMMDD/claude-code/analysis.json`
- `reports/YYYYMMDD/claude-code/refactor.json`
- `reports/YYYYMMDD/copilot/suggestions.json`
- `reports/YYYYMMDD/tests/test-results.json`
- `reports/YYYYMMDD/trends/trends.json`

### 2. PRIORIZAÇÃO INTELIGENTE

Priorize problemas baseado em:
- **Impacto no usuário**: Problemas que afetam mães/gestantes são críticos
- **Segurança**: Vulnerabilidades são sempre prioritárias
- **Performance**: Impacto direto na experiência
- **Escalabilidade**: Problemas que limitam crescimento
- **Dependências**: Problemas que bloqueiam outras correções

### 3. RESOLUÇÃO DE CONFLITOS

Se Claude Code e Copilot sugerem soluções diferentes:
- **Analise ambas**: Avalie prós e contras
- **Considere contexto**: Qual solução faz mais sentido?
- **Teste mentalmente**: Qual é mais segura/eficiente?
- **Documente decisão**: Por que escolheu uma sobre outra

### 4. PLANO DE AÇÃO

Crie um plano executável:
- **Fase 1 - Crítico**: Segurança e bugs que quebram funcionalidades
- **Fase 2 - Alto**: Performance e UX importantes
- **Fase 3 - Médio**: Melhorias e otimizações
- **Fase 4 - Baixo**: Refatorações e limpeza

### 5. CRIAÇÃO DE ISSUES

Para problemas que precisam de atenção:
- **Título claro**: Descreva o problema
- **Descrição completa**: Contexto, impacto, soluções sugeridas
- **Labels**: Prioridade, tipo, área
- **Milestone**: Se aplicável
- **Referências**: Links para relatórios

### 6. DOCUMENTAÇÃO

Atualize documentação:
- **PLANO_INTEGRACAO_ROBUSTA.md**: Novidades e melhorias
- **RESUMO_ACAO_NOTURNA.md**: Histórico de execuções
- **CHANGELOG.md**: Mudanças significativas

## Formato do Relatório de Revisão

```json
{
  "timestamp": "ISO 8601",
  "review_version": "2.0",
  "reports_reviewed": [],
  "summary": {
    "total_issues": 0,
    "critical_issues": 0,
    "high_priority": 0,
    "medium_priority": 0,
    "low_priority": 0,
    "conflicts_resolved": 0,
    "issues_created": 0
  },
  "prioritized_actions": [
    {
      "id": "action-1",
      "priority": "critical|high|medium|low",
      "type": "security|bug|performance|refactor|feature",
      "title": "Título da ação",
      "description": "Descrição detalhada",
      "source": "claude|copilot|combined",
      "estimated_effort": "hours",
      "dependencies": [],
      "files_affected": []
    }
  ],
  "conflicts": [
    {
      "issue": "Descrição do conflito",
      "claude_solution": "Solução do Claude",
      "copilot_solution": "Solução do Copilot",
      "decision": "Solução escolhida",
      "rationale": "Por que esta solução"
    }
  ],
  "action_plan": {
    "phase_1_critical": [],
    "phase_2_high": [],
    "phase_3_medium": [],
    "phase_4_low": []
  },
  "issues_created": [
    {
      "number": 0,
      "title": "Título da issue",
      "url": "GitHub URL"
    }
  ],
  "documentation_updates": [],
  "next_execution_notes": "Notas para próxima execução"
}
```

## Critérios de Sucesso

- ✅ Todos os relatórios revisados
- ✅ Priorização clara e justificada
- ✅ Conflitos resolvidos com documentação
- ✅ Plano de ação executável
- ✅ Issues criadas quando necessário
- ✅ Documentação atualizada

## Modelo

Use o modelo mais avançado disponível no Cursor AI para revisão estratégica.
