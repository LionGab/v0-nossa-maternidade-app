import { z } from "zod"

export const gamificationActivitySchema = z.object({
  activityType: z.enum([
    "chat_message",
    "diary_entry",
    "recipe_saved",
    "community_post",
    "community_comment",
    "profile_update",
    "daily_checkin",
  ]),
  points: z.number().int().min(0).max(1000).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type GamificationActivityData = z.infer<typeof gamificationActivitySchema>
