import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Porta do servidor
  port: process.env.PORT || 10000,
  
  // Modo de execução
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Configurações da API
  api: {
    prefix: '/api',
  },
  
  // Configurações do YouTube
  youtube: {
    apiKey: process.env.VITE_YOUTUBE_API_KEY || '',
  },
  
  // Configurações de CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:10000'],
  },
  
  // Configurações de cache
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hora padrão
  },
};

export default config;
