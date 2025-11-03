import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

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
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
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
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
