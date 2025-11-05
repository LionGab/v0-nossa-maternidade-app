# ✅ CHECKLIST DE REVISÃO (ANTES DO MERGE)
## Design System V1 - Nossa Maternidade

**Objetivo:** Garantir qualidade antes de cada merge

---

## A11Y (ACESSIBILIDADE)

### Contraste
- [ ] Amostras de 10 componentes/estados testadas
- [ ] Todas ≥ 4.5:1 (texto) ou ≥ 3:1 (UI)
- [ ] Dark mode: contrastes validados
- [ ] Lighthouse Accessibility Score ≥ 95
- [ ] axe DevTools: 0 violações "serious/critical"

### Navegação por Teclado
- [ ] Navegação por TAB funcional em todos os elementos interativos
- [ ] Ordem de foco lógica (sequencial)
- [ ] Sem "keyboard traps"
- [ ] Foco visível com contraste ≥ 3:1
- [ ] Teste manual: navegação completa por TAB

### ARIA Labels
- [ ] `aria-label` em todos os ícones sem texto
- [ ] `aria-label` em todos os botões sem texto
- [ ] `role` apropriado em elementos semânticos
- [ ] `aria-hidden="true"` em elementos decorativos
- [ ] Teste com leitor de tela (NVDA, JAWS, VoiceOver)

---

## PERFORMANCE MÓVEL

### Métricas
- [ ] LCP ≤ 2,5s (Lighthouse Mobile)
- [ ] CLS ≤ 0,1 (Lighthouse Mobile)
- [ ] JS inicial ≤ 200KB
- [ ] TTI ≤ 3,0s (Mobile Slow 4G + 4x CPU throttle)

### Como Medir
- Lighthouse Performance (Mobile)
- Chrome DevTools: CPU Throttling 4x + Network Throttling Slow 4G

---

## CONTEÚDO (MICROCOPY)

### Linguagem
- [ ] Microcopy em pt-BR inclusivo
- [ ] Sem jargão técnico
- [ ] Tom acolhedor e empático
- [ ] Mensagens de erro empáticas (sem "!")

### Exemplos
- [ ] Erros: "Como podemos ajustar?" em vez de "Erro!"
- [ ] Empty states: mensagens acolhedoras
- [ ] Formulários: instruções acima dos campos
- [ ] Temas sensíveis: abertura empática

---

## RESPONSIVIDADE

### Breakpoints
- [ ] 360px testado (sem "saltos" de layout)
- [ ] 414px testado (sem "saltos" de layout)
- [ ] 768px testado (sem "saltos" de layout)
- [ ] 1024px testado (sem "saltos" de layout)

### Touch Targets
- [ ] Área de toque ≥ 44x44px em mobile
- [ ] Ícones: área de toque ≥ 40x40px
- [ ] Botões: área de toque ≥ 44x44px

---

## CONSISTÊNCIA

### Design System
- [ ] Cores: usando tokens semânticos (não hardcoded)
- [ ] Tipografia: usando escala definida (Display, Title, Body, Caption)
- [ ] Espaçamento: usando escala fixa (4, 8, 12, 16, 24, 32px)
- [ ] Elevação: usando níveis definidos (flat, elevated, interactive)
- [ ] Motion: usando durações/easings definidos (120/200/300ms)

### Exceções
- [ ] Exceções documentadas no UX Debt Log
- [ ] Justificativa obrigatória para exceções
- [ ] Owner e prazo definidos para exceções

---

## TESTES

### Automatizados
- [ ] Testes unitários: todos passando
- [ ] Testes E2E: todos passando
- [ ] Lighthouse: Accessibility ≥ 95, Performance ≥ 90

### Manuais
- [ ] Navegação por teclado testada
- [ ] Contraste validado visualmente
- [ ] Responsividade testada em 360px, 414px, 768px, 1024px
- [ ] Dark mode testado (se aplicável)

---

## DOCUMENTAÇÃO

### Design System
- [ ] Componente documentado em `docs/DESIGN_SYSTEM_V1.md`
- [ ] Exemplos de uso incluídos
- [ ] Critérios de aceite documentados
- [ ] Status atualizado em `docs/COMPONENT_STATUS.md`

### Mudanças
- [ ] Changelog atualizado
- [ ] Breaking changes documentados
- [ ] Migration guide (se aplicável)

---

## PRÓXIMOS PASSOS

1. ✅ Executar checklist completo antes de cada merge
2. ✅ Documentar exceções no UX Debt Log
3. ✅ Atualizar status em `docs/COMPONENT_STATUS.md`
4. ✅ Revisar com equipe antes de merge

---

**Última atualização:** 2025-01-27
