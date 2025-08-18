import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import config from "./config";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para log de requisições
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${new Date().toISOString()} ${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
    
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 200) {
      logLine = logLine.slice(0, 199) + "…";
    }

    console.log(logLine);
  });

  next();
});

// Configurações básicas do Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuração do CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origem (como aplicativos móveis, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.includes('*') || 
        config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    const msg = `A política de CORS para esta origem (${origin}) não permite acesso.`;
    console.warn(msg);
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 horas de cache para preflight
}));

// Rota de saúde
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (_req, res) => {
  res.redirect('/index.html');
});

// Inicialização do servidor
(async () => {
  try {
    // Registrar rotas da API
    const server = await registerRoutes(app);

    // Configuração para ambiente de desenvolvimento
    if (config.isDevelopment) {
      console.log('Modo de desenvolvimento ativado');
      await setupVite(app, server);
    } else {
      // Configuração para produção
      console.log('Modo de produção ativado');
      
      // Servir arquivos estáticos do frontend
      const publicPath = config.paths.public;
      
      // Verifica se o diretório de build existe
      if (!fs.existsSync(publicPath)) {
        console.error(`Diretório de build não encontrado em: ${publicPath}`);
        console.log('Certifique-se de que o frontend foi construído corretamente.');
      } else {
        console.log(`Servindo arquivos estáticos de: ${publicPath}`);
        app.use(express.static(publicPath, { maxAge: '1y' }));
        
        // Rota de fallback para SPA (Single Page Application)
        app.get('*', (_req, res) => {
          const indexPath = path.join(publicPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            res.status(404).send('Arquivo não encontrado');
          }
        });
      }
    }

    // Middleware de tratamento de erros
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Erro não tratado:', err);
      const status = err.status || err.statusCode || 500;
      const message = status === 500 ? 'Erro interno do servidor' : (err.message || 'Erro desconhecido');
      
      res.status(status).json({
        success: false,
        error: message,
        ...(config.isDevelopment && { stack: err.stack })
      });
    });

    // Inicia o servidor
    const port = Number(config.port);
    server.listen({
      port,
      host: '0.0.0.0',
      reusePort: true,
    }, () => {
      console.log(`\n🚀 Servidor rodando em modo ${config.env} na porta ${port}`);
      console.log(`🔗 Acesse: http://localhost:${port}`);
      console.log(`🌐 API disponível em: http://localhost:${port}${config.api.prefix}`);
      console.log(`🔄 CORS permitido para origens:`, config.cors.allowedOrigins);
    });

    // Tratamento de erros não capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Exceção não capturada:', error);
      process.exit(1); // Encerra o processo em caso de erro crítico
    });

  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
})();
