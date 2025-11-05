# 🎯 PLANO EXECUTÁVEL - DESIGN SYSTEM V1
## Nossa Maternidade - Mobile First para Público C-D

**Prazo:** 3 semanas
**Objetivo:** Transformar design system de "bom" para "cirúrgico" com foco em acessibilidade, performance móvel e usabilidade

---

## 1. METAS SMART - MÉTRICAS E CRITÉRIOS DE ACEITE

### 1.1 Acessibilidade (A11Y)
**Meta:** WCAG AA ≥ 95% no Lighthouse/axe
**Critério de Aceite:**
- ✅ Zero violações "serious/critical" no axe
- ✅ Contraste ≥ 4.5:1 em todas as páginas-chave
- ✅ Navegação por teclado funcional (TAB sequencial)
- ✅ Foco visível com contraste ≥ 3:1
- ✅ Sem "keyboard traps"
- ✅ ARIA labels em todos elementos interativos

**Como medir:**
- Lighthouse Accessibility Score ≥ 95
- axe DevTools: 0 erros críticos
- Teste manual: navegação completa por TAB

---

### 1.2 Consistência de Espaçamento
**Meta:** Variância de spacing entre seções ≤ 8px em 95% das telas
**Critério de Aceite:**
- ✅ Auditoria visual com régua/Figma tokens bate com escala definida
- ✅ Escala fixa: 4, 8, 12, 16, 24, 32px
- ✅ Regras por contexto documentadas (seção, card, lista)
- ✅ 95% das telas sem exceções fora da escala

**Como medir:**
- Overlay visual em 10 telas aleatórias
- Medir espaçamentos com dev tools
- Comparar com tokens definidos

---

### 1.3 Tempo de Primeira Interação (TTI)
**Meta:** ≤ 3,0s em Android de entrada (3G/CPU lento)
**Critério de Aceite:**
- ✅ Lighthouse "Mobile Slow 4G + 4x CPU throttle"
- ✅ TTI ≤ 3,0s
- ✅ LCP ≤ 2,5s
- ✅ CLS ≤ 0,1
- ✅ JS inicial ≤ 200KB

**Como medir:**
- Lighthouse Performance (Mobile)
- Chrome DevTools: CPU Throttling 4x + Network Throttling Slow 4G

---

### 1.4 Taxa de Sucesso de Tarefa
**Meta:** ≥ 80% em "postar no Diário" e "achar Mundo Nath"
**Critério de Aceite:**
- ✅ Teste moderado com 5 usuárias (mães/gestantes C-D)
- ✅ Sessões remotas de 20-30min
- ✅ 3 tarefas: (1) abrir Mundo Nath, (2) registrar sentimento no Diário, (3) encontrar Receitas
- ✅ ≥ 80% sem ajuda; SUS ≥ 75

**Como medir:**
- Teste de usabilidade com usuárias reais
- Métricas: sucesso, tempo, erros, satisfação (SUS)

---

### 1.5 Clareza de Hierarquia
**Meta:** 90% das participantes identifica título > subtítulo > corpo sem esforço em 5s
**Critério de Aceite:**
- ✅ "5-second test" com 10 participantes
- ✅ 90% identifica corretamente a hierarquia
- ✅ Tipografia com escala clara (Display, Title, Body, Caption)
- ✅ Contraste adequado entre níveis

**Como medir:**
- 5-second test: mostrar tela por 5s, perguntar hierarquia
- Taxa de acerto ≥ 90%

---

## 2. ARTEFATOS DO DESIGN SYSTEM V1

### 2.1 Foundations

#### 2.1.1 Cores Semânticas
**Mapeamento:**
- `bg-surface`: Fundo principal (claro/escuro)
- `bg-elevated`: Cards e elementos elevados
- `text-primary`: Texto principal
- `text-secondary`: Texto secundário
- `accent`: Cor de destaque
- `success`: Sucesso (verde)
- `warning`: Aviso (amarelo/laranja)
- `info`: Informação (azul)
- `border-subtle`: Bordas sutis
- `border-strong`: Bordas destacadas

**Critério de Aceite:**
- ✅ Mapa de pares acessíveis (claro/escuro) com contrastes validados
- ✅ Todas as cores com contraste ≥ 4.5:1
- ✅ Documentação com exemplos de uso

**Arquivos:**
- `app/globals.css` (variáveis CSS)
- `docs/design-system-colors.md` (documentação)

---

#### 2.1.2 Tipografia
**Escala:**
- **Display**: Títulos hero (ex.: 2.5rem, bold)
- **Title**: Títulos de seção (ex.: 1.75rem, semibold)
- **Body**: Texto corpo (ex.: 1rem, regular)
- **Caption**: Texto pequeno (ex.: 0.875rem, regular)

**Critério de Aceite:**
- ✅ Tabela com tamanho/line-height/uso recomendado
- ✅ `text-balance` obrigatório para títulos longos
- ✅ Line-height: 1.5 para body, 1.2 para títulos
- ✅ Peso: 400 (regular), 600 (semibold), 700 (bold)

**Arquivos:**
- `app/globals.css` (tipografia)
- `docs/design-system-typography.md` (documentação)

---

#### 2.1.3 Espaçamento
**Escala Fixa:**
- 4px (xs) - espaçamento mínimo
- 8px (sm) - espaçamento pequeno
- 12px (md) - espaçamento médio
- 16px (lg) - espaçamento padrão
- 24px (xl) - espaçamento grande
- 32px (2xl) - espaçamento extra grande

**Regras por Contexto:**
- **Seção**: 32px entre seções principais
- **Card**: 16px padding interno, 16px gap entre cards
- **Lista**: 12px entre itens, 24px entre grupos

**Critério de Aceite:**
- ✅ Quadro com exemplos antes/depois
- ✅ 95% das telas usando escala fixa
- ✅ Regras por contexto documentadas

**Arquivos:**
- `app/globals.css` (spacing tokens)
- `docs/design-system-spacing.md` (documentação)

---

#### 2.1.4 Elevação
**3 Níveis:**
- **flat**: Sem sombra (background normal)
- **elevated**: Sombra leve (cards, modais)
- **interactive**: Sombra média (botões, cards clicáveis)

**Critério de Aceite:**
- ✅ Guia de quando usar cada nível
- ✅ Sombra, borda e overlay padronizados
- ✅ Estados hover/focus documentados

**Arquivos:**
- `app/globals.css` (elevation tokens)
- `docs/design-system-elevation.md` (documentação)

---

#### 2.1.5 Motion
**Durações:**
- 120ms (fast) - micro-interações
- 200ms (base) - transições padrão
- 300ms (slow) - transições importantes

**Easings:**
- `standard`: cubic-bezier(0.4, 0, 0.2, 1) - entrada/saída
- `em`: cubic-bezier(0.4, 0, 1, 1) - saída rápida
- `saída`: cubic-bezier(0, 0, 0.2, 1) - entrada rápida

**Limites:**
- ✅ Sem overshoot forte em telas sensíveis
- ✅ Respeitar `prefers-reduced-motion`
- ✅ Amplitudes: translate ≤ 20px, scale ≤ 1.1

**Critério de Aceite:**
- ✅ Catálogo com "do/don't" (evitar overshoot forte)
- ✅ Exemplos de uso por contexto
- ✅ Suporte a `prefers-reduced-motion`

**Arquivos:**
- `app/globals.css` (motion tokens)
- `docs/design-system-motion.md` (documentação)

---

### 2.2 Componentes

#### 2.2.1 Ícones
**Catálogo:** Lucide Icons
**IconWrapper:**
- Tamanhos: XS (16px), SM (20px), MD (24px), LG (32px), XL (40px)
- Área de toque: ≥ 40x40px (mobile)
- Foco visível: outline ≥ 2px, contraste ≥ 3:1

**Critério de Aceite:**
- ✅ Todos os emojis substituídos por ícones Lucide
- ✅ Checklist de acessibilidade (aria-label, role)
- ✅ Área de toque ≥ 40px em mobile
- ✅ Foco visível com contraste adequado

**Arquivos:**
- `components/ui/icon.tsx` (componente)
- `components/ui/icon-wrapper.tsx` (wrapper)
- `docs/design-system-icons.md` (catálogo)

---

#### 2.2.2 Cards
**Variantes:**
- `default`: Card padrão (flat)
- `elevated`: Card elevado (sombra leve)
- `interactive`: Card clicável (hover/focus)

**Estados:**
- `hover`: Sombra aumentada, cursor pointer
- `focus-visible`: Outline visível, contraste ≥ 3:1
- `disabled`: Opacidade 0.5, cursor not-allowed
- `error`: Borda vermelha, ícone de erro

**Critério de Aceite:**
- ✅ Tabela de tokens por variante e estados
- ✅ Todos estados testados (hover, focus, disabled, error)
- ✅ Acessibilidade: ARIA labels, navegação por teclado

**Arquivos:**
- `components/ui/card.tsx` (componente)
- `docs/design-system-cards.md` (documentação)

---

#### 2.2.3 Feedback
**Componentes:**
- `Toast`: Notificação temporária (sucesso, erro, info)
- `InlineAlert`: Alerta inline (aviso, erro)
- `EmptyState`: Estado vazio (título empático + CTA)

**Critério de Aceite:**
- ✅ Mensagens padrão e tons para cada severidade
- ✅ Microcopy empática (sem "!", prefira "Como podemos ajustar?")
- ✅ Títulos acolhedores em EmptyState
- ✅ CTA claro em todos os feedbacks

**Arquivos:**
- `components/ui/toast.tsx`
- `components/ui/alert.tsx`
- `components/ui/empty-state.tsx`
- `docs/design-system-feedback.md` (documentação)

---

#### 2.2.4 Loading
**Componentes:**
- `Skeleton`: Blocos predefinidos (avatar, linha, card)
- `Progress`: Barra de progresso (tarefas > 2s)

**Critério de Aceite:**
- ✅ Guideline de quando usar skeleton vs spinner
- ✅ Skeleton para carregamento inicial
- ✅ Progress para tarefas longas (> 2s)
- ✅ Acessibilidade: aria-label, aria-busy

**Arquivos:**
- `components/ui/skeleton.tsx`
- `components/ui/progress.tsx`
- `docs/design-system-loading.md` (documentação)

---

### 2.3 Padrões

#### 2.3.1 Listas/Grades Responsivas
**Breakpoints:**
- Mobile: 360px, 414px (1 coluna)
- Tablet: 768px (2 colunas)
- Desktop: 1024px+ (3 colunas)

**Densidades por Tipo:**
- **Feed**: Cards compactos, 1 coluna mobile
- **Receitas**: Cards médios, 2 colunas tablet
- **Desafios**: Cards grandes, 1 coluna mobile

**Critério de Aceite:**
- ✅ Sem "saltos" de layout em breakpoints
- ✅ Densidade adequada por tipo de conteúdo
- ✅ Grid responsivo testado em 360px, 414px, 768px, 1024px

**Arquivos:**
- `components/ui/grid.tsx` (componente)
- `docs/design-system-layouts.md` (documentação)

---

#### 2.3.2 Formulários Sensíveis
**Regras:**
- ✅ Erros em linguagem acolhedora
- ✅ Instrução sempre acima do campo
- ✅ Área de toque grande (≥ 44x44px)
- ✅ Feedback imediato (validação inline)
- ✅ Labels claros (sem jargão)

**Critério de Aceite:**
- ✅ Microcopy empática em todos os erros
- ✅ Instruções acima dos campos
- ✅ Touch targets ≥ 44px
- ✅ Validação com feedback visual claro

**Arquivos:**
- `components/ui/form.tsx` (componente)
- `components/ui/input.tsx`
- `docs/design-system-forms.md` (documentação)

---

## 3. PRIORIZAÇÃO POR IMPACTO (MOBILE FIRST)

### Alta Prioridade (Semana 1)
**Foco:** Acessibilidade + Hierarquia + Loading

1. **Acessibilidade + Hierarquia**
   - Cores semânticas + tipografia + contraste
   - Critério: WCAG AA ≥ 95%, contraste ≥ 4.5:1
   - Impacto: Alto (base para tudo)

2. **Ícones Acessíveis**
   - Substituição de emojis + foco visível + hit area
   - Critério: Todos emojis → Lucide, área ≥ 40px
   - Impacto: Alto (usabilidade móvel)

3. **Loading Skeleton + Empty States**
   - Percepção de velocidade e acolhimento
   - Critério: Skeleton para carregamento, EmptyState empático
   - Impacto: Alto (percepção de qualidade)

---

### Média Prioridade (Semana 2)
**Foco:** Cards + Responsividade + Feedback

4. **Sistema de Cards**
   - Contraste/elevação consistentes
   - Critério: Variantes documentadas, estados testados
   - Impacto: Médio (consistência visual)

5. **Responsividade**
   - Densidade e grids por tipo de conteúdo
   - Critério: Sem saltos em 360px, 414px, 768px, 1024px
   - Impacto: Médio (experiência móvel)

6. **Feedback (Toast/Alert)**
   - Microcopy empática
   - Critério: Mensagens padrão, tom acolhedor
   - Impacto: Médio (experiência do usuário)

---

### Polish (Semana 3)
**Foco:** Refinamentos finais

7. **Ampliação de Paleta**
   - Success/warn/info documentadas
   - Critério: Mapa de cores completo
   - Impacto: Baixo (consistência adicional)

8. **Motion Coerente**
   - Limites e easings + transições de página
   - Critério: Catálogo do/don't, suporte reduced-motion
   - Impacto: Baixo (polimento)

9. **Dark Mode Refinado**
   - Pares acessíveis, não "cinza lavado"
   - Critério: Contraste ≥ 4.5:1 em dark mode
   - Impacto: Baixo (preferência)

---

## 4. DEFINITION OF DONE (DoD)

### 4.1 Ícones
- ✅ Todos os emojis substituídos por ícones Lucide mapeados
- ✅ Cada botão/ícone tem aria-label claro (ex.: "Abrir receitas")
- ✅ Foco visível com contraste ≥ 3:1; hit area ≥ 40x40px
- ✅ Teste teclado: navegação por TAB cobre todos elementos interativos na ordem certa
- ✅ Documentação: catálogo de ícones com exemplos de uso

---

### 4.2 Cards
- ✅ Variantes default, elevated, interactive implementadas
- ✅ Estados hover, focus-visible, disabled, error testados
- ✅ Tabela de tokens por variante e estados documentada
- ✅ Acessibilidade: ARIA labels, navegação por teclado
- ✅ Teste visual: contraste adequado em todos estados

---

### 4.3 Acessibilidade (A11Y)
- ✅ axe DevTools: 0 violações "serious/critical"
- ✅ Lighthouse Accessibility Score ≥ 95
- ✅ Contraste ≥ 4.5:1 em todas páginas-chave
- ✅ Navegação por teclado funcional (sem traps)
- ✅ Foco visível em todos elementos interativos
- ✅ ARIA labels em elementos sem texto visível

---

### 4.4 Loading
- ✅ Skeleton implementado (avatar, linha, card)
- ✅ Progress para tarefas > 2s
- ✅ Guideline de quando usar skeleton vs spinner
- ✅ Acessibilidade: aria-label, aria-busy
- ✅ Teste: percepção de velocidade melhorada

---

### 4.5 Responsividade
- ✅ Testado em 360px, 414px, 768px, 1024px
- ✅ Sem "saltos" de layout em breakpoints
- ✅ Densidade adequada por tipo de conteúdo
- ✅ Grid responsivo funcional
- ✅ Documentação: breakpoints e densidades

---

## 5. CHECKLIST DE REVISÃO (ANTES DO MERGE)

### A11Y
- [ ] axe: zero "serious/critical"
- [ ] Sem "keyboard trap"
- [ ] Foco sequencial correto (TAB)
- [ ] ARIA labels em elementos interativos

### Contraste
- [ ] Amostras de 10 componentes/estados
- [ ] Todas ≥ 4.5:1 (texto) ou ≥ 3:1 (UI)
- [ ] Dark mode: contrastes validados

### Performance Móvel
- [ ] LCP ≤ 2,5s
- [ ] CLS ≤ 0,1
- [ ] JS inicial ≤ 200KB
- [ ] TTI ≤ 3,0s (Slow 4G + 4x CPU)

### Conteúdo
- [ ] Microcopy em pt-BR inclusivo
- [ ] Sem jargão; tom acolhedor
- [ ] Mensagens de erro empáticas

### Responsividade
- [ ] 360px, 414px, 768px, 1024px testados
- [ ] Sem "saltos" de layout
- [ ] Touch targets ≥ 44px

---

## 6. MICROCOPY & TOM (NATHIA E APP)

### Princípios
1. **Frases curtas, diretas, respeitosas**
2. **Evitar "!" em mensagens de erro**
3. **Prefira "Como podemos ajustar?" em vez de "Erro!"**
4. **Em temas sensíveis (puerpério, luto):**
   - Abrir com empatia: "Sinto muito que você esteja passando por isso"
   - Oferecer opção de ajuda
   - Conteúdo leve (evitar sobrecarga)

### Exemplos de Microcopy

#### Erros
❌ **Ruim:** "Erro! Tente novamente!"
✅ **Bom:** "Não conseguimos processar. Como podemos ajustar?"

#### Empty States
❌ **Ruim:** "Nenhum item encontrado"
✅ **Bom:** "Ainda não há receitas aqui. Que tal começar criando sua primeira?"

#### Formulários
❌ **Ruim:** "Campo obrigatório"
✅ **Bom:** "Este campo é necessário para continuar"

#### Temas Sensíveis
❌ **Ruim:** "Você está com depressão pós-parto?"
✅ **Bom:** "Sinto muito que você esteja passando por isso. Quer conversar sobre como está se sentindo?"

**Arquivos:**
- `docs/design-system-microcopy.md` (guia completo)

---

## 7. TESTE RÁPIDO COM USUÁRIAS

### Recrutamento
- **5 participantes:** Mães/gestantes da base C-D
- **Sessões:** Remotas de 20-30min
- **Incentivo:** R$ 50 por participante (opcional)

### Tarefas
1. **Abrir Mundo Nath**
   - Sucesso: Acessa página sem ajuda
   - Métrica: Tempo, erros, satisfação

2. **Registrar um sentimento no Diário**
   - Sucesso: Completa registro sem ajuda
   - Métrica: Tempo, erros, satisfação

3. **Encontrar Receitas**
   - Sucesso: Acessa receitas sem ajuda
   - Métrica: Tempo, erros, satisfação

### Critérios de Sucesso
- ✅ ≥ 80% sem ajuda
- ✅ SUS ≥ 75
- ✅ Documentar achados → ajuste rápido na Semana 2

**Arquivos:**
- `docs/user-testing-plan.md` (roteiro completo)
- `docs/user-testing-results.md` (resultados)

---

## 8. RISCOS & MITIGAÇÃO

### Identidade Visual vs. Ícones
**Risco:** Perder "cara" da influenciadora ao remover emojis
**Mitigação:**
- Manter 2-3 "emojis de assinatura" apenas em contextos decorativos
- Usar `aria-hidden="true"` em emojis decorativos
- Documentar onde emojis são permitidos (ex.: avatares, badges)

---

### Motion em Devices Fracos
**Risco:** Animações pesadas em dispositivos modestos
**Mitigação:**
- Respeitar `prefers-reduced-motion`
- Evitar opacity pesada em listas longas
- Limitar animações a translate/scale (evitar filter/blur)
- Testar em Android de entrada (CPU lento)

---

### Dark Mode
**Risco:** Pretos profundos "engolindo" bordas em OLED
**Mitigação:**
- Validar contrastes em OLED
- Subir borda para `border-strong` na variação escura
- Testar em dispositivos OLED reais
- Garantir contraste ≥ 4.5:1 em dark mode

---

### Consistência
**Risco:** Exceções ao sistema acumulando dívida técnica
**Mitigação:**
- Criar **UX Debt Log**
- Qualquer exceção vai para fila com owner e prazo
- Revisão semanal de dívidas
- Documentar exceções e justificativas

**Arquivos:**
- `docs/ux-debt-log.md` (log de dívidas)

---

## 9. COMO EXECUTAR NO CURSOR 2.0

### Plan Mode por Pacote
**Ordem:**
1. **Foundations** → Cores, Tipografia, Espaçamento, Elevação, Motion
2. **Componentes** → Ícones, Cards, Feedback, Loading
3. **Padrões** → Listas/Grades, Formulários
4. **Páginas** → Aplicar em páginas existentes

### Estrutura de Tarefa
Cada tarefa deve ter:
- **Plano curto:** O que fazer (1-2 linhas)
- **Arquivos impactados:** Lista de arquivos
- **Riscos:** O que pode dar errado
- **Critérios de aceite:** Como validar

### Agentes Paralelos
**Só quando não houver conflito:**
- ✅ Ícones vs Empty States (sem conflito)
- ❌ Cores vs Tipografia (pode conflitar - fazer sequencial)

### Bugbot/Visual Diff
**Para regressão visual:**
- Usar visual diff (se disponível) para cores/contraste
- Testar em cada PR antes do merge
- Comparar screenshots antes/depois

---

## 10. ENTREGÁVEIS FINAIS (3 SEMANAS)

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

| Componente | Status | Owner | Prazo |
|------------|--------|-------|-------|
| Ícones | ✅ Feito | - | - |
| Cards | 🔄 Em revisão | - | Semana 2 |
| Feedback | ⏳ Pending | - | Semana 2 |
| Loading | ⏳ Pending | - | Semana 1 |

**Arquivo:** `docs/COMPONENT_STATUS.md`

---

### Relatório de Acessibilidade
**Antes/Depois:**
- Lighthouse Accessibility Score
- Violações axe (serious/critical)
- Contraste médio por página
- Navegação por teclado (tempo, erros)

**Arquivo:** `docs/A11Y_REPORT.md`

---

### Relatório de Performance Móvel
**Lighthouse Comparativo:**
- LCP (antes/depois)
- CLS (antes/depois)
- TTI (antes/depois)
- JS inicial (antes/depois)

**Arquivo:** `docs/PERFORMANCE_REPORT.md`

---

### Resumo de Teste com Usuárias
**Conteúdo:**
- Metodologia (5 usuárias, 20-30min)
- Tarefas (Mundo Nath, Diário, Receitas)
- Resultados (sucesso ≥ 80%, SUS ≥ 75)
- Mudanças aplicadas na Semana 2

**Arquivo:** `docs/USER_TESTING_RESULTS.md`

---

## PRÓXIMOS PASSOS

1. **Aprovar este plano** com stakeholders
2. **Criar issues no GitHub** para cada tarefa (Semanas 1-3)
3. **Iniciar Semana 1** (A11Y + Hierarquia + Loading)
4. **Agendar testes** com usuárias (final Semana 1)
5. **Revisar progresso** semanalmente

---

**Última atualização:** 2025-01-27
**Versão:** 1.0
**Status:** ✅ Pronto para execução
