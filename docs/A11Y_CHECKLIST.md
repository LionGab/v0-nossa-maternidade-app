# ♿ CHECKLIST DE ACESSIBILIDADE (A11Y)
## WCAG AA - Design System V1

**Objetivo:** Garantir que todos os componentes atendam WCAG AA (≥ 95% no Lighthouse)

---

## CHECKLIST GERAL

### Contraste
- [ ] Contraste ≥ 4.5:1 para texto normal
- [ ] Contraste ≥ 3:1 para texto grande (≥ 18px ou ≥ 14px bold)
- [ ] Contraste ≥ 3:1 para elementos de UI (botões, bordas, ícones)
- [ ] Contraste ≥ 4.5:1 em dark mode
- [ ] Todas as cores validadas com ferramenta de contraste

**Como medir:**
- Lighthouse Accessibility Score ≥ 95
- axe DevTools: verificar contraste
- WebAIM Contrast Checker

---

### Navegação por Teclado
- [ ] Navegação por TAB funciona em todos os elementos interativos
- [ ] Ordem de foco lógica (sequencial)
- [ ] Sem "keyboard traps" (foco preso)
- [ ] Foco visível em todos os elementos interativos
- [ ] Foco com contraste ≥ 3:1

**Como testar:**
- Navegar por TAB em toda a aplicação
- Verificar se foco está visível
- Verificar se não há "traps"

---

### Foco Visível
- [ ] Outline visível em todos os elementos interativos
- [ ] Outline com contraste ≥ 3:1
- [ ] Outline com largura ≥ 2px
- [ ] Outline não removido (exceto em hover/focus)

**Como testar:**
- Verificar visualmente todos os elementos interativos
- Testar com navegação por teclado

---

### ARIA Labels
- [ ] `aria-label` em todos os ícones sem texto
- [ ] `aria-label` em todos os botões sem texto
- [ ] `aria-label` em todos os links sem texto descritivo
- [ ] `role` apropriado em elementos semânticos
- [ ] `aria-hidden="true"` em elementos decorativos

**Como testar:**
- Verificar HTML de todos os componentes
- Testar com leitor de tela (NVDA, JAWS, VoiceOver)

---

### Leitores de Tela
- [ ] Todos os elementos interativos anunciados corretamente
- [ ] Textos descritivos em todos os elementos
- [ ] Navegação por headings funcional
- [ ] Landmarks semânticos (header, nav, main, footer)

**Como testar:**
- Testar com NVDA (Windows) ou VoiceOver (macOS/iOS)
- Navegar por headings (H1, H2, etc.)
- Verificar se elementos são anunciados corretamente

---

## CHECKLIST POR COMPONENTE

### Ícones
- [ ] `aria-label` em todos os ícones sem texto
- [ ] `role="img"` em ícones decorativos
- [ ] Área de toque ≥ 40x40px em mobile
- [ ] Foco visível com contraste ≥ 3:1
- [ ] Navegação por teclado funcional

---

### Cards
- [ ] Contraste adequado em todos os estados (hover, focus, disabled, error)
- [ ] Foco visível em cards interativos
- [ ] Navegação por teclado funcional
- [ ] ARIA labels em cards clicáveis
- [ ] `role` apropriado (ex.: `button`, `link`)

---

### Formulários
- [ ] Labels associados a todos os campos
- [ ] Mensagens de erro descritivas
- [ ] Instruções acima dos campos
- [ ] Validação inline com feedback claro
- [ ] Área de toque ≥ 44x44px em mobile

---

### Feedback (Toast/Alert)
- [ ] `role="alert"` em mensagens críticas
- [ ] `role="status"` em mensagens informativas
- [ ] Foco visível em botões de fechar
- [ ] Navegação por teclado funcional
- [ ] Contraste adequado em todos os estados

---

### Loading (Skeleton/Progress)
- [ ] `aria-label` em elementos de loading
- [ ] `aria-busy="true"` durante carregamento
- [ ] `aria-live="polite"` em progresso
- [ ] Feedback descritivo (ex.: "Carregando receitas...")
- [ ] Contraste adequado em skeleton

---

## FERRAMENTAS

### Automatizadas
- **Lighthouse:** Accessibility Score ≥ 95
- **axe DevTools:** 0 violações "serious/critical"
- **WAVE:** Verificar erros e avisos

### Manuais
- **Teste de teclado:** Navegar por TAB
- **Leitor de tela:** NVDA, JAWS, VoiceOver
- **Contraste:** WebAIM Contrast Checker

---

## CRITÉRIOS DE ACEITE

### Antes do Merge
- ✅ Lighthouse Accessibility Score ≥ 95
- ✅ axe DevTools: 0 violações "serious/critical"
- ✅ Teste manual: navegação por TAB funcional
- ✅ Teste manual: contraste ≥ 4.5:1 em todas as páginas-chave
- ✅ Teste manual: foco visível em todos os elementos interativos

---

## PRÓXIMOS PASSOS

1. ✅ Executar Lighthouse em todas as páginas-chave
2. ✅ Executar axe DevTools em todos os componentes
3. ✅ Testar navegação por teclado em toda a aplicação
4. ✅ Validar contraste em todas as cores
5. ✅ Testar com leitor de tela

---

**Última atualização:** 2025-01-27
