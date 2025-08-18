#!/usr/bin/env bash
# render-build.sh
# Script de build para o Render

# Configuração
set -e  # Encerra o script em caso de erro

# Função para log
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Instalação de dependências
log "📦 Instalando dependências..."
npm ci --prefer-offline --no-audit

# Construção do frontend
log "🔨 Construindo frontend..."
cd client
log "📂 Diretório atual: $(pwd)"

# Instalar dependências do cliente
log "📦 Instalando dependências do cliente..."
npm ci --prefer-offline --no-audit

# Construir frontend
log "🏗️  Executando build do frontend..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "../dist/public" ]; then
  log "❌ ERRO: Build do frontend falhou - diretório dist/public não encontrado!"
  exit 1
fi

log "✅ Frontend construído com sucesso em ../dist/public"
cd ..

# Construção do servidor
log "🔨 Construindo servidor..."
npm run build

# Verificação de arquivos de build
if [ ! -d "dist" ]; then
  log "❌ ERRO: Diretório de build do servidor não encontrado!"
  exit 1
fi

# Verificar se o arquivo index.html foi gerado
if [ ! -f "dist/public/index.html" ]; then
  log "❌ ERRO: Arquivo index.html não encontrado em dist/public/"
  log "ℹ️  Conteúdo do diretório dist/public/:"
  ls -la dist/public/ || true
  exit 1
fi

# Instalação de dependências de produção
log "🔍 Instalando apenas dependências de produção..."
npm prune --production

log "✅ Build concluído com sucesso!"
log "📂 Estrutura de diretórios:"
find dist -type f | sort
