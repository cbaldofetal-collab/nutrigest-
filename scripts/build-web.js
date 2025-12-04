#!/usr/bin/env node

/**
 * Script de build customizado para web que contorna o problema do minimatch
 * no Expo export
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build customizado para web...');

try {
  // Criar diretório de output se não existir
  const outputDir = path.join(process.cwd(), 'web-build');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Usar expo export com flags específicas para web
  console.log('📦 Exportando para web...');
  
  // Tentar export direto
  execSync('npx expo export -p web --output-dir web-build', {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      EXPO_NO_DOTENV: '1',
    },
  });

  console.log('✅ Build concluído com sucesso!');
  process.exit(0);
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}

