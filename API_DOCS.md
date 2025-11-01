# Nossa Maternidade - Documentação de APIs

## Visão Geral

Todas as APIs retornam JSON e seguem padrões REST. Endpoints protegidos requerem autenticação via Supabase JWT.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Autenticação

Todas as rotas protegidas verificam JWT via `createClient()`:

```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })
```

## Endpoints

### Onboarding

#### POST `/api/onboarding`

Salva respostas do onboarding inicial.

**Request Body:**
```json
{
  "emotionalState": "feliz" | "ansiosa" | "exausta" | "confusa" | "equilibrada",
  "mainChallenges": ["sono", "amamentacao", "tempo"],
  "sleepQuality": "pessima" | "ruim" | "regular" | "boa",
  "selfCareFrequency": "nunca" | "raramente" | "as-vezes" | "frequentemente",
  "babyAge": 0-60,
  "specificNeeds": ["descanso", "organizacao", "apoio-emocional"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* onboarding data */ }
}
```

**Errors:**
- `400` - Invalid input data
- `401` - Unauthorized

---

### Gamificação

#### GET `/api/gamification/stats`

Retorna estatísticas de gamificação do usuário.

**Response:**
```json
{
  "level": 1,
  "points": 150,
  "streak": 5,
  "achievements": [ /* ... */ ],
  "challenges": [ /* ... */ ]
}
```

**Errors:**
- `401` - Unauthorized

#### POST `/api/gamification/activity`

Registra uma atividade de gamificação.

**Request Body:**
```json
{
  "activityType": "diary_entry" | "chat_message" | "recipe_saved",
  "metadata": { /* optional */ }
}
```

**Response:**
```json
{
  "pointsEarned": 10,
  "levelUp": false,
  "newAchievements": [ /* ... */ ]
}
```

**Errors:**
- `400` - Invalid input
- `401` - Unauthorized

---

### Multi-AI Chat

#### POST `/api/multi-ai/chat`

Chat conversacional com múltiplos modelos IA.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Como estou?" },
    { "role": "assistant", "content": "..." }
  ],
  "useEmpatheticMode": false
}
```

**Response:**
- Streaming text (text/plain)
- Modo empático usa Claude Sonnet 4
- Modo geral usa GPT-4 Turbo

**Errors:**
- `400` - Invalid messages format
- `401` - Unauthorized

---

### Análise de Sentimento

#### POST `/api/multi-ai/sentiment`

Análise multi-modelo de sentimentos e emoções.

**Request Body:**
```json
{
  "responses": {
    "emotionalState": "feliz",
    "mainChallenges": ["sono"],
    "sleepQuality": "regular"
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "emotion": "mixed",
    "riskLevel": "low",
    "concerns": [ /* ... */ ],
    "recommendations": [ /* ... */ ],
    "selfCareActions": [ /* ... */ ],
    "sleepPattern": { /* ... */ },
    "supportNetwork": { /* ... */ },
    "models_used": ["claude-sonnet-4", "gemini-2.0-flash"]
  }
}
```

**Errors:**
- `400` - Missing responses
- `401` - Unauthorized
- `500` - AI processing error

---

#### POST `/api/sentiment-analysis`

Análise básica de sentimento (Grok).

**Request Body:**
```json
{
  "responses": { /* onboarding responses */ },
  "analysisType": "onboarding"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "sentiment_score": 0.3,
    "sentiment_label": "mixed",
    "emotions": {
      "joy": 0.4,
      "sadness": 0.3,
      "anxiety": 0.6,
      "stress": 0.7,
      "hope": 0.5,
      "overwhelm": 0.8
    },
    "recommendations": [ /* ... */ ],
    "supportive_message": "..."
  }
}
```

---

### Triagem Pós-Parto

#### POST `/api/multi-ai/postpartum-screening`

Triagem avançada para depressão pós-parto.

**Response:**
```json
{
  "success": true,
  "screening": {
    "riskScore": 12,
    "symptoms": [ /* ... */ ],
    "riskFactors": [ /* ... */ ],
    "protectiveFactors": [ /* ... */ ],
    "recommendations": [ /* ... */ ],
    "needsProfessionalHelp": false,
    "emergencyResources": [ /* ... */ ],
    "temporalAnalysis": { /* ... */ },
    "models_used": ["claude-sonnet-4", "gemini-2.0-flash"]
  }
}
```

**Nota:** Se `riskScore > 13`, cria alerta automático em `health_alerts`.

---

### Recomendações

#### POST `/api/multi-ai/recommendations`

Recomendações personalizadas de IA.

**Request Body:**
```json
{
  "category": "selfcare" | "activities" | "recipes" | "sleep"
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "title": "...",
      "description": "...",
      "duration": "...",
      "difficulty": "...",
      "benefits": "...",
      "tips": [ /* ... */ ],
      "adaptations": [ /* ... */ ],
      "warnings": [ /* ... */ ]
    }
  ],
  "generated_by": ["gpt-4", "gemini-2.0-flash"]
}
```

---

### Receitas

#### POST `/api/generate-recipes`

Gera receitas personalizadas baseadas em humor e ingredientes.

**Request Body:**
```json
{
  "mood": "cansada",
  "preferences": "vegetariana",
  "ingredients": "frango, arroz, legumes"
}
```

**Response:**
```json
{
  "recipes": [
    {
      "name": "Frango Energético",
      "description": "...",
      "category": "jantar",
      "prepTime": "30 min",
      "servings": "2-3",
      "difficulty": "Fácil",
      "ingredients": [ /* ... */ ],
      "instructions": [ /* ... */ ],
      "nutritionalBenefit": "Fornece energia duradoura"
    }
  ]
}
```

**Errors:**
- `400` - Invalid input
- `401` - Unauthorized

---

### Notícias

#### POST `/api/maternal-news`

Notícias sobre maternidade geradas por IA.

**Request Body:**
```json
{
  "category": "all" | "pregnancy" | "parenting" | "health" | "trends"
}
```

**Response:**
```json
{
  "articles": [
    {
      "title": "...",
      "summary": "...",
      "category": "Saúde",
      "source": "Portal Mãe Moderna",
      "publishedAt": "2025-01-20T10:00:00Z",
      "url": "https://..."
    }
  ]
}
```

---

### Pesquisa

#### POST `/api/multi-ai/research`

Pesquisa informativa com fontes citadas (Perplexity).

**Request Body:**
```json
{
  "query": "Como melhorar o sono do bebê?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "...",
  "sources": ["https://...", "https://..."],
  "model": "perplexity-sonar"
}
```

---

### MCP (Memory Context Protocol)

#### POST `/api/mcp/transcribe`

Transcreve e analisa áudio.

**Request Body:**
- `FormData` com campo `audio` (File)

**Response:**
```json
{
  "transcript": "...",
  "analysis": {
    "emotion": "...",
    "tone": "...",
    "concerns": [ /* ... */ ],
    "urgency": "medium"
  },
  "duration": 12345
}
```

---

#### POST `/api/mcp/summarize`

Resume texto com IA empática.

**Request Body:**
```json
{
  "text": "...",
  "type": "diary" | "post" | "conversation"
}
```

**Response:**
```json
{
  "summary": "...",
  "topics": ["...", "..."],
  "originalLength": 500,
  "summaryLength": 150
}
```

---

#### POST `/api/mcp/semantic-search`

Busca semântica em memórias.

**Request Body:**
```json
{
  "query": "amamentação",
  "limit": 10,
  "threshold": 0.7
}
```

**Response:**
```json
{
  "results": [
    {
      "contentText": "...",
      "contentType": "conversation",
      "similarity": 0.85,
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ],
  "count": 5,
  "query": "amamentação"
}
```

---

#### POST `/api/mcp/conversational-onboarding`

Onboarding conversacional guiado por IA.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Olá!" }
  ]
}
```

**Response:**
- Streaming text (text/plain)

---

### Chat com Memória

#### POST `/api/chat-with-memory`

Chat com contexto de até 90 dias.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Como estava minha semana passada?" }
  ]
}
```

**Response:**
- Streaming text (text/plain)
- Contexto automático de histórico

---

## Códigos de Status

- `200` - Success
- `400` - Bad Request (validação falhou)
- `401` - Unauthorized (não autenticado)
- `500` - Internal Server Error

## Tratamento de Erros

Todas APIs retornam erros padronizados:

```json
{
  "error": "Descriptive error message",
  "details": "Additional context (dev only)"
}
```

## Rate Limiting

Endpoints críticos têm rate limiting:
- 100 requests/min por usuário (padrão)
- Retorna `429 Too Many Requests` se excedido

## Validação

Todas as APIs validam entrada com Zod:

```typescript
const result = schema.safeParse(body)
if (!result.success) {
  return Response.json(
    { error: "Invalid input", details: result.error.errors },
    { status: 400 }
  )
}
```

## Streaming

Alguns endpoints retornam streaming:

```typescript
return new Response(readableStream, {
  headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Transfer-Encoding": "chunked"
  }
})
```

## Observações

- Todas APIs são assíncronas
- Error logs salvos em produção (Sentry)
- Cache via SWR no cliente
- Database indexes otimizados

