#!/usr/bin/env node

/**
 * Build customizado usando webpack diretamente, contornando o bug do Expo export
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando build com webpack...');

const webpackConfig = path.join(process.cwd(), 'webpack.config.js');
const webConfig = path.join(process.cwd(), 'web.config.js');

// Verificar se existe webpack.config.js, se não, criar um básico
if (!fs.existsSync(webpackConfig) && fs.existsSync(webConfig)) {
  console.log('📝 Usando web.config.js existente...');
}

try {
  // Usar webpack diretamente via @expo/webpack-config
  console.log('📦 Compilando com webpack...');
  
  execSync('npx webpack --mode production --config web.config.js', {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  console.log('✅ Build concluído com sucesso!');
  process.exit(0);
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}

