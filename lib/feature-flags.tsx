/**
 * Feature Flags System
 * 
 * Provides a centralized way to manage feature flags across the application.
 * Supports environment-based flags and runtime toggles.
 */

export type FeatureFlagKey = 
  | 'chatbot'
  | 'gamification'
  | 'notifications'
  | 'analytics'
  | 'community'
  | 'telemedicine'
  | 'premium_features'
  | 'ai_recipes'
  | 'mental_health_screening'
  | 'pregnancy_tracking'
  | 'appointment_booking';

export interface FeatureFlags {
  [key: string]: boolean;
}

/**
 * Default feature flags from environment variables
 */
const envFlags: FeatureFlags = {
  chatbot: process.env.NEXT_PUBLIC_ENABLE_CHATBOT === 'true',
  gamification: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION === 'true',
  notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  community: process.env.NEXT_PUBLIC_ENABLE_COMMUNITY === 'true',
  telemedicine: process.env.NEXT_PUBLIC_ENABLE_TELEMEDICINE === 'true',
  premium_features: process.env.NEXT_PUBLIC_ENABLE_PREMIUM === 'true',
  ai_recipes: process.env.NEXT_PUBLIC_ENABLE_AI_RECIPES === 'true',
  mental_health_screening: process.env.NEXT_PUBLIC_ENABLE_MENTAL_HEALTH === 'true',
  pregnancy_tracking: process.env.NEXT_PUBLIC_ENABLE_PREGNANCY_TRACKING === 'true',
  appointment_booking: process.env.NEXT_PUBLIC_ENABLE_APPOINTMENTS === 'true',
};

/**
 * Feature flags state
 * Can be updated at runtime for testing or gradual rollouts
 */
let runtimeFlags: FeatureFlags = { ...envFlags };

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlagKey): boolean {
  // Check runtime flags first, fallback to env flags
  return runtimeFlags[feature] ?? envFlags[feature] ?? false;
}

/**
 * Enable a feature at runtime
 * Useful for testing and development
 */
export function enableFeature(feature: FeatureFlagKey): void {
  if (process.env.NODE_ENV !== 'production') {
    runtimeFlags[feature] = true;
  } else {
    console.warn('Cannot modify feature flags in production');
  }
}

/**
 * Disable a feature at runtime
 * Useful for testing and development
 */
export function disableFeature(feature: FeatureFlagKey): void {
  if (process.env.NODE_ENV !== 'production') {
    runtimeFlags[feature] = false;
  } else {
    console.warn('Cannot modify feature flags in production');
  }
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): Readonly<FeatureFlags> {
  return { ...runtimeFlags };
}

/**
 * Reset runtime flags to environment defaults
 */
export function resetFeatureFlags(): void {
  if (process.env.NODE_ENV !== 'production') {
    runtimeFlags = { ...envFlags };
  }
}

/**
 * Feature flag hook for React components
 */
export function useFeatureFlag(feature: FeatureFlagKey): boolean {
  // In a real implementation, this could use a state management solution
  // to allow reactive updates to feature flags
  return isFeatureEnabled(feature);
}

/**
 * Conditional render based on feature flag
 */
export function withFeatureFlag<P extends object>(
  feature: FeatureFlagKey,
  Component: React.ComponentType<P>,
  Fallback?: React.ComponentType<P>
): React.ComponentType<P> {
  return function FeatureFlagWrapper(props: P) {
    if (isFeatureEnabled(feature)) {
      return <Component {...props} />;
    }
    
    if (Fallback) {
      return <Fallback {...props} />;
    }
    
    return null;
  };
}

/**
 * Feature flag metadata for documentation and UI
 */
export const featureFlagMetadata: Record<FeatureFlagKey, {
  name: string;
  description: string;
  category: 'core' | 'premium' | 'experimental';
}> = {
  chatbot: {
    name: 'AI Chatbot',
    description: 'Assistente virtual com IA para suporte 24/7',
    category: 'core',
  },
  gamification: {
    name: 'Gamificação',
    description: 'Sistema de pontos, níveis e conquistas',
    category: 'core',
  },
  notifications: {
    name: 'Notificações',
    description: 'Sistema de notificações em tempo real',
    category: 'core',
  },
  analytics: {
    name: 'Analytics',
    description: 'Rastreamento de eventos e analytics',
    category: 'core',
  },
  community: {
    name: 'Comunidade',
    description: 'Fórum e grupos de discussão',
    category: 'premium',
  },
  telemedicine: {
    name: 'Telemedicina',
    description: 'Consultas online com profissionais',
    category: 'premium',
  },
  premium_features: {
    name: 'Recursos Premium',
    description: 'Recursos exclusivos para assinantes',
    category: 'premium',
  },
  ai_recipes: {
    name: 'Receitas com IA',
    description: 'Sugestões de receitas personalizadas',
    category: 'experimental',
  },
  mental_health_screening: {
    name: 'Triagem de Saúde Mental',
    description: 'Avaliações de bem-estar emocional',
    category: 'core',
  },
  pregnancy_tracking: {
    name: 'Acompanhamento de Gestação',
    description: 'Rastreamento detalhado da gravidez',
    category: 'core',
  },
  appointment_booking: {
    name: 'Agendamento de Consultas',
    description: 'Sistema de marcação de consultas',
    category: 'core',
  },
};

/**
 * Development utilities
 */
export const devUtils = {
  /**
   * Enable all features (development only)
   */
  enableAll: () => {
    if (process.env.NODE_ENV !== 'production') {
      Object.keys(featureFlagMetadata).forEach((feature) => {
        enableFeature(feature as FeatureFlagKey);
      });
    }
  },

  /**
   * Disable all features (development only)
   */
  disableAll: () => {
    if (process.env.NODE_ENV !== 'production') {
      Object.keys(featureFlagMetadata).forEach((feature) => {
        disableFeature(feature as FeatureFlagKey);
      });
    }
  },

  /**
   * Log all feature flags
   */
  logFlags: () => {
    console.table(getAllFeatureFlags());
  },
};
