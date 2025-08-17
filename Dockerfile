# Estágio de build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./
COPY client/package*.json ./client/

# Instala as dependências
RUN npm ci

# Copia o código-fonte
COPY . .

# Constrói a aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Expõe a porta da aplicação
EXPOSE 10000

# Define o comando de inicialização
CMD ["node", "dist/index.js"]
