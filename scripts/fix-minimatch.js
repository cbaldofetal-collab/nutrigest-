#!/usr/bin/env node

/**
 * Script para corrigir o bug do minimatch no Expo CLI
 * Este script corrige o problema do minimatch.default diretamente no arquivo
 */

const fs = require('fs');
const path = require('path');

const expoCliPath = path.join(process.cwd(), 'node_modules/@expo/cli/build/src/export/exportAssets.js');

if (fs.existsSync(expoCliPath)) {
  let content = fs.readFileSync(expoCliPath, 'utf8');
  
  // Verificar se já foi corrigido
  if (content.includes('const minimatchFn = _minimatch')) {
    console.log('✅ Patch já aplicado ao Expo CLI');
    return;
  }
  
  // Substituir o uso problemático do minimatch com uma correção mais robusta
  const oldPattern = /\(0, _minimatch\)\.default\(file, pattern\)/g;
  const newCode = `(() => {
        const minimatchFn = _minimatch && typeof _minimatch === 'function' 
          ? _minimatch 
          : (_minimatch.default || _minimatch);
        return minimatchFn(file, pattern);
      })()`;
  
  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newCode);
    fs.writeFileSync(expoCliPath, content, 'utf8');
    console.log('✅ Patch aplicado ao Expo CLI com sucesso');
  } else {
    // Tentar padrão alternativo
    const altPattern = /\(0,\s*_minimatch\)\.default\(file,\s*pattern\)/g;
    if (altPattern.test(content)) {
      content = content.replace(altPattern, newCode);
      fs.writeFileSync(expoCliPath, content, 'utf8');
      console.log('✅ Patch aplicado ao Expo CLI (padrão alternativo)');
    } else {
      console.log('⚠️  Padrão não encontrado, tentando substituição mais ampla...');
      // Substituição mais ampla
      content = content.replace(
        /\(0,\s*_minimatch\)\.default/g,
        '(() => { const m = _minimatch && typeof _minimatch === \'function\' ? _minimatch : (_minimatch.default || _minimatch); return m; })()'
      );
      fs.writeFileSync(expoCliPath, content, 'utf8');
      console.log('✅ Patch aplicado ao Expo CLI (substituição ampla)');
    }
  }
} else {
  console.log('⚠️ Expo CLI não encontrado em:', expoCliPath);
  console.log('⚠️ Patch não aplicado - isso pode causar erros no build');
}

