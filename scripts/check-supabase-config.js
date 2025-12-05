#!/usr/bin/env node

/**
 * Script para verificar se o Supabase está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do Supabase...\n');

const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('\n📝 Crie um arquivo .env na raiz do projeto com:');
  console.log('   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co');
  console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let hasUrl = false;
let hasKey = false;
let url = '';
let key = '';

lines.forEach((line) => {
  if (line.startsWith('EXPO_PUBLIC_SUPABASE_URL=')) {
    hasUrl = true;
    url = line.split('=')[1]?.trim() || '';
  }
  if (line.startsWith('EXPO_PUBLIC_SUPABASE_ANON_KEY=')) {
    hasKey = true;
    key = line.split('=')[1]?.trim() || '';
  }
});

console.log('📋 Status da Configuração:\n');

if (hasUrl) {
  if (url && url !== 'https://seu-projeto.supabase.co' && url.startsWith('https://')) {
    console.log('✅ EXPO_PUBLIC_SUPABASE_URL: Configurado');
    console.log(`   URL: ${url.substring(0, 30)}...`);
  } else {
    console.log('⚠️  EXPO_PUBLIC_SUPABASE_URL: Valor não configurado ou inválido');
  }
} else {
  console.log('❌ EXPO_PUBLIC_SUPABASE_URL: Não encontrado no .env');
}

if (hasKey) {
  if (key && key !== 'sua_chave_anon_aqui' && key.startsWith('eyJ')) {
    console.log('✅ EXPO_PUBLIC_SUPABASE_ANON_KEY: Configurado');
    console.log(`   Key: ${key.substring(0, 20)}...`);
  } else {
    console.log('⚠️  EXPO_PUBLIC_SUPABASE_ANON_KEY: Valor não configurado ou inválido');
  }
} else {
  console.log('❌ EXPO_PUBLIC_SUPABASE_ANON_KEY: Não encontrado no .env');
}

console.log('\n📚 Para configurar, siga o guia:');
console.log('   Veja GUIA_SUPABASE_PASSO_A_PASSO.md\n');

if (hasUrl && hasKey && url && key && url.startsWith('https://') && key.startsWith('eyJ')) {
  console.log('✅ Configuração parece estar correta!');
  console.log('   Reinicie o servidor Expo para aplicar as mudanças.\n');
  process.exit(0);
} else {
  console.log('⚠️  Configuração incompleta ou inválida.');
  console.log('   Verifique o arquivo .env e siga o guia.\n');
  process.exit(1);
}

