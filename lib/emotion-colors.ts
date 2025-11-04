/**
 * Sistema de Cores por Estado Emocional
 * Fornece classes CSS e utilitários para cores baseadas em emoções
 */

export type EmotionType = "cansada" | "energizada" | "estressada" | "feliz" | "triste"

/**
 * Mapeamento de emoções para classes CSS
 */
export const emotionColors: Record<EmotionType, { bg: string; text: string; border: string }> = {
  cansada: {
    bg: "bg-[hsl(var(--emotion-cansada))]",
    text: "text-[hsl(var(--emotion-cansada-foreground))]",
    border: "border-[hsl(var(--emotion-cansada))]",
  },
  energizada: {
    bg: "bg-[hsl(var(--emotion-energizada))]",
    text: "text-[hsl(var(--emotion-energizada-foreground))]",
    border: "border-[hsl(var(--emotion-energizada))]",
  },
  estressada: {
    bg: "bg-[hsl(var(--emotion-estressada))]",
    text: "text-[hsl(var(--emotion-estressada-foreground))]",
    border: "border-[hsl(var(--emotion-estressada))]",
  },
  feliz: {
    bg: "bg-[hsl(var(--emotion-feliz))]",
    text: "text-[hsl(var(--emotion-feliz-foreground))]",
    border: "border-[hsl(var(--emotion-feliz))]",
  },
  triste: {
    bg: "bg-[hsl(var(--emotion-triste))]",
    text: "text-[hsl(var(--emotion-triste-foreground))]",
    border: "border-[hsl(var(--emotion-triste))]",
  },
}

/**
 * Retorna classes CSS para uma emoção específica
 */
export function getEmotionColors(emotion: EmotionType) {
  return emotionColors[emotion] || emotionColors.feliz
}

/**
 * Retorna classes CSS para background de emoção com opacidade
 */
export function getEmotionBg(emotion: EmotionType, opacity: number = 10) {
  const colors = emotionColors[emotion] || emotionColors.feliz
  return `${colors.bg}/${opacity}`
}

/**
 * Retorna classes CSS para border de emoção com opacidade
 */
export function getEmotionBorder(emotion: EmotionType, opacity: number = 20) {
  const colors = emotionColors[emotion] || emotionColors.feliz
  return `${colors.border}/${opacity}`
}

