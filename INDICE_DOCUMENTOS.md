# 📚 ÍNDICE DE DOCUMENTOS - DESIGN SYSTEM V1
## Nossa Maternidade - Mobile First para Público C-D

**Última atualização:** 2025-01-27
**Versão:** 1.0

---

## 📋 DOCUMENTOS PRINCIPAIS

### 1. Plano Executável
**`PLANO_DESIGN_SYSTEM_V1.md`**
- Metas SMART com métricas e critérios de aceite
- Priorização por impacto (mobile first)
- Definition of Done por item
- Riscos e mitigação
- Entregáveis finais (3 semanas)

**Quando usar:** Referência principal do plano executável

---

### 2. Design System V1
**`docs/DESIGN_SYSTEM_V1.md`**
- Foundations (Cores, Tipografia, Espaçamento, Elevação, Motion)
- Componentes (Ícones, Cards, Feedback, Loading)
- Padrões (Listas/Grades, Formulários)
- Microcopy (Guia de voz)
- Acessibilidade (Checklist WCAG AA)

**Quando usar:** Referência técnica do design system

---

### 3. Guia de Execução no Cursor 2.0
**`GUIA_EXECUCAO_CURSOR_2.0.md`**
- Como usar Plan Mode por pacote
- Estrutura de tarefa no Cursor 2.0
- Agentes paralelos (quando usar/não usar)
- Bugbot/Visual Diff
- Checklist antes de cada tarefa

**Quando usar:** Guia prático de execução no Cursor 2.0

---

## 📊 DOCUMENTOS DE ACOMPANHAMENTO

### 4. Status de Componentes
**`docs/COMPONENT_STATUS.md`**
- Mapa de componentes (status: feito/em revisão/pending)
- Próximas ações (Semanas 1-3)
- Progresso geral

**Quando usar:** Acompanhar progresso da implementação

---

### 5. UX Debt Log
**`docs/UX_DEBT_LOG.md`**
- Registro de exceções ao design system
- Justificativas e prazos
- Revisão semanal

**Quando usar:** Registrar exceções ao design system

---

## ✅ CHECKLISTS E GUIAS

### 6. Checklist de Acessibilidade (A11Y)
**`docs/A11Y_CHECKLIST.md`**
- Checklist WCAG AA
- Checklist por componente
- Ferramentas (Lighthouse, axe DevTools)

**Quando usar:** Validar acessibilidade antes do merge

---

### 7. Guia de Microcopy & Tom
**`docs/design-system-microcopy.md`**
- Princípios de microcopy
- Exemplos por cenário (erros, empty states, formulários, temas sensíveis)
- Tom por contexto
- Regras de ouro

**Quando usar:** Criar/revisar microcopy do app

---

### 8. Checklist de Revisão (Antes do Merge)
**`docs/REVIEW_CHECKLIST.md`**
- A11Y (acessibilidade)
- Performance móvel
- Conteúdo (microcopy)
- Responsividade
- Consistência
- Testes
- Documentação

**Quando usar:** Antes de cada merge

---

## 🧪 TESTES COM USUÁRIAS

### 9. Plano de Teste com Usuárias
**`docs/user-testing-plan.md`**
- Metodologia (5 participantes, 20-30min)
- Recrutamento
- Tarefas (Mundo Nath, Diário, Receitas)
- Roteiro de sessão
- Métricas (taxa de sucesso, tempo, erros, SUS)

**Quando usar:** Planejar testes com usuárias

---

### 10. Resultados de Teste com Usuárias
**`docs/user-testing-results.md`**
- Template de relatório
- Métricas por tarefa
- Padrões identificados
- Ajustes priorizados
- Mudanças aplicadas

**Quando usar:** Documentar resultados de testes

---

## 📈 RELATÓRIOS (A CRIAR)

### 11. Relatório de Acessibilidade
**`docs/A11Y_REPORT.md`** (criar após implementação)
- Lighthouse Accessibility Score (antes/depois)
- Violações axe (serious/critical)
- Contraste médio por página
- Navegação por teclado (tempo, erros)

**Quando criar:** Após implementação do design system

---

### 12. Relatório de Performance Móvel
**`docs/PERFORMANCE_REPORT.md`** (criar após implementação)
- Lighthouse Comparativo:
  - LCP (antes/depois)
  - CLS (antes/depois)
  - TTI (antes/depois)
  - JS inicial (antes/depois)

**Quando criar:** Após implementação do design system

---

## 🚀 COMO USAR ESTES DOCUMENTOS

### Para Começar
1. **Ler `PLANO_DESIGN_SYSTEM_V1.md`** - Entender o plano completo
2. **Ler `GUIA_EXECUCAO_CURSOR_2.0.md`** - Como executar no Cursor 2.0
3. **Ler `docs/DESIGN_SYSTEM_V1.md`** - Referência técnica

### Durante o Desenvolvimento
1. **Consultar `docs/DESIGN_SYSTEM_V1.md`** - Tokens, padrões, componentes
2. **Consultar `docs/design-system-microcopy.md`** - Microcopy e tom
3. **Consultar `docs/A11Y_CHECKLIST.md`** - Acessibilidade
4. **Atualizar `docs/COMPONENT_STATUS.md`** - Status do componente

### Antes do Merge
1. **Executar `docs/REVIEW_CHECKLIST.md`** - Checklist completo
2. **Registrar exceções em `docs/UX_DEBT_LOG.md`** - Se houver
3. **Atualizar `docs/COMPONENT_STATUS.md`** - Status final

### Após Testes com Usuárias
1. **Preencher `docs/user-testing-results.md`** - Resultados
2. **Aplicar ajustes priorizados** - Semana 2
3. **Atualizar `docs/COMPONENT_STATUS.md`** - Status

---

## 📊 ESTRUTURA DE DOCUMENTOS

```
/
├── PLANO_DESIGN_SYSTEM_V1.md          # Plano executável completo
├── GUIA_EXECUCAO_CURSOR_2.0.md       # Guia de execução no Cursor 2.0
├── INDICE_DOCUMENTOS.md              # Este arquivo
└── docs/
    ├── DESIGN_SYSTEM_V1.md            # Design System v1 completo
    ├── COMPONENT_STATUS.md            # Status de componentes
    ├── UX_DEBT_LOG.md                 # Log de exceções
    ├── A11Y_CHECKLIST.md             # Checklist de acessibilidade
    ├── design-system-microcopy.md    # Guia de microcopy
    ├── REVIEW_CHECKLIST.md           # Checklist de revisão
    ├── user-testing-plan.md          # Plano de teste com usuárias
    ├── user-testing-results.md       # Template de resultados
    ├── A11Y_REPORT.md                # Relatório de acessibilidade (criar)
    └── PERFORMANCE_REPORT.md         # Relatório de performance (criar)
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Aprovar este plano** com stakeholders
2. ✅ **Criar issues no GitHub** para cada tarefa (Semanas 1-3)
3. ✅ **Iniciar Semana 1** (A11Y + Hierarquia + Loading)
4. ✅ **Agendar testes** com usuárias (final Semana 1)
5. ✅ **Revisar progresso** semanalmente

---

## 📚 REFERÊNCIAS RÁPIDAS

### Por Tarefa
- **Cores Semânticas:** `docs/DESIGN_SYSTEM_V1.md` → Seção 1.1
- **Tipografia:** `docs/DESIGN_SYSTEM_V1.md` → Seção 1.2
- **Espaçamento:** `docs/DESIGN_SYSTEM_V1.md` → Seção 1.3
- **Elevação:** `docs/DESIGN_SYSTEM_V1.md` → Seção 1.4
- **Motion:** `docs/DESIGN_SYSTEM_V1.md` → Seção 1.5
- **Ícones:** `docs/DESIGN_SYSTEM_V1.md` → Seção 2.1
- **Cards:** `docs/DESIGN_SYSTEM_V1.md` → Seção 2.2
- **Feedback:** `docs/DESIGN_SYSTEM_V1.md` → Seção 2.3
- **Loading:** `docs/DESIGN_SYSTEM_V1.md` → Seção 2.4

### Por Contexto
- **Acessibilidade:** `docs/A11Y_CHECKLIST.md`
- **Microcopy:** `docs/design-system-microcopy.md`
- **Testes:** `docs/user-testing-plan.md`
- **Revisão:** `docs/REVIEW_CHECKLIST.md`
- **Execução:** `GUIA_EXECUCAO_CURSOR_2.0.md`

---

**Última atualização:** 2025-01-27
**Versão:** 1.0
**Status:** ✅ Pronto para execução
