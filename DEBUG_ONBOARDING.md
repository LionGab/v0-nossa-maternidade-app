# 🐛 DEBUG - Erro no Onboarding

## 🔍 O que sabemos

1. ✅ Conexão Supabase funcionando
2. ✅ Tabela `onboarding_responses` existe e está acessível
3. ✅ Coluna `onboarding_completed` foi adicionada
4. ❌ Erro ao salvar respostas do onboarding

## 🔎 Diagnóstico

### Possíveis Causas:

1. **Validação Zod falhando**: Algum campo no formato errado
2. **Campo obrigatório faltando**: Usuário não respondeu todas as perguntas
3. **Tipo de dados incorreto**: String ao invés de número, ou vice-versa
4. **Erro de permissão RLS**: Usuário sem permissão para inserir

---

## 🧪 Como Debugar

### 1. Abra o Console do Navegador (F12)

Quando você clicar em "Próximo" na última pergunta do onboarding, veja:

**Console Tab:**
- Procure por erros em vermelho
- Procure pela mensagem: "Onboarding: Error"
- Veja o objeto de erro completo

**Network Tab:**
1. Clique em "Network" (Rede)
2. Clique em "Fetch/XHR"
3. Quando clicar em "Próximo":
   - Procure por uma chamada para `/api/onboarding`
   - Clique nela
   - Veja a aba **"Payload"** (o que foi enviado)
   - Veja a aba **"Response"** (a resposta do servidor)

### 2. Verifique os Logs do Servidor

No terminal onde está rodando `npm run dev`, você deve ver logs como:

```
[2025-11-03T...] [WARN] Invalid onboarding data
```

ou

```
[2025-11-03T...] [ERROR] API Error: POST /api/onboarding
```

**→ Me envie essas mensagens!**

---

## 🔧 Debug Temporário

### Adicionar console.log temporário

**Antes de tentar novamente**, adicione este debug temporário:

1. **Abra:** `app/onboarding/page.tsx`
2. **Encontre a linha 102:** `body: JSON.stringify(responses),`
3. **Adicione antes dela:**
   ```typescript
   console.log('📤 Enviando dados:', responses)
   console.log('📤 Tipos:', Object.entries(responses).map(([k, v]) => [k, typeof v, v]))
   ```

4. **Salve o arquivo**

5. **Tente completar o onboarding novamente**

6. **Veja o console do navegador** - deve mostrar exatamente o que está sendo enviado

---

## 🔍 Checklist de Validação

Os dados enviados devem ter este formato:

```json
{
  "emotionalState": "feliz",           // ← string (obrigatório)
  "mainChallenges": ["sono", "rotina"], // ← array de strings (opcional)
  "sleepQuality": "regular",           // ← string (obrigatório)
  "selfCareFrequency": "as-vezes",     // ← string (obrigatório)
  "babyAge": 6,                        // ← número (obrigatório) ⚠️
  "specificNeeds": ["descanso"]        // ← array de strings (opcional)
}
```

**Verifique:**
- [ ] `emotionalState` é uma das opções: exausta, ansiosa, feliz, confusa, equilibrada
- [ ] `sleepQuality` é uma das opções: pessima, ruim, regular, boa
- [ ] `selfCareFrequency` é uma das opções: nunca, raramente, as-vezes, frequentemente
- [ ] `babyAge` é um **número** (não string!) entre 0 e 60
- [ ] `mainChallenges` é um array (pode ser vazio: [])
- [ ] `specificNeeds` é um array (pode ser vazio: [])

---

## 🎯 Teste Rápido

Você pode testar a API diretamente com curl:

```bash
# Cole seu token de autenticação aqui:
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3000/api/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "emotionalState": "feliz",
    "mainChallenges": ["sono"],
    "sleepQuality": "regular",
    "selfCareFrequency": "as-vezes",
    "babyAge": 6,
    "specificNeeds": ["descanso"]
  }'
```

---

## 📋 Próximos Passos

**Me envie:**
1. Os logs do servidor (terminal do npm run dev)
2. Screenshot do console do navegador (F12 → Console)
3. Screenshot do Network tab mostrando o Payload e Response

Com essas informações, posso identificar o problema exato! 🎯
