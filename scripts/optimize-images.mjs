#!/usr/bin/env node
/**
 * Script de Otimização de Imagens
 * Converte imagens PNG/JPG para WebP/AVIF mantendo originais como fallback
 */

import { readdir, stat } from "fs/promises"
import { join, extname, basename } from "path"
import { existsSync } from "fs"

// Configurações
const PUBLIC_DIR = "./public"
const ICON_DIR = "./public/icons"
const TARGET_SIZES = {
  "icon-72x72": { maxSize: 10000 }, // 10KB
  "icon-96x96": { maxSize: 15000 }, // 15KB
  "icon-128x128": { maxSize: 20000 }, // 20KB
  "icon-144x144": { maxSize: 20000 }, // 20KB
  "icon-152x152": { maxSize: 25000 }, // 25KB
  "icon-192x192": { maxSize: 35000 }, // 35KB
  "icon-384x384": { maxSize: 70000 }, // 70KB
  "icon-512x512": { maxSize: 100000 }, // 100KB
}

// Verificar se sharp-cli está disponível
async function checkSharpCLI() {
  try {
    const { execSync } = await import("child_process")
    execSync("sharp --version", { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

// Obter tamanho do arquivo em bytes
async function getFileSize(filePath) {
  const stats = await stat(filePath)
  return stats.size
}

// Listar todos os arquivos de imagem
async function listImageFiles(dir) {
  const files = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await listImageFiles(fullPath)))
      } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
        files.push(fullPath)
      }
    }
  } catch (err) {
    console.error(`Erro ao ler diretório ${dir}:`, err.message)
  }
  return files
}

// Otimizar imagem usando sharp-cli
async function optimizeImage(inputPath, outputPath, targetSize) {
  try {
    const { execSync } = await import("child_process")
    const quality = targetSize ? Math.min(90, Math.max(60, (targetSize / 1000) * 5)) : 85

    // Comando sharp-cli para converter PNG para WebP
    const command = `sharp -i "${inputPath}" -o "${outputPath}" --format webp --quality ${quality}`

    execSync(command, { stdio: "inherit" })
    return true
  } catch (err) {
    console.error(`Erro ao otimizar ${inputPath}:`, err.message)
    return false
  }
}

// Gerar relatório
function generateReport(results) {
  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0)
  const totalOptimizedSize = results.reduce((sum, r) => sum + (r.optimizedSize || 0), 0)
  const savings = totalOriginalSize - totalOptimizedSize
  const savingsPercent = ((savings / totalOriginalSize) * 100).toFixed(2)

  return {
    totalFiles: results.length,
    totalOriginalSize,
    totalOptimizedSize,
    savings,
    savingsPercent,
    results,
  }
}

// Main
async function main() {
  console.log("🖼️  Iniciando otimização de imagens...\n")

  // Verificar se sharp-cli está instalado
  const hasSharpCLI = await checkSharpCLI()
  if (!hasSharpCLI) {
    console.log("⚠️  sharp-cli não está instalado.")
    console.log("   Instale com: npm install -g sharp-cli")
    console.log("   Ou: npx sharp-cli --help\n")
    console.log("📋 Listando imagens para auditoria...\n")

    // Apenas listar imagens se sharp-cli não estiver instalado
    const allImages = await listImageFiles(PUBLIC_DIR)
    const iconImages = allImages.filter(f => f.includes("icons"))

    console.log(`Total de imagens encontradas: ${allImages.length}`)
    console.log(`Ícones PWA: ${iconImages.length}\n`)

    for (const img of iconImages) {
      const size = await getFileSize(img)
      const sizeKB = (size / 1024).toFixed(2)
      console.log(`  ${basename(img)}: ${sizeKB} KB`)
    }

    console.log("\n💡 Execute 'npm install -g sharp-cli' para otimizar as imagens.")
    return
  }

  // Listar todas as imagens
  const allImages = await listImageFiles(PUBLIC_DIR)
  const iconImages = allImages.filter(f => f.includes("icons"))

  console.log(`📊 Encontradas ${allImages.length} imagens`)
  console.log(`   - ${iconImages.length} ícones PWA\n`)

  const results = []

  // Otimizar ícones PWA
  for (const imgPath of iconImages) {
    const fileName = basename(imgPath, extname(imgPath))
    const webpPath = imgPath.replace(/\.(png|jpg|jpeg)$/i, ".webp")
    const targetConfig = TARGET_SIZES[fileName]

    const originalSize = await getFileSize(imgPath)
    const originalSizeKB = (originalSize / 1024).toFixed(2)

    console.log(`🔄 Otimizando ${basename(imgPath)} (${originalSizeKB} KB)...`)

    if (targetConfig && originalSize > targetConfig.maxSize) {
      const success = await optimizeImage(imgPath, webpPath, targetConfig.maxSize)

      if (success) {
        const optimizedSize = await getFileSize(webpPath)
        const optimizedSizeKB = (optimizedSize / 1024).toFixed(2)
        const savings = originalSize - optimizedSize
        const savingsPercent = ((savings / originalSize) * 100).toFixed(1)

        console.log(`   ✅ WebP criado: ${optimizedSizeKB} KB (${savingsPercent}% menor)\n`)

        results.push({
          file: basename(imgPath),
          originalSize,
          optimizedSize,
          savings,
          savingsPercent,
          format: "WebP",
        })
      } else {
        console.log(`   ❌ Falha na otimização\n`)
        results.push({
          file: basename(imgPath),
          originalSize,
          optimizedSize: null,
          savings: 0,
          savingsPercent: 0,
          format: null,
        })
      }
    } else {
      console.log(`   ⏭️  Já está no tamanho alvo, pulando...\n`)
    }
  }

  // Gerar relatório
  const report = generateReport(results)

  console.log("\n" + "=".repeat(50))
  console.log("📊 RELATÓRIO DE OTIMIZAÇÃO")
  console.log("=".repeat(50))
  console.log(`Total de arquivos: ${report.totalFiles}`)
  console.log(`Tamanho original: ${(report.totalOriginalSize / 1024).toFixed(2)} KB`)
  console.log(`Tamanho otimizado: ${(report.totalOptimizedSize / 1024).toFixed(2)} KB`)
  console.log(`Economia: ${(report.savings / 1024).toFixed(2)} KB (${report.savingsPercent}%)`)
  console.log("=".repeat(50) + "\n")

  // Salvar relatório em arquivo
  const reportPath = "./IMAGE_OPTIMIZATION_REPORT.md"
  const fs = await import("fs/promises")
  await fs.writeFile(
    reportPath,
    `# 📊 Relatório de Otimização de Imagens\n\n` +
      `**Data:** ${new Date().toISOString()}\n\n` +
      `## Estatísticas\n\n` +
      `- Total de arquivos: ${report.totalFiles}\n` +
      `- Tamanho original: ${(report.totalOriginalSize / 1024).toFixed(2)} KB\n` +
      `- Tamanho otimizado: ${(report.totalOptimizedSize / 1024).toFixed(2)} KB\n` +
      `- Economia: ${(report.savings / 1024).toFixed(2)} KB (${report.savingsPercent}%)\n\n` +
      `## Arquivos Otimizados\n\n` +
      report.results
        .map(
          (r) =>
            `### ${r.file}\n` +
            `- Original: ${(r.originalSize / 1024).toFixed(2)} KB\n` +
            (r.optimizedSize
              ? `- Otimizado: ${(r.optimizedSize / 1024).toFixed(2)} KB (${r.savingsPercent}% menor)\n` +
                `- Formato: ${r.format}\n`
              : `- Status: Falha na otimização\n`)
        )
        .join("\n")
  )

  console.log(`✅ Relatório salvo em: ${reportPath}\n`)
}

// Executar
main().catch(console.error)
