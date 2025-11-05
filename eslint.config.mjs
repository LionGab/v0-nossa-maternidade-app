import js from '@eslint/js';

const eslintConfig = [
  js.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts',
      '**/playwright-report/**',
      '**/test-results/**',
      // Expo/React Native files (não necessário para Next.js)
      'metro.config.js',
      'app.json',
      'eas.json',
      'babel.config.js',
      '**/ios/**',
      '**/android/**',
      '**/.expo/**',
    ],
  },
  {
    rules: {
      // Code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead
    },
  },
];

export default eslintConfig;

