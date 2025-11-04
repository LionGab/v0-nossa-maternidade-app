# 🤖 Prompt para GitHub Copilot CLI - Análise Noturna

## ⚠️ IMPORTANTE: Este prompt é SOMENTE LEITURA

Este prompt é usado pelo `copilot-executor.ps1` e deve ser **100% análise**, sem modificações.

---

## 📋 Prompt Completo

```
Analise o código deste projeto e identifique:

1. PROBLEMAS DE QUALIDADE:
   - Bugs potenciais (lógica incorreta, edge cases não tratados)
   - Code smells (duplicação, complexidade ciclomática alta)
   - Problemas de performance (loops ineficientes, re-renders desnecessários)
   - Problemas de acessibilidade (ARIA faltando, contraste de cores)

2. PROBLEMAS DE SEGURANÇA:
   - Exposição de dados sensíveis
   - Falta de validação de inputs
   - Vulnerabilidades XSS/CSRF
   - Problemas de autenticação/autorização

3. VIOLAÇÕES DE BOAS PRÁTICAS:
   - Não seguir padrões do projeto
   - Violações de TypeScript (any, any[], etc)
   - Componentes muito grandes (deveria ser quebrado)
   - Hooks mal utilizados (dependencies faltando)

4. OPORTUNIDADES DE MELHORIA:
   - Refatorações sugeridas (sem fazer)
   - Otimizações possíveis (sem implementar)
   - Melhorias de UX sugeridas (sem modificar)

5. PROBLEMAS DE TESTES:
   - Código não testado
   - Testes frágeis ou mal escritos
   - Cobertura insuficiente

REGRAS OBRIGATÓRIAS:
- ❌ NÃO modifique nenhum arquivo
- ❌ NÃO sugira comandos de escrita (write, edit, delete)
- ❌ NÃO acesse paths fora do repositório
- ❌ NÃO execute comandos do sistema
- ✅ APENAS análise e identificação de problemas
- ✅ APENAS sugestões de melhorias (sem implementar)
- ✅ APENAS leitura de arquivos em: app/, components/, lib/, hooks/, scripts/

Forneça uma análise estruturada com:
- Lista de problemas encontrados (priorizados por severidade)
- Explicação de cada problema
- Sugestão de correção (SEM implementar)
- Impacto estimado (crítico, alto, médio, baixo)

Formato de resposta: JSON estruturado ou Markdown legível.
```

---

## 🎯 Como Usar

Este prompt é automaticamente enviado pelo `copilot-executor.ps1` quando chamado:

```powershell
.\scripts\copilot-executor.ps1 -Prompt "Analise o código..." -OutputFile "reports/copilot/analysis.json"
```

O script adiciona automaticamente as instruções de segurança antes de enviar.

---

## ✅ Garantias de Segurança

- ✅ Validação de paths antes de executar
- ✅ Detecção de comandos perigosos
- ✅ Validação de diretórios permitidos
- ✅ Timeout para evitar execução infinita
- ✅ Output capturado para análise posterior

---

## 📝 Notas

- Este prompt é **somente leitura**
- Todas as validações de segurança são aplicadas ANTES de executar
- Se qualquer validação falhar, o script para ANTES de chamar o Copilot
- O output é salvo em JSON para análise posterior
