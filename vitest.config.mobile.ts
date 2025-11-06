import { defineConfig } from "vitest/config"
import { resolve } from "path"

// Configuração Vitest adaptada para React Native/Expo
// Usa react-native-testing-library ao invés de @testing-library/react
export default defineConfig({
  test: {
    // Ambiente para React Native (usa jsdom mas com mocks nativos)
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.mobile.ts"],

    // Excluir diretórios desnecessários
    exclude: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/dist/**",
      "**/build/**",
      "**/ios/**",
      "**/android/**",
      "**/e2e/**", // Excluir testes E2E mobile (Detox/Maestro)
      "**/*.config.*",
      "**/*.setup.*",
      "**/__tests__/e2e/**",
    ],

    // Configuração de coverage
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".expo/",
        "dist/",
        "build/",
        "ios/",
        "android/",
        "e2e/",
        "**/*.config.*",
        "**/*.setup.*",
        "**/types.ts",
        "**/*.d.ts",
        "**/__mocks__/**",
      ],
    },

    // Timeout maior para testes mobile (podem ser mais lentos)
    testTimeout: 10000,
  },

  resolve: {
    // Aliases comuns em projetos Expo
    alias: {
      "@": resolve(__dirname, "./"),
      "@/components": resolve(__dirname, "./components"),
      "@/lib": resolve(__dirname, "./lib"),
      "@/hooks": resolve(__dirname, "./hooks"),
      "@/app": resolve(__dirname, "./app"),
    },

    // Extensões para React Native
    extensions: [".native.ts", ".native.tsx", ".ts", ".tsx", ".js", ".jsx"],
  },
})
