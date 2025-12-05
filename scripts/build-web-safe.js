#!/usr/bin/env node

/**
 * Script de build seguro para web que evita o problema do minimatch
 * Usa webpack diretamente em vez de expo export
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build seguro para web...');

try {
  // Garantir que o patch seja aplicado
  console.log('🔧 Aplicando patches...');
  try {
    execSync('npx patch-package', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
    });
    console.log('✅ Patches aplicados com sucesso');
  } catch (patchError) {
    console.warn('⚠️  Aviso: Não foi possível aplicar patches, continuando...');
    // Tentar aplicar o fix manualmente
    try {
      const fixScript = path.join(process.cwd(), 'scripts/fix-minimatch.js');
      if (fs.existsSync(fixScript)) {
        execSync(`node ${fixScript}`, {
          stdio: 'inherit',
          cwd: process.cwd(),
        });
        console.log('✅ Fix manual aplicado');
      }
    } catch (fixError) {
      console.warn('⚠️  Não foi possível aplicar fix manual');
    }
  }

  // Criar diretório de output se não existir
  const outputDir = path.join(process.cwd(), 'web-build');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Usar webpack diretamente (evita o problema do expo export)
  console.log('📦 Compilando com webpack...');
  
  execSync('npx webpack --mode production --config webpack.config.js', {
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

