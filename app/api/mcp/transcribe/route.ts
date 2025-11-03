import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createServerClient } from "@/lib/supabase/server"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export { OPTIONS } // CORS preflight

// MCP: Transcrição e Análise de Áudio
async function handleTranscribe(req: NextRequest) {
  const startTime = Date.now()
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 })
    }

    // Convert File to Buffer for Whisper API
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Transcribe using OpenAI Whisper
    const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const formData = new FormData()
        formData.append("file", new Blob([buffer]), audioFile.name)
        formData.append("model", "whisper-1")
        formData.append("language", "pt")
        return formData
      })(),
    })

    if (!transcriptionResponse.ok) {
      throw new Error("Transcription failed")
    }

    const { text: transcript } = await transcriptionResponse.json()

    // Analyze sentiment and emotion from transcript
    const { text: analysis } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `Analise o seguinte áudio transcrito de uma mãe. Identifique:
1. Estado emocional (calma, ansiosa, feliz, triste, estressada, etc.)
2. Tom de voz percebido (baseado nas palavras e contexto)
3. Principais preocupações ou alegrias mencionadas
4. Nível de urgência (baixo, médio, alto)

Transcrição:
${transcript}

Forneça a análise em formato JSON com as chaves: emotion, tone, concerns, urgency, summary`,
    })

    let parsedAnalysis
    try {
      parsedAnalysis = JSON.parse(analysis)
    } catch {
      parsedAnalysis = { summary: analysis }
    }

    logger.info("Audio transcribed and analyzed successfully", {
      userId: user.id,
      audioSize: audioFile.size,
      transcriptLength: transcript.length,
      duration: Date.now() - startTime
    })
    return NextResponse.json({
      transcript,
      analysis: parsedAnalysis,
      duration: audioFile.size, // approximate
    })
  } catch (error) {
    logger.apiError("POST", "/api/mcp/transcribe", error as Error, { duration: Date.now() - startTime })
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}

export const POST = withRateLimit(handleTranscribe, RATE_LIMITS.HEAVY)
