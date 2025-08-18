import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração do caminho para o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as variáveis de ambiente do arquivo .env
const envPath = path.resolve(__dirname, '../../.env');
try {
  dotenv.config({ path: envPath });
  console.log(`Variáveis de ambiente carregadas de: ${envPath}`);
} catch (error) {
  console.warn('Não foi possível carregar o arquivo .env, usando variáveis de ambiente do sistema');
}

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
    apiKey: process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || '',
  },
  
  // Configurações de CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000', 'http://localhost:10000', 'https://portdev-2025.onrender.com'],
  },
  
  // Configurações de cache
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hora padrão
  },

  // Caminhos
  paths: {
    public: path.resolve(__dirname, '../../dist/public'),
    client: path.resolve(__dirname, '../../dist'),
  },
};

// Log das configurações carregadas (não mostra valores sensíveis)
console.log('Configurações carregadas:', {
  env: config.env,
  port: config.port,
  isProduction: config.isProduction,
  corsOrigins: config.cors.allowedOrigins,
  youtubeApiKey: config.youtube.apiKey ? '***' : 'Não configurado',
});

export default config;
