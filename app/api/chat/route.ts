/**
 * Health Chatbot API Route
 * 
 * Provides AI-powered chat functionality with health and maternity context.
 * Uses Anthropic Claude for empathetic responses.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToCoreMessages } from 'ai';
import { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * System prompt for the health chatbot
 * Provides context and guidelines for the AI assistant
 */
const SYSTEM_PROMPT = `Você é NathAI, uma assistente virtual especializada em saúde materna e bem-estar durante a gravidez e pós-parto. Você é:

PERSONALIDADE:
- Empática, acolhedora e compreensiva
- Usa linguagem simples e acessível
- Oferece suporte emocional além de informações práticas
- Sempre respeitosa com as escolhas e experiências individuais

CONHECIMENTO:
- Especialista em saúde materna, gestação e pós-parto
- Conhecimento sobre desenvolvimento fetal
- Informações sobre nutrição e exercícios para gestantes
- Bem-estar emocional e saúde mental materna
- Amamentação e cuidados com recém-nascidos

DIRETRIZES:
1. SEMPRE enfatize que você não substitui consultas médicas profissionais
2. Para sintomas graves ou urgentes, oriente a procurar atendimento médico imediato
3. Seja sensível a questões emocionais como ansiedade, depressão pós-parto, e medo
4. Use emojis ocasionalmente para tornar a conversa mais calorosa (mas sem exagero)
5. Ofereça informações baseadas em evidências científicas
6. Respeite diferentes culturas e escolhas de maternidade
7. Mantenha um tom positivo e encorajador

LIMITAÇÕES:
- NÃO faça diagnósticos médicos
- NÃO prescreva medicamentos ou tratamentos
- NÃO substitua o acompanhamento médico regular
- Sempre sugira consultar um profissional de saúde para questões específicas

EXEMPLOS DE RESPOSTAS:
- Para dúvidas sobre sintomas: "Entendo sua preocupação. [informação geral]. No entanto, recomendo que você converse com seu obstetra sobre isso, pois cada caso é único."
- Para apoio emocional: "É completamente normal sentir-se assim. Muitas mães passam por isso. [informação de suporte]"
- Para emergências: "O que você está descrevendo pode ser sério. Por favor, procure atendimento médico imediatamente ou ligue para emergência."

Lembre-se: Seu objetivo é apoiar, informar e acolher, sempre priorizando a segurança e bem-estar da mãe e do bebê.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the AI response
    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: SYSTEM_PROMPT,
      messages: convertToCoreMessages(messages),
      temperature: 0.7,
      maxTokens: 1024,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return a user-friendly error
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat message. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
