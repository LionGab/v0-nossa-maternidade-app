/**
 * Sistema de Feature Flags por Usuária
 * Permite testar diferentes IAs com diferentes usuárias
 * Suporta A/B testing
 */

import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export type FeatureFlag =
    | "use_grok"
    | "use_gemini_pro"
    | "smart_routing"
    | "enhanced_analytics"
    | "news_widget"
    | "cost_tracking"

export type ABTestGroup =
    | "control"
    | "grok"
    | "gemini"
    | "smart"

export interface UserFeatureFlags {
    user_id: string
    flags: Record<FeatureFlag, boolean>
    ab_test_group: ABTestGroup
    updated_at: string
}

/**
 * Obtém feature flags de uma usuária
 */
export async function getUserFeatureFlags(
    userId: string
): Promise<UserFeatureFlags | null> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("user_feature_flags")
            .select("*")
            .eq("user_id", userId)
            .single()

        if (error) {
            // Se não existe, criar com flags padrão
            if (error.code === "PGRST116") {
                return await createDefaultFeatureFlags(userId)
            }

            logger.error("Failed to get user feature flags", new Error(error.message), { 
                userId,
             })
            return null
        }

        return {
            user_id: data.user_id,
            flags: data.flags || {},
            ab_test_group: data.ab_test_group || "control",
            updated_at: data.updated_at,
        }
    } catch (error) {
        logger.error("Error getting user feature flags", error instanceof Error ? error : new Error(String(error)), { 
            userId,
         })
        return null
    }
}

/**
 * Cria flags padrão para uma usuária
 */
async function createDefaultFeatureFlags(
    userId: string
): Promise<UserFeatureFlags | null> {
    try {
        const supabase = await createClient()

        const defaultFlags: Record<FeatureFlag, boolean> = {
            use_grok: false,
            use_gemini_pro: false,
            smart_routing: false,
            enhanced_analytics: false,
            news_widget: false,
            cost_tracking: false,
        }

        const { data, error } = await supabase
            .from("user_feature_flags")
            .insert({
                user_id: userId,
                flags: defaultFlags,
                ab_test_group: "control",
            })
            .select()
            .single()

        if (error) {
            logger.error("Failed to create default feature flags", new Error(error.message), { 
                userId,
             })
            return null
        }

        return {
            user_id: data.user_id,
            flags: data.flags || defaultFlags,
            ab_test_group: data.ab_test_group || "control",
            updated_at: data.updated_at,
        }
    } catch (error) {
        logger.error("Error creating default feature flags", error instanceof Error ? error : new Error(String(error)), { 
            userId,
         })
        return null
    }
}

/**
 * Verifica se uma flag está habilitada para uma usuária
 */
export async function isFeatureEnabled(
    userId: string,
    flag: FeatureFlag
): Promise<boolean> {
    const flags = await getUserFeatureFlags(userId)
    return flags?.flags[flag] || false
}

/**
 * Atualiza feature flags de uma usuária
 */
export async function updateFeatureFlags(
    userId: string,
    flags: Partial<Record<FeatureFlag, boolean>>,
    abTestGroup?: ABTestGroup
): Promise<boolean> {
    try {
        const supabase = await createClient()

        // Obter flags atuais
        const currentFlags = await getUserFeatureFlags(userId)

        const updatedFlags = {
            ...currentFlags?.flags,
            ...flags,
        }

        const updateData: any = {
            flags: updatedFlags,
            updated_at: new Date().toISOString(),
        }

        if (abTestGroup) {
            updateData.ab_test_group = abTestGroup
        }

        const { error } = await supabase
            .from("user_feature_flags")
            .upsert({
                user_id: userId,
                ...updateData,
            })

        if (error) {
            logger.error("Failed to update feature flags", new Error(error.message), { 
                userId,
             })
            return false
        }

        logger.info("Feature flags updated", {
            userId,
            flags: updatedFlags,
            abTestGroup,
        })

        return true
    } catch (error) {
        logger.error("Error updating feature flags", error instanceof Error ? error : new Error(String(error)), { 
            userId,
         })
        return false
    }
}

/**
 * Atribui usuária a um grupo de A/B testing
 */
export async function assignToABTestGroup(
    userId: string,
    group: ABTestGroup
): Promise<boolean> {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from("user_feature_flags")
            .upsert({
                user_id: userId,
                ab_test_group: group,
                updated_at: new Date().toISOString(),
            })

        if (error) {
            logger.error("Failed to assign AB test group", new Error(error.message), { 
                userId,
                group,
             })
            return false
        }

        // Ativar flags baseadas no grupo
        const flagsByGroup: Record<ABTestGroup, Partial<Record<FeatureFlag, boolean>>> = {
            control: {},
            grok: { use_grok: true },
            gemini: { use_gemini_pro: true },
            smart: { smart_routing: true, use_grok: true, use_gemini_pro: true },
        }

        await updateFeatureFlags(userId, flagsByGroup[group], group)

        logger.info("AB test group assigned", {
            userId,
            group,
        })

        return true
    } catch (error) {
        logger.error("Error assigning AB test group", error instanceof Error ? error : new Error(String(error)), { 
            userId,
            group,
         })
        return false
    }
}

/**
 * Obtém distribuição de usuárias por grupo de A/B testing
 */
export async function getABTestDistribution(): Promise<
    Record<ABTestGroup, number>
> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("user_feature_flags")
            .select("ab_test_group")

        if (error) {
            logger.error("Failed to get AB test distribution", new Error(error.message), { 
             })
            return {
                control: 0,
                grok: 0,
                gemini: 0,
                smart: 0,
            }
        }

        const distribution: Record<ABTestGroup, number> = {
            control: 0,
            grok: 0,
            gemini: 0,
            smart: 0,
        }

        for (const row of data || []) {
            const group = (row.ab_test_group || "control") as ABTestGroup
            distribution[group] = (distribution[group] || 0) + 1
        }

        return distribution
    } catch (error) {
        logger.error("Error getting AB test distribution", error instanceof Error ? error : new Error(String(error)), { 
         })
        return {
            control: 0,
            grok: 0,
            gemini: 0,
            smart: 0,
        }
    }
}
