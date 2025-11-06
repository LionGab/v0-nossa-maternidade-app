/**
 * 🛡️ Sistema de Guardrails - Nossa Maternidade
 * Garante que IA nunca saia do contexto de maternidade
 */

// Tópicos permitidos no contexto de maternidade
const ALLOWED_TOPICS = [
  'maternidade',
  'puerpério',
  'pós-parto',
  'bebê',
  'bebê',
  'criança',
  'amamentação',
  'aleitamento',
  'desenvolvimento infantil',
  'sono do bebê',
  'rotina',
  'cuidados maternos',
  'autocuidado',
  'saúde mental materna',
  'depressão pós-parto',
  'ansiedade',
  'cuidados com o bebê',
  'alimentação',
  'receitas',
  'birras',
  'desenvolvimento',
  'brincadeiras',
  'histórias',
  'cólicas',
  'desmame',
  'introdução alimentar',
  'mãe',
  'mãe',
  'gestação',
  'gravidez',
  'parto',
  'recém-nascido',
  'lactação',
  'vínculo',
  'bem-estar',
  'exaustão',
  'cansaço',
  'organização',
  'rotina semanal',
  'cuidados pessoais',
  'cuidados com o corpo',
  'relacionamento',
  'família',
  'dúvidas',
  'ajuda',
  'suporte',
  'conselhos',
  'dicas',
  'orientações',
]

// Palavras-chave que indicam off-topic
const OFF_TOPIC_KEYWORDS = [
  'política',
  'religião',
  'futebol',
  'esportes',
  'tecnologia',
  'programação',
  'código',
  'negócios',
  'investimentos',
  'finanças pessoais',
  'viagem',
  'turismo',
  'moda',
  'maquiagem',
  'beleza',
  'cabelo',
  'notícias',
  'entretenimento',
  'filmes',
  'séries',
  'música',
  'jogos',
  'video game',
]

/**
 * Verifica se uma mensagem está no contexto de maternidade
 */
export function isInMaternityContext(message: string): boolean {
  const lowerMessage = message.toLowerCase()

  // Verificar se tem palavras off-topic
  const hasOffTopic = OFF_TOPIC_KEYWORDS.some(keyword =>
    lowerMessage.includes(keyword)
  )

  if (hasOffTopic) {
    return false
  }

  // Verificar se tem palavras relacionadas a maternidade
  const hasMaternityTopic = ALLOWED_TOPICS.some(topic =>
    lowerMessage.includes(topic)
  )

  return hasMaternityTopic
}

/**
 * Verifica se uma resposta está no contexto de maternidade
 */
export function isResponseInContext(response: string): boolean {
  const lowerResponse = response.toLowerCase()

  // Verificar se resposta menciona maternidade
  const mentionsMaternity = ALLOWED_TOPICS.some(topic =>
    lowerResponse.includes(topic)
  )

  // Verificar se não menciona off-topic
  const mentionsOffTopic = OFF_TOPIC_KEYWORDS.some(keyword =>
    lowerResponse.includes(keyword)
  )

  return mentionsMaternity && !mentionsOffTopic
}

/**
 * Gera mensagem de redirecionamento para contexto de maternidade
 */
export function getRedirectMessage(userQuestion: string): string {
  return `Desculpe, mas minha especialidade é ajudar você com questões relacionadas à maternidade, puerpério, cuidados com o bebê e bem-estar materno.

Posso te ajudar com:
- Dúvidas sobre desenvolvimento do bebê
- Cuidados pós-parto
- Amamentação e alimentação
- Rotina e organização
- Autocuidado materno
- Desafios da maternidade
- E muito mais relacionado a maternidade!

Como posso te ajudar hoje com questões relacionadas à maternidade? 💕`
}

/**
 * Detecta necessidade emocional na mensagem
 */
export function detectEmotionalNeed(message: string): boolean {
  const lowerMessage = message.toLowerCase()

  const emotionalKeywords = [
    'cansada',
    'cansada',
    'exausta',
    'triste',
    'deprimida',
    'ansiosa',
    'preocupada',
    'sozinha',
    'sozinha',
    'desanimada',
    'sem esperança',
    'não aguento',
    'não consigo',
    'difícil',
    'muito difícil',
    'desabafo',
    'preciso desabafar',
    'quero desabafar',
    'me sinto',
    'estou sentindo',
    'não sei o que fazer',
    'ajuda',
    'preciso de ajuda',
    'me ajuda',
    'desesperada',
    'perdida',
    'confusa',
  ]

  return emotionalKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Valida contexto antes de enviar para IA
 */
export function validateContext(message: string): {
  isValid: boolean
  shouldRedirect: boolean
  redirectMessage?: string
  needsEmpathy: boolean
} {
  const inContext = isInMaternityContext(message)
  const needsEmpathy = detectEmotionalNeed(message)

  if (!inContext) {
    return {
      isValid: false,
      shouldRedirect: true,
      redirectMessage: getRedirectMessage(message),
      needsEmpathy: false,
    }
  }

  return {
    isValid: true,
    shouldRedirect: false,
    needsEmpathy,
  }
}
