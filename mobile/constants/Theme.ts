/**
 * Constantes do Tema
 * Cores, tamanhos e estilos padronizados
 */

export const Colors = {
  primary: '#FF69B4',
  primaryLight: '#FFB6C1',
  primaryDark: '#FF1493',
  
  secondary: '#87CEEB',
  accent: '#FFD700',
  
  background: '#FFF5F8',
  surface: '#FFFFFF',
  
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  
  border: '#EEEEEE',
  
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
};
