/**
 * Script para gerar ícones SVG simples
 * Execute: node icon-generator.js
 */

const fs = require('fs');

// Função para criar SVG de ícone
function createIconSVG(size, text, bgColor, textColor) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
        fill="${textColor}" text-anchor="middle" dominant-baseline="central">
    ${text}
  </text>
</svg>`;
}

// Criar ícone principal
fs.writeFileSync('icon.svg', createIconSVG(1024, '💗', '#FFB6C1', '#FFFFFF'));
fs.writeFileSync('adaptive-icon.svg', createIconSVG(1024, '💗', '#FFB6C1', '#FFFFFF'));
fs.writeFileSync('favicon.svg', createIconSVG(48, '💗', '#FFB6C1', '#FFFFFF'));
fs.writeFileSync('splash.svg', createIconSVG(1242, '💗', '#FFF5F8', '#FF69B4'));

console.log('✅ Ícones SVG criados com sucesso!');
console.log('📝 Nota: Para produção, substitua por ícones profissionais em PNG.');
