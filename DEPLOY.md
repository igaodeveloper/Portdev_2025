# Guia de Deploy

Este guia explica como fazer o deploy da aplicação no Render e Vercel.

## Pré-requisitos

- Conta no [Render](https://render.com/)
- Conta no [Vercel](https://vercel.com/)
- Node.js 18+ instalado localmente
- Git instalado localmente

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# YouTube Data API v3 Key
# Obtenha em: https://console.cloud.google.com/apis/credentials
VITE_YOUTUBE_API_KEY=sua_chave_aqui

# Configurações do banco de dados (se aplicável)
DATABASE_URL=sua_url_de_conexao

# Outras variáveis necessárias
NODE_ENV=production
PORT=10000
```

## Deploy no Render

1. Faça login no [Render Dashboard](https://dashboard.render.com/)
2. Clique em "New" e selecione "Web Service"
3. Conecte seu repositório do GitHub
4. Selecione o repositório do projeto
5. Configure as opções:
   - **Name**: portdev
   - **Region**: Escolha a região mais próxima
   - **Branch**: main (ou a branch desejada)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Adicione as variáveis de ambiente na seção "Environment Variables"
7. Clique em "Create Web Service"

## Deploy no Vercel

1. Instale a CLI da Vercel globalmente:
   ```bash
   npm install -g vercel
   ```

2. Faça login na Vercel:
   ```bash
   vercel login
   ```

3. No diretório do projeto, execute:
   ```bash
   vercel
   ```
   
   Siga as instruções para configurar o projeto.

4. Para configurar as variáveis de ambiente:
   ```bash
   vercel env add
   ```
   
   Adicione cada variável do arquivo `.env` quando solicitado.

5. Para fazer o deploy de produção:
   ```bash
   vercel --prod
   ```

## Scripts Úteis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Constrói a aplicação para produção
- `npm start`: Inicia o servidor de produção

## Configuração do Domínio Personalizado (Opcional)

### No Render:
1. Vá para o dashboard do seu serviço
2. Clique em "Settings"
3. Na seção "Custom Domains", adicione seu domínio
4. Siga as instruções para configurar os registros DNS

### No Vercel:
1. Vá para o dashboard do seu projeto na Vercel
2. Clique em "Settings" > "Domains"
3. Adicione seu domínio
4. Siga as instruções para configurar os registros DNS

## Solução de Problemas

- **Erro de Build**: Verifique os logs de build para identificar problemas de compilação
- **Variáveis de Ambiente**: Certifique-se de que todas as variáveis necessárias estão configuradas corretamente
- **Portas**: O servidor está configurado para usar a porta 10000 por padrão. Certifique-se de que esta porta está liberada no seu ambiente de hospedagem
