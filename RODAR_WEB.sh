#!/bin/bash

# Script para rodar o NutriGest na web

echo "🚀 Iniciando NutriGest na Web..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

echo "🌐 Iniciando servidor web..."
echo "O app vai abrir automaticamente no navegador!"
echo ""
echo "Para parar, pressione Ctrl+C"
echo ""

npm run web

