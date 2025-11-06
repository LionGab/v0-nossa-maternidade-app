/**
 * API - Salvar Vídeo
 * Salva um vídeo do Mundo Nath para o perfil do usuário
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { withRateLimit, OPTIONS, RATE_LIMITS } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { z } from "zod"

export { OPTIONS } // CORS preflight

// Schema de validação
const saveVideoSchema = z.object({
  videoId: z.number().int().positive(),
  videoTitle: z.string().min(1).max(300),
  videoDescription: z.string().optional(),
  videoUrl: z.string().url().optional(),
  videoThumbnailUrl: z.string().url().optional(),
})

async function saveVideoHandler(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn("Unauthorized video save attempt")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados
    const validationResult = saveVideoSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn("Invalid video save data", {
        userId: user.id,
        errors: validationResult.error.errors,
      })
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { videoId, videoTitle, videoDescription, videoUrl, videoThumbnailUrl } =
      validationResult.data

    // Verificar se já existe (evitar duplicatas)
    const { data: existing } = await supabase
      .from("saved_videos")
      .select("id")
      .eq("user_id", user.id)
      .eq("video_id", videoId)
      .single()

    if (existing) {
      logger.info("Video already saved", { userId: user.id, videoId })
      return NextResponse.json(
        {
          success: true,
          message: "Vídeo já está salvo",
          saved: true,
        },
        { status: 200 },
      )
    }

    // Salvar vídeo
    const { data, error } = await supabase
      .from("saved_videos")
      .insert({
        user_id: user.id,
        video_id: videoId,
        video_title: videoTitle,
        video_description: videoDescription || null,
        video_url: videoUrl || null,
        video_thumbnail_url: videoThumbnailUrl || null,
      })
      .select("id")
      .single()

    if (error) {
      logger.error(
        "Failed to save video",
        error instanceof Error ? error : new Error(String(error)),
        {
          userId: user.id,
          videoId,
        },
      )
      return NextResponse.json(
        {
          error: "Erro ao salvar vídeo",
          message: error.message,
        },
        { status: 500 },
      )
    }

    const duration = Date.now() - startTime
    logger.info("Video saved successfully", {
      userId: user.id,
      savedVideoId: data.id,
      videoId,
      videoTitle,
      duration,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Vídeo salvo com sucesso!",
        savedVideoId: data.id,
      },
      { status: 201 },
    )
  } catch (error) {
    logger.error(
      "Error saving video",
      error instanceof Error ? error : new Error(String(error)),
      {
        duration: Date.now() - startTime,
      },
    )

    return NextResponse.json(
      {
        error: "Erro ao salvar vídeo",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export const POST = withRateLimit(saveVideoHandler, RATE_LIMITS.AUTHENTICATED)

