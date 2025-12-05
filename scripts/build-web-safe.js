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
  // Garantir que o patch seja aplicado ANTES de tudo
  console.log('🔧 Aplicando correção do minimatch...');
  
  // Primeiro, tentar aplicar o fix manual (mais confiável)
  try {
    const fixScript = path.join(process.cwd(), 'scripts/fix-minimatch.js');
    if (fs.existsSync(fixScript)) {
      execSync(`node ${fixScript}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV || 'production',
        },
      });
      console.log('✅ Fix manual aplicado com sucesso');
    } else {
      console.warn('⚠️  Script fix-minimatch.js não encontrado');
    }
  } catch (fixError) {
    console.warn('⚠️  Erro ao aplicar fix manual:', fixError.message);
  }
  
  // Depois, tentar aplicar patches via patch-package
  try {
    execSync('npx patch-package', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
    });
    console.log('✅ Patches do patch-package aplicados');
  } catch (patchError) {
    console.warn('⚠️  Aviso: Não foi possível aplicar patch-package, mas fix manual já foi aplicado');
  }
  
  // Verificar se o patch foi aplicado
  const expoCliPath = path.join(process.cwd(), 'node_modules/@expo/cli/build/src/export/exportAssets.js');
  if (fs.existsSync(expoCliPath)) {
    const content = fs.readFileSync(expoCliPath, 'utf8');
    if (content.includes('minimatchFn') || !content.includes('(0, _minimatch).default')) {
      console.log('✅ Verificação: Patch aplicado corretamente');
    } else {
      console.warn('⚠️  Verificação: Patch pode não ter sido aplicado corretamente');
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

