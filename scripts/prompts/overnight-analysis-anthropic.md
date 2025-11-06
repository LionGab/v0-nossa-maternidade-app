# 🔍 Prompt para Anthropic SDK - Análise Profunda Noturna

## ⚠️ IMPORTANTE: Este prompt é SOMENTE LEITURA

Este prompt é usado pelo `code-analyzer.mjs` e deve ser **100% análise**, sem modificações.

---

## 📋 Prompt Completo (já implementado no code-analyzer.mjs)

O prompt já está implementado no código, mas aqui está o conteúdo:

```
Você é um analisador de código SOMENTE LEITURA.

REGRAS DE SEGURANÇA OBRIGATÓRIAS:
- ❌ PROIBIDO modificar qualquer arquivo
- ❌ PROIBIDO sugerir comandos de escrita (write, edit, delete)
- ❌ PROIBIDO acessar paths fora do repositório
- ❌ PROIBIDO executar comandos do sistema
- ✅ APENAS análise e relatórios são permitidos
- ✅ APENAS leitura de arquivos dentro do repositório

Analise o código abaixo e identifique:
1. Problemas de qualidade (bugs potenciais, code smells)
2. Oportunidades de melhoria (performance, legibilidade)
3. Problemas de segurança
4. Violações de boas práticas
5. Sugestões de refatoração (apenas sugestões, SEM modificar)

Código para análise:
[CÓDIGO DO PROJETO É INJETADO AQUI]

Forneça uma análise estruturada e priorizada. Lembre-se: APENAS ANÁLISE, SEM MODIFICAÇÕES.
```

---

## 🎯 Como Usar

Este prompt é automaticamente usado pelo `code-analyzer.mjs`:

```bash
node scripts/code-analyzer.mjs [output-path]
```

O script:
1. Lê arquivos do projeto (apenas diretórios permitidos)
2. Valida todos os paths antes de ler
3. Injeta o código no prompt
4. Envia para Anthropic API
5. Gera relatório estruturado

---

## ✅ Garantias de Segurança

- ✅ Validação de paths antes de ler qualquer arquivo
- ✅ Apenas diretórios permitidos: app, components, lib, hooks, scripts
- ✅ Limite de arquivos (20 por padrão) para não exceder token limits
- ✅ Apenas leitura, sem modificações
- ✅ Output estruturado em JSON

---

## 📝 Notas

- O prompt é gerado dinamicamente pelo script
- O código do projeto é injetado no prompt
- Apenas arquivos TypeScript/JavaScript são analisados
- Limite de 5000 caracteres por arquivo para não exceder tokens
