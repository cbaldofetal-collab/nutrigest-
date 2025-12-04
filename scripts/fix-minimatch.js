#!/usr/bin/env node

/**
 * Script para corrigir o bug do minimatch no Expo CLI
 * Este script cria um patch que corrige o problema do minimatch.default
 */

const fs = require('fs');
const path = require('path');

const expoCliPath = path.join(process.cwd(), 'node_modules/@expo/cli/build/src/export/exportAssets.js');

if (fs.existsSync(expoCliPath)) {
  let content = fs.readFileSync(expoCliPath, 'utf8');
  
  // Substituir o uso problemático do minimatch
  content = content.replace(
    /\(0, _minimatch\)\.default/g,
    '_minimatch.default || _minimatch'
  );
  
  fs.writeFileSync(expoCliPath, content, 'utf8');
  console.log('✅ Patch aplicado ao Expo CLI');
} else {
  console.log('⚠️ Expo CLI não encontrado, patch não aplicado');
}

