#!/usr/bin/env node
/**
 * Script para otimizar todas as imagens do projeto
 * Usa sharp para redimensionar e comprimir ícones PWA e outras imagens
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const ICONS_DIR = 'public/icons'
const PUBLIC_DIR = 'public'

// Configuração de qualidade para diferentes tipos
const QUALITY_SETTINGS = {
  icon: { quality: 90, compressionLevel: 9 },
  image: { quality: 85, compressionLevel: 9 }
}

async function optimizeIcon(filePath, size) {
  console.log(`📐 Otimizando ${filePath} para ${size}x${size}px...`)

  try {
    const image = sharp(filePath)
    const metadata = await image.metadata()

    await image
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png(QUALITY_SETTINGS.icon)
      .toFile(filePath + '.tmp')

    // Renomear arquivo temporário
    await import('fs/promises').then(fs => fs.rename(filePath + '.tmp', filePath))

    const newStat = await stat(filePath)
    console.log(`  ✅ Reduzido para ${Math.round(newStat.size / 1024)}KB`)

    return true
  } catch (error) {
    console.error(`  ❌ Erro ao otimizar ${filePath}:`, error.message)
    return false
  }
}

async function optimizeImage(filePath, maxWidth = 1200) {
  console.log(`🖼️  Otimizando ${filePath}...`)

  try {
    const image = sharp(filePath)
    const metadata = await image.metadata()

    const pipeline = image.resize(
      metadata.width > maxWidth ? maxWidth : metadata.width,
      null,
      { fit: 'inside', withoutEnlargement: true }
    )

    if (metadata.format === 'png') {
      await pipeline.png(QUALITY_SETTINGS.image).toFile(filePath + '.tmp')
    } else if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await pipeline.jpeg(QUALITY_SETTINGS.image).toFile(filePath + '.tmp')
    } else {
      console.log(`  ⚠️  Formato ${metadata.format} não suportado, pulando...`)
      return false
    }

    const oldStat = await stat(filePath)
    const newStat = await stat(filePath + '.tmp')

    // Só substituir se o novo arquivo for menor
    if (newStat.size < oldStat.size) {
      await import('fs/promises').then(fs => fs.rename(filePath + '.tmp', filePath))
      const saved = Math.round((oldStat.size - newStat.size) / 1024)
      console.log(`  ✅ Reduzido de ${Math.round(oldStat.size / 1024)}KB para ${Math.round(newStat.size / 1024)}KB (economizou ${saved}KB)`)
    } else {
      await import('fs/promises').then(fs => fs.unlink(filePath + '.tmp'))
      console.log(`  ℹ️  Arquivo já está otimizado`)
    }

    return true
  } catch (error) {
    console.error(`  ❌ Erro ao otimizar ${filePath}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando otimização de imagens...\n')

  // Otimizar ícones PWA
  console.log('📱 Otimizando ícones PWA...')
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

  for (const size of iconSizes) {
    const iconPath = join(ICONS_DIR, `icon-${size}x${size}.png`)
    await optimizeIcon(iconPath, size)
  }

  console.log('\n🖼️  Otimizando outras imagens...')

  // Otimizar logo e apple-touch-icon (180x180 ideal)
  await optimizeIcon(join(PUBLIC_DIR, 'logo.png'), 180)
  await optimizeIcon(join(PUBLIC_DIR, 'apple-touch-icon.png'), 180)

  // Otimizar imagens grandes
  await optimizeImage(join(PUBLIC_DIR, 'postpartum-fitness.png'), 1200)

  console.log('\n✨ Otimização concluída!')
}

main().catch(console.error)
