#!/usr/bin/env node

/**
 * Script helper para gerar assets básicos do NutriGest
 * 
 * Este script cria assets placeholder que podem ser usados temporariamente
 * enquanto os assets finais são criados por um designer.
 * 
 * Uso: node scripts/generate-assets.js
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

// Criar pasta assets se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Especificações dos assets
const assets = [
  {
    name: 'icon.png',
    size: '1024x1024px',
    description: 'Ícone principal do app',
    placeholder: 'Criar design com: Fundo verde claro (#E8F5E9), ícone central de gestante/folha/nutrição'
  },
  {
    name: 'splash.png',
    size: '1242x2436px (iPhone) ou 1920x1080px (Android)',
    description: 'Tela de carregamento inicial',
    placeholder: 'Criar design com: Fundo verde claro (#E8F5E9), logo centralizado'
  },
  {
    name: 'adaptive-icon.png',
    size: '1024x1024px',
    description: 'Ícone adaptativo Android',
    placeholder: 'Mesmo design do icon.png, área segura: 66% central'
  },
  {
    name: 'favicon.png',
    size: '48x48px',
    description: 'Favicon para web',
    placeholder: 'Versão simplificada do ícone principal'
  }
];

console.log('📦 Gerador de Assets - NutriGest\n');
console.log('Este script lista os assets necessários.\n');
console.log('Para criar os assets, você pode:\n');
console.log('1. Usar um gerador online: https://www.appicon.co/');
console.log('2. Usar Figma/Canva para criar os designs');
console.log('3. Contratar um designer\n');
console.log('📋 Assets Necessários:\n');

assets.forEach((asset, index) => {
  console.log(`${index + 1}. ${asset.name}`);
  console.log(`   Tamanho: ${asset.size}`);
  console.log(`   Descrição: ${asset.description}`);
  console.log(`   Sugestão: ${asset.placeholder}\n`);
});

console.log('✅ Checklist:');
assets.forEach((asset, index) => {
  const filePath = path.join(assetsDir, asset.name);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${asset.name}`);
});

console.log('\n💡 Dica: Use https://www.appicon.co/ para gerar todos os tamanhos a partir de um único design!');
console.log('\n📖 Veja o guia completo em: assets/ASSETS_GUIDE.md\n');

