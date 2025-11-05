# 📋 UX DEBT LOG
## Registro de Exceções ao Design System

**Objetivo:** Rastrear exceções ao design system e garantir consistência

---

## FORMATO DE ENTRADA

| Data | Componente | Exceção | Justificativa | Owner | Prazo | Status |
|------|------------|---------|---------------|-------|-------|--------|
| YYYY-MM-DD | Nome | Descrição | Por quê? | Quem? | Quando? | 🔴/🟡/🟢 |

### Status
- 🔴 **Urgente:** Exceção crítica que precisa ser resolvida
- 🟡 **Em andamento:** Exceção sendo trabalhada
- 🟢 **Resolvida:** Exceção resolvida ou justificada

---

## EXCEÇÕES ATIVAS

*Nenhuma exceção ativa no momento*

---

## EXCEÇÕES RESOLVIDAS

*Nenhuma exceção resolvida ainda*

---

## REGRAS

1. **Qualquer exceção** ao design system deve ser registrada aqui
2. **Justificativa obrigatória:** Por que a exceção é necessária?
3. **Owner e prazo:** Quem vai resolver e quando?
4. **Revisão semanal:** Revisar dívidas toda segunda-feira
5. **Documentar decisões:** Exceções aprovadas devem ser documentadas

---

## COMO USAR

### Adicionar Exceção
```markdown
| 2025-01-27 | Card de Receita | Espaçamento 20px (fora da escala) | Card especial precisa mais espaço para conteúdo | @dev | 2025-02-03 | 🟡 |
```

### Marcar como Resolvida
```markdown
| 2025-01-27 | Card de Receita | Espaçamento 20px (fora da escala) | Card especial precisa mais espaço para conteúdo | @dev | 2025-02-03 | 🟢 |
```

### Justificar Exceção Permanente
Se a exceção for justificada e aprovada, documentar em `docs/DESIGN_SYSTEM_EXCEPTIONS.md`

---

**Última atualização:** 2025-01-27
