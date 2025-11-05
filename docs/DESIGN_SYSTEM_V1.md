# 🎨 DESIGN SYSTEM V1 - NOSSA MATERNIDADE
## Mobile First para Público C-D

**Versão:** 1.0
**Última atualização:** 2025-01-27
**Status:** 🚧 Em construção

---

## ÍNDICE

1. [Foundations](#1-foundations)
   - [Cores Semânticas](#11-cores-semânticas)
   - [Tipografia](#12-tipografia)
   - [Espaçamento](#13-espaçamento)
   - [Elevação](#14-elevação)
   - [Motion](#15-motion)
2. [Componentes](#2-componentes)
   - [Ícones](#21-ícones)
   - [Cards](#22-cards)
   - [Feedback](#23-feedback)
   - [Loading](#24-loading)
3. [Padrões](#3-padrões)
   - [Listas/Grades Responsivas](#31-listasgrades-responsivas)
   - [Formulários Sensíveis](#32-formulários-sensíveis)
4. [Microcopy](#4-microcopy)
5. [Acessibilidade](#5-acessibilidade)

---

## 1. FOUNDATIONS

### 1.1 Cores Semânticas

#### Paleta Principal

| Token | Uso | Claro | Escuro | Contraste |
|-------|-----|-------|--------|-----------|
| `bg-surface` | Fundo principal | `#FCFAF8` | `#1A1816` | - |
| `bg-elevated` | Cards/elementos elevados | `#FFFFFF` | `#2A2826` | - |
| `text-primary` | Texto principal | `#1A1816` | `#FCFAF8` | ≥ 4.5:1 |
| `text-secondary` | Texto secundário | `#5A5754` | `#B8B6B4` | ≥ 4.5:1 |
| `accent` | Cor de destaque | `#E891B5` | `#E891B5` | ≥ 4.5:1 |
| `border-subtle` | Bordas sutis | `#E8E6E4` | `#4A4846` | ≥ 3:1 |
| `border-strong` | Bordas destacadas | `#C8C6C4` | `#6A6866` | ≥ 3:1 |

#### Cores Semânticas

| Token | Uso | Claro | Escuro | Contraste |
|-------|-----|-------|--------|-----------|
| `success` | Sucesso | `#60A85A` | `#60A85A` | ≥ 4.5:1 |
| `warning` | Aviso | `#E8B45A` | `#E8B45A` | ≥ 4.5:1 |
| `info` | Informação | `#5A9AE8` | `#5A9AE8` | ≥ 4.5:1 |
| `error` | Erro | `#E85A5A` | `#E85A5A` | ≥ 4.5:1 |

#### Critérios de Aceite
- ✅ Mapa de pares acessíveis (claro/escuro) com contrastes validados
- ✅ Todas as cores com contraste ≥ 4.5:1 (texto) ou ≥ 3:1 (UI)
- ✅ Documentação com exemplos de uso

**Arquivo:** `app/globals.css`

---

### 1.2 Tipografia

#### Escala

| Nível | Tamanho | Line Height | Peso | Uso |
|-------|---------|-------------|------|-----|
| **Display** | `2.5rem` (40px) | `1.2` | `700` (bold) | Títulos hero |
| **Title** | `1.75rem` (28px) | `1.3` | `600` (semibold) | Títulos de seção |
| **Body** | `1rem` (16px) | `1.5` | `400` (regular) | Texto corpo |
| **Caption** | `0.875rem` (14px) | `1.4` | `400` (regular) | Texto pequeno |

#### Regras

- ✅ `text-balance` obrigatório para títulos longos
- ✅ Line-height: 1.5 para body (legibilidade), 1.2 para títulos (compacto)
- ✅ Peso: 400 (regular), 600 (semibold), 700 (bold)
- ✅ Base: 16px (evita zoom automático no iOS)

#### Critérios de Aceite
- ✅ Tabela com tamanho/line-height/uso recomendado
- ✅ `text-balance` em todos os títulos
- ✅ Contraste adequado entre níveis

**Arquivo:** `app/globals.css`

---

### 1.3 Espaçamento

#### Escala Fixa

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | `4px` | Espaçamento mínimo |
| `sm` | `8px` | Espaçamento pequeno |
| `md` | `12px` | Espaçamento médio |
| `lg` | `16px` | Espaçamento padrão |
| `xl` | `24px` | Espaçamento grande |
| `2xl` | `32px` | Espaçamento extra grande |

#### Regras por Contexto

| Contexto | Espaçamento | Exemplo |
|----------|-------------|---------|
| **Seção** | 32px entre seções principais | `mb-8` (32px) |
| **Card** | 16px padding interno, 16px gap entre cards | `p-4` (16px), `gap-4` |
| **Lista** | 12px entre itens, 24px entre grupos | `gap-3` (12px), `gap-6` (24px) |

#### Critérios de Aceite
- ✅ 95% das telas usando escala fixa
- ✅ Regras por contexto documentadas
- ✅ Quadro com exemplos antes/depois

**Arquivo:** `app/globals.css`

---

### 1.4 Elevação

#### 3 Níveis

| Nível | Sombra | Uso |
|-------|--------|-----|
| **flat** | Sem sombra | Background normal |
| **elevated** | `0 2px 8px rgba(0,0,0,0.08)` | Cards, modais |
| **interactive** | `0 4px 16px rgba(0,0,0,0.12)` | Botões, cards clicáveis |

#### Estados

- **hover**: Sombra aumentada (elevated → interactive)
- **focus-visible**: Outline visível (≥ 2px, contraste ≥ 3:1)

#### Critérios de Aceite
- ✅ Guia de quando usar cada nível
- ✅ Estados hover/focus documentados
- ✅ Sombra, borda e overlay padronizados

**Arquivo:** `app/globals.css`

---

### 1.5 Motion

#### Durações

| Token | Valor | Uso |
|-------|-------|-----|
| `fast` | `120ms` | Micro-interações |
| `base` | `200ms` | Transições padrão |
| `slow` | `300ms` | Transições importantes |

#### Easings

| Token | Função | Uso |
|-------|--------|-----|
| `standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Entrada/saída |
| `em` | `cubic-bezier(0.4, 0, 1, 1)` | Saída rápida |
| `saída` | `cubic-bezier(0, 0, 0.2, 1)` | Entrada rápida |

#### Limites

- ✅ Sem overshoot forte em telas sensíveis
- ✅ Respeitar `prefers-reduced-motion`
- ✅ Amplitudes: translate ≤ 20px, scale ≤ 1.1

#### Do/Don't

✅ **Do:**
- Usar `prefers-reduced-motion` para desabilitar animações
- Limitar animações a translate/scale
- Durações curtas (≤ 300ms)

❌ **Don't:**
- Overshoot forte (bounce excessivo)
- Animações pesadas (filter/blur)
- Ignorar `prefers-reduced-motion`

#### Critérios de Aceite
- ✅ Catálogo com "do/don't"
- ✅ Suporte a `prefers-reduced-motion`
- ✅ Exemplos de uso por contexto

**Arquivo:** `app/globals.css`

---

## 2. COMPONENTES

### 2.1 Ícones

#### Catálogo: Lucide Icons
**Biblioteca:** [Lucide React](https://lucide.dev)

#### IconWrapper

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| **Tamanhos** | XS (16px), SM (20px), MD (24px), LG (32px), XL (40px) | Tamanhos padrão |
| **Área de toque** | ≥ 40x40px | Mobile (WCAG AA) |
| **Foco visível** | Outline ≥ 2px, contraste ≥ 3:1 | Acessibilidade |

#### Checklist de Acessibilidade

- [ ] `aria-label` em todos os ícones sem texto
- [ ] `role="img"` em ícones decorativos
- [ ] Área de toque ≥ 40px em mobile
- [ ] Foco visível com contraste adequado
- [ ] Navegação por teclado funcional

#### Critérios de Aceite
- ✅ Todos os emojis substituídos por ícones Lucide
- ✅ Checklist de acessibilidade completo
- ✅ Área de toque ≥ 40px em mobile
- ✅ Foco visível com contraste adequado

**Arquivo:** `components/ui/icon.tsx`, `components/ui/icon-wrapper.tsx`

---

### 2.2 Cards

#### Variantes

| Variante | Uso | Sombra |
|----------|-----|--------|
| `default` | Card padrão | `flat` |
| `elevated` | Card elevado | `elevated` |
| `interactive` | Card clicável | `interactive` |

#### Estados

| Estado | Visual | Acessibilidade |
|--------|--------|----------------|
| **hover** | Sombra aumentada, cursor pointer | - |
| **focus-visible** | Outline visível (≥ 2px) | Contraste ≥ 3:1 |
| **disabled** | Opacidade 0.5, cursor not-allowed | `aria-disabled="true"` |
| **error** | Borda vermelha, ícone de erro | `aria-invalid="true"` |

#### Tabela de Tokens

| Variante | Estado | Bg | Border | Sombra | Texto |
|----------|--------|----|----|--------|-------|
| default | - | `bg-elevated` | `border-subtle` | - | `text-primary` |
| elevated | - | `bg-elevated` | `border-subtle` | `elevated` | `text-primary` |
| interactive | hover | `bg-elevated` | `border-subtle` | `interactive` | `text-primary` |
| interactive | focus | `bg-elevated` | `accent` | `interactive` | `text-primary` |
| interactive | disabled | `bg-elevated` | `border-subtle` | - | `text-secondary` |
| interactive | error | `bg-elevated` | `error` | - | `text-primary` |

#### Critérios de Aceite
- ✅ Variantes implementadas e testadas
- ✅ Estados hover, focus, disabled, error testados
- ✅ Tabela de tokens documentada
- ✅ Acessibilidade: ARIA labels, navegação por teclado

**Arquivo:** `components/ui/card.tsx`

---

### 2.3 Feedback

#### Componentes

##### Toast
**Uso:** Notificação temporária (sucesso, erro, info)
**Duração:** 3s (sucesso/info), 5s (erro)
**Posição:** Top-right (mobile: bottom)

##### InlineAlert
**Uso:** Alerta inline (aviso, erro)
**Variantes:** `success`, `warning`, `info`, `error`

##### EmptyState
**Uso:** Estado vazio (título empático + CTA)
**Componentes:** Título, Descrição, Ícone, CTA

#### Mensagens Padrão

| Severidade | Tom | Exemplo |
|------------|-----|---------|
| **Sucesso** | Positivo, direto | "Receita salva com sucesso!" |
| **Erro** | Empático, acolhedor | "Não conseguimos processar. Como podemos ajustar?" |
| **Aviso** | Preventivo, claro | "Esta ação não pode ser desfeita" |
| **Info** | Informativo, útil | "Dica: Você pode salvar receitas favoritas" |

#### Critérios de Aceite
- ✅ Mensagens padrão e tons para cada severidade
- ✅ Microcopy empática (sem "!", prefira "Como podemos ajustar?")
- ✅ Títulos acolhedores em EmptyState
- ✅ CTA claro em todos os feedbacks

**Arquivo:** `components/ui/toast.tsx`, `components/ui/alert.tsx`, `components/ui/empty-state.tsx`

---

### 2.4 Loading

#### Componentes

##### Skeleton
**Uso:** Blocos predefinidos (avatar, linha, card)
**Quando usar:** Carregamento inicial de conteúdo

##### Progress
**Uso:** Barra de progresso (tarefas > 2s)
**Quando usar:** Tarefas longas (upload, processamento)

#### Guideline: Skeleton vs Spinner

| Cenário | Componente | Razão |
|---------|------------|-------|
| Carregamento inicial | **Skeleton** | Mostra estrutura do conteúdo |
| Tarefa longa (> 2s) | **Progress** | Mostra progresso real |
| Ação rápida (< 1s) | **Spinner** | Feedback imediato |

#### Critérios de Aceite
- ✅ Guideline de quando usar skeleton vs spinner
- ✅ Skeleton para carregamento inicial
- ✅ Progress para tarefas longas (> 2s)
- ✅ Acessibilidade: aria-label, aria-busy

**Arquivo:** `components/ui/skeleton.tsx`, `components/ui/progress.tsx`

---

## 3. PADRÕES

### 3.1 Listas/Grades Responsivas

#### Breakpoints

| Breakpoint | Largura | Colunas | Uso |
|------------|---------|---------|-----|
| **Mobile** | 360px, 414px | 1 | Smartphones |
| **Tablet** | 768px | 2 | Tablets |
| **Desktop** | 1024px+ | 3 | Desktops |

#### Densidades por Tipo

| Tipo | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| **Feed** | Cards compactos, 1 coluna | 2 colunas | 3 colunas |
| **Receitas** | Cards médios, 1 coluna | 2 colunas | 3 colunas |
| **Desafios** | Cards grandes, 1 coluna | 2 colunas | 3 colunas |

#### Critérios de Aceite
- ✅ Sem "saltos" de layout em breakpoints
- ✅ Densidade adequada por tipo de conteúdo
- ✅ Grid responsivo testado em 360px, 414px, 768px, 1024px

**Arquivo:** `components/ui/grid.tsx`

---

### 3.2 Formulários Sensíveis

#### Regras

- ✅ Erros em linguagem acolhedora
- ✅ Instrução sempre acima do campo
- ✅ Área de toque grande (≥ 44x44px)
- ✅ Feedback imediato (validação inline)
- ✅ Labels claros (sem jargão)

#### Microcopy

| Cenário | ❌ Ruim | ✅ Bom |
|---------|---------|-------|
| Campo obrigatório | "Campo obrigatório" | "Este campo é necessário para continuar" |
| Erro de validação | "Email inválido" | "Verifique se o email está correto" |
| Erro de servidor | "Erro! Tente novamente!" | "Não conseguimos processar. Como podemos ajustar?" |

#### Critérios de Aceite
- ✅ Microcopy empática em todos os erros
- ✅ Instruções acima dos campos
- ✅ Touch targets ≥ 44px
- ✅ Validação com feedback visual claro

**Arquivo:** `components/ui/form.tsx`, `components/ui/input.tsx`

---

## 4. MICROCOPY

### Princípios

1. **Frases curtas, diretas, respeitosas**
2. **Evitar "!" em mensagens de erro**
3. **Prefira "Como podemos ajustar?" em vez de "Erro!"**
4. **Em temas sensíveis (puerpério, luto):**
   - Abrir com empatia: "Sinto muito que você esteja passando por isso"
   - Oferecer opção de ajuda
   - Conteúdo leve (evitar sobrecarga)

### Exemplos

| Cenário | ❌ Ruim | ✅ Bom |
|---------|---------|-------|
| Erro genérico | "Erro! Tente novamente!" | "Não conseguimos processar. Como podemos ajustar?" |
| Empty state | "Nenhum item encontrado" | "Ainda não há receitas aqui. Que tal começar criando sua primeira?" |
| Campo obrigatório | "Campo obrigatório" | "Este campo é necessário para continuar" |
| Tema sensível | "Você está com depressão pós-parto?" | "Sinto muito que você esteja passando por isso. Quer conversar sobre como está se sentindo?" |

**Arquivo:** `docs/design-system-microcopy.md` (guia completo)

---

## 5. ACESSIBILIDADE

### Checklist WCAG AA

- [ ] Contraste ≥ 4.5:1 (texto) ou ≥ 3:1 (UI)
- [ ] Navegação por teclado funcional (TAB sequencial)
- [ ] Foco visível em todos elementos interativos
- [ ] ARIA labels em elementos sem texto visível
- [ ] Sem "keyboard traps"
- [ ] Suporte a leitores de tela

### Ferramentas

- **Lighthouse:** Accessibility Score ≥ 95
- **axe DevTools:** 0 violações "serious/critical"
- **Teste manual:** Navegação por TAB

**Arquivo:** `docs/A11Y_CHECKLIST.md` (checklist completo)

---

## PRÓXIMOS PASSOS

1. ✅ Aprovar este design system
2. ✅ Implementar Foundations (Semana 1)
3. ✅ Implementar Componentes (Semana 2)
4. ✅ Implementar Padrões (Semana 2-3)
5. ✅ Testar com usuárias (final Semana 1)

---

**Última atualização:** 2025-01-27
**Versão:** 1.0
**Status:** 🚧 Em construção
