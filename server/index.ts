import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import config from "./config";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Configurações básicas do Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuração do CORS
app.use(cors({
  origin: config.cors.allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para log de requisições

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Configura o Vite em desenvolvimento e arquivos estáticos em produção
  if (config.isDevelopment) {
    await setupVite(app, server);
  } else {
    // Servir arquivos estáticos em produção
    app.use(serveStatic);
    
    // Rota de fallback para SPA (Single Page Application)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/public/index.html'));
    });
  }

  // Inicia o servidor
  const port = Number(config.port);
  server.listen({
    port,
    host: '0.0.0.0',
    reusePort: true,
  }, () => {
    log(`Server is running in ${config.env} mode on port ${port}`);
    log(`API available at http://localhost:${port}${config.api.prefix}`);
  });
})();
