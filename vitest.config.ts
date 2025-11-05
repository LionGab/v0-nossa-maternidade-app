import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Excluir diretórios duplicados e arquivos E2E
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/v0-nossa-maternidade-app/**", // Excluir diretório duplicado
      "**/e2e/**", // Excluir testes E2E do Playwright
      "**/*.config.*",
      "**/*.setup.*",
      // Expo/React Native files
      "metro.config.js",
      "app.json",
      "eas.json",
      "**/ios/**",
      "**/android/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        ".next/",
        "out/",
        "v0-nossa-maternidade-app/", // Excluir diretório duplicado
        "e2e/", // Excluir testes E2E
        "**/*.config.*",
        "**/*.setup.*",
        "**/types.ts",
      ],
      // Threshold mínimo de cobertura (pode ser aumentado gradualmente)
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
