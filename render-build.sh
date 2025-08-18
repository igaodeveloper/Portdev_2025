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
log "Instalando dependências..."
npm ci --prefer-offline --no-audit

# Construção do frontend
log "Construindo frontend..."
cd client
npm ci --prefer-offline --no-audit
npm run build
cd ..

# Construção do servidor
log "Construindo servidor..."
npm run build

# Verificação de arquivos de build
if [ ! -d "dist" ]; then
  log "ERRO: Diretório de build não encontrado!"
  exit 1
fi

# Instalação de dependências de produção
log "Instalando apenas dependências de produção..."
npm prune --production

log "✅ Build concluído com sucesso!"
