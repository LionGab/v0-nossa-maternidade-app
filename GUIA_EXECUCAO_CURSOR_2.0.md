# 🚀 GUIA DE EXECUÇÃO - CURSOR 2.0
## Design System V1 - Nossa Maternidade

**Objetivo:** Como executar o plano "cirúrgico" no Cursor 2.0

---

## 📚 DOCUMENTOS CRIADOS

### Documentos Principais
1. **`PLANO_DESIGN_SYSTEM_V1.md`** - Plano executável completo (metas SMART, priorização, riscos)
2. **`docs/DESIGN_SYSTEM_V1.md`** - Design System v1 completo (foundations, componentes, padrões)
3. **`docs/COMPONENT_STATUS.md`** - Mapa de componentes (status: feito/em revisão/pending)
4. **`docs/UX_DEBT_LOG.md`** - Log de exceções ao design system

### Documentos de Apoio
5. **`docs/A11Y_CHECKLIST.md`** - Checklist de acessibilidade (WCAG AA)
6. **`docs/design-system-microcopy.md`** - Guia de microcopy e tom
7. **`docs/user-testing-plan.md`** - Plano de teste com usuárias
8. **`docs/user-testing-results.md`** - Template de resultados de teste
9. **`docs/REVIEW_CHECKLIST.md`** - Checklist de revisão (antes do merge)

---

## 🎯 COMO USAR NO CURSOR 2.0

### Plan Mode por Pacote

#### 1. Foundations (Semana 1)
**Ordem de execução:**
1. Cores Semânticas → `app/globals.css`
2. Tipografia → `app/globals.css`
3. Espaçamento → `app/globals.css`
4. Elevação → `app/globals.css`
5. Motion → `app/globals.css`

**Como executar:**
```
Cursor 2.0 > Plan Mode > "Implementar Foundations do Design System V1"
```

**Critérios de aceite:**
- Ver `PLANO_DESIGN_SYSTEM_V1.md` seção 1.1 (Foundations)

---

#### 2. Componentes (Semana 1-2)
**Ordem de execução:**
1. Ícones + IconWrapper → `components/ui/icon.tsx`
2. Loading (Skeleton + Progress) → `components/ui/skeleton.tsx`, `components/ui/progress.tsx`
3. EmptyState → `components/ui/empty-state.tsx`
4. Cards → `components/ui/card.tsx`
5. Feedback (Toast + InlineAlert) → `components/ui/toast.tsx`, `components/ui/alert.tsx`

**Como executar:**
```
Cursor 2.0 > Plan Mode > "Implementar Componentes do Design System V1"
```

**Critérios de aceite:**
- Ver `PLANO_DESIGN_SYSTEM_V1.md` seção 2.2 (Componentes)

---

#### 3. Padrões (Semana 2)
**Ordem de execução:**
1. Listas/Grades Responsivas → `components/ui/grid.tsx`
2. Formulários Sensíveis → `components/ui/form.tsx`, `components/ui/input.tsx`

**Como executar:**
```
Cursor 2.0 > Plan Mode > "Implementar Padrões do Design System V1"
```

**Critérios de aceite:**
- Ver `PLANO_DESIGN_SYSTEM_V1.md` seção 2.3 (Padrões)

---

### Estrutura de Tarefa no Cursor 2.0

Cada tarefa deve ter:

#### Plano Curto
```
Implementar [Componente] do Design System V1
- Criar componente em `components/ui/[componente].tsx`
- Aplicar tokens de cores, tipografia, espaçamento
- Garantir acessibilidade (WCAG AA)
```

#### Arquivos Impactados
```
- components/ui/[componente].tsx (novo)
- app/globals.css (se necessário)
- docs/DESIGN_SYSTEM_V1.md (atualizar documentação)
- docs/COMPONENT_STATUS.md (atualizar status)
```

#### Riscos
```
- Conflito com componentes existentes
- Breaking changes em páginas que usam componentes antigos
- Performance em dispositivos móveis modestos
```

#### Critérios de Aceite
```
- Componente implementado e testado
- Acessibilidade: WCAG AA ≥ 95%
- Performance: LCP ≤ 2,5s, CLS ≤ 0,1
- Documentação atualizada
- Status atualizado em COMPONENT_STATUS.md
```

---

### Agentes Paralelos

**Quando usar:**
- ✅ Ícones vs Empty States (sem conflito)
- ✅ Loading (Skeleton + Progress) vs Cards (sem conflito)
- ✅ Feedback (Toast + InlineAlert) vs Formulários (sem conflito)

**Quando NÃO usar:**
- ❌ Cores vs Tipografia (pode conflitar - fazer sequencial)
- ❌ Elevação vs Motion (pode conflitar - fazer sequencial)
- ❌ Componentes que compartilham dependências

---

### Bugbot/Visual Diff

**Para regressão visual:**
- Usar visual diff (se disponível) para cores/contraste
- Testar em cada PR antes do merge
- Comparar screenshots antes/depois

**Como executar:**
```
Cursor 2.0 > Visual Diff > Comparar antes/depois de mudanças
```

---

## 📋 CHECKLIST ANTES DE CADA TAREFA

### Antes de Começar
- [ ] Ler `PLANO_DESIGN_SYSTEM_V1.md` seção relevante
- [ ] Ler `docs/DESIGN_SYSTEM_V1.md` seção relevante
- [ ] Verificar `docs/COMPONENT_STATUS.md` (status atual)
- [ ] Verificar `docs/UX_DEBT_LOG.md` (exceções existentes)

### Durante o Desenvolvimento
- [ ] Seguir `docs/DESIGN_SYSTEM_V1.md` (tokens, padrões)
- [ ] Aplicar `docs/design-system-microcopy.md` (microcopy)
- [ ] Verificar `docs/A11Y_CHECKLIST.md` (acessibilidade)
- [ ] Testar em 360px, 414px, 768px, 1024px (responsividade)

### Antes do Merge
- [ ] Executar `docs/REVIEW_CHECKLIST.md` (checklist completo)
- [ ] Atualizar `docs/COMPONENT_STATUS.md` (status)
- [ ] Atualizar `docs/DESIGN_SYSTEM_V1.md` (documentação)
- [ ] Registrar exceções no `docs/UX_DEBT_LOG.md` (se houver)

---

## 🎯 PRIORIZAÇÃO (MOBILE FIRST)

### Semana 1 (Alta Prioridade)
1. ✅ **Acessibilidade + Hierarquia** (cores semânticas + tipografia + contraste)
2. ✅ **Ícones Acessíveis** (substituição de emojis + foco visível + hit area)
3. ✅ **Loading Skeleton + Empty States** (percepção de velocidade e acolhimento)

### Semana 2 (Média Prioridade)
4. **Sistema de Cards** (contraste/elevação consistentes)
5. **Responsividade** (densidade e grids por tipo de conteúdo)
6. **Feedback (Toast/Alert)** com microcopy empática

### Semana 3 (Polish)
7. **Ampliação de Paleta** (success/warn/info) documentada
8. **Motion Coerente** (limites e easings) + transições de página leves
9. **Dark Mode Refinado** (pares acessíveis, não "cinza lavado")

---

## 📊 MÉTRICAS E CRITÉRIOS DE ACEITE

### A11Y (Acessibilidade)
- **Meta:** WCAG AA ≥ 95% no Lighthouse/axe
- **Aceite:** Zero violações "serious/critical" no axe, contraste ≥ 4.5:1

### Performance Móvel
- **Meta:** TTI ≤ 3,0s em Android de entrada (3G/CPU lento)
- **Aceite:** Lighthouse "Mobile Slow 4G + 4x CPU throttle", LCP ≤ 2,5s, CLS ≤ 0,1

### Taxa de Sucesso de Tarefa
- **Meta:** ≥ 80% em "postar no Diário" e "achar Mundo Nath"
- **Aceite:** Teste moderado com 5 usuárias, SUS ≥ 75

### Clareza de Hierarquia
- **Meta:** 90% das participantes identifica título > subtítulo > corpo sem esforço em 5s
- **Aceite:** "5-second test" com 10 participantes

---

## 🧪 TESTE COM USUÁRIAS

### Recrutamento
- **5 participantes:** Mães/gestantes da base C-D
- **Sessões:** Remotas de 20-30min
- **Incentivo:** R$ 50 por participante (opcional)

### Tarefas
1. Abrir Mundo Nath
2. Registrar um sentimento no Diário
3. Encontrar Receitas

### Critérios de Sucesso
- ≥ 80% sem ajuda
- SUS ≥ 75
- Documentar achados → ajuste rápido na Semana 2

**Ver:** `docs/user-testing-plan.md` (plano completo)

---

## ⚠️ RISCOS & MITIGAÇÃO

### Identidade Visual vs. Ícones
**Risco:** Perder "cara" da influenciadora ao remover emojis
**Mitigação:** Manter 2-3 "emojis de assinatura" apenas em contextos decorativos (com `aria-hidden="true"`)

### Motion em Devices Fracos
**Risco:** Animações pesadas em dispositivos modestos
**Mitigação:** Respeitar `prefers-reduced-motion`, evitar opacity pesada em listas longas

### Dark Mode
**Risco:** Pretos profundos "engolindo" bordas em OLED
**Mitigação:** Validar contrastes em OLED, subir borda para `border-strong` na variação escura

### Consistência
**Risco:** Exceções ao sistema acumulando dívida técnica
**Mitigação:** Criar **UX Debt Log** (`docs/UX_DEBT_LOG.md`), qualquer exceção vai para fila com owner e prazo

---

## 📦 ENTREGÁVEIS FINAIS (3 SEMANAS)

### Design System v1 (Doc Único)
- ✅ Foundations (Cores, Tipografia, Espaçamento, Elevação, Motion)
- ✅ Componentes (Ícones, Cards, Feedback, Loading)
- ✅ Padrões (Listas/Grades, Formulários)
- ✅ Microcopy (Guia de voz)
- ✅ A11Y (Checklist e guia)

**Arquivo:** `docs/DESIGN_SYSTEM_V1.md`

---

### Mapa de Componentes
**Status:** feito/em revisão/pending

**Arquivo:** `docs/COMPONENT_STATUS.md`

---

### Relatório de Acessibilidade
**Antes/Depois:**
- Lighthouse Accessibility Score
- Violações axe (serious/critical)
- Contraste médio por página
- Navegação por teclado (tempo, erros)

**Arquivo:** `docs/A11Y_REPORT.md` (criar após implementação)

---

### Relatório de Performance Móvel
**Lighthouse Comparativo:**
- LCP (antes/depois)
- CLS (antes/depois)
- TTI (antes/depois)
- JS inicial (antes/depois)

**Arquivo:** `docs/PERFORMANCE_REPORT.md` (criar após implementação)

---

### Resumo de Teste com Usuárias
**Conteúdo:**
- Metodologia (5 usuárias, 20-30min)
- Tarefas (Mundo Nath, Diário, Receitas)
- Resultados (sucesso ≥ 80%, SUS ≥ 75)
- Mudanças aplicadas na Semana 2

**Arquivo:** `docs/user-testing-results.md` (preencher após testes)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Aprovar este plano** com stakeholders
2. ✅ **Criar issues no GitHub** para cada tarefa (Semanas 1-3)
3. ✅ **Iniciar Semana 1** (A11Y + Hierarquia + Loading)
4. ✅ **Agendar testes** com usuárias (final Semana 1)
5. ✅ **Revisar progresso** semanalmente

---

## 📝 COMANDOS ÚTEIS NO CURSOR 2.0

### Plan Mode
```
Cursor 2.0 > Plan Mode > "Implementar [Componente] do Design System V1"
```

### Visual Diff
```
Cursor 2.0 > Visual Diff > Comparar antes/depois de mudanças
```

### Code Review
```
Cursor 2.0 > Code Review > Verificar checklist de revisão
```

---

## 📚 REFERÊNCIAS

- **Plano Executável:** `PLANO_DESIGN_SYSTEM_V1.md`
- **Design System:** `docs/DESIGN_SYSTEM_V1.md`
- **Status de Componentes:** `docs/COMPONENT_STATUS.md`
- **UX Debt Log:** `docs/UX_DEBT_LOG.md`
- **A11Y Checklist:** `docs/A11Y_CHECKLIST.md`
- **Microcopy:** `docs/design-system-microcopy.md`
- **Teste com Usuárias:** `docs/user-testing-plan.md`
- **Checklist de Revisão:** `docs/REVIEW_CHECKLIST.md`

---

**Última atualização:** 2025-01-27
**Versão:** 1.0
**Status:** ✅ Pronto para execução
