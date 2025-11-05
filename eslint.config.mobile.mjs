// ESLint config adaptado para React Native/Expo
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // Base React Native e Expo configs
  ...compat.extends('expo', 'plugin:react-native/all'),

  {
    rules: {
      // Regras específicas para React Native
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'off', // Permitir inline styles (comum em RN)
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'off', // Pode ser muito restritivo

      // Regras TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Console rules (permitir console.log em desenvolvimento mobile)
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],

      // React rules adaptadas para RN
      'react/react-in-jsx-scope': 'off', // Não necessário em RN
      'react/prop-types': 'off', // Usamos TypeScript

      // Regras de importação
      'import/no-unresolved': 'off', // Expo resolve imports automaticamente
    },
  },

  {
    settings: {
      'react-native/style-sheet-object-names': ['StyleSheet', 'styles'],
    },
  },
];

export default eslintConfig;
