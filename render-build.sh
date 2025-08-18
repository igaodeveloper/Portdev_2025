#!/usr/bin/env bash
# render-build.sh
# Script de build para o Render

echo "Instalando dependências..."
npm ci --only=production

echo "Construindo aplicação..."
npm run build

echo "Build concluído com sucesso!"
