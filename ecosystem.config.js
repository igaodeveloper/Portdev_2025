module.exports = {
  apps: [
    {
      name: 'portdev',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      env: {
        NODE_ENV: 'development',
        PORT: 10000,
        NODE_OPTIONS: '--max-old-space-size=1024',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 10000,
        NODE_OPTIONS: '--max-old-space-size=1024',
        // Configurações específicas de produção
        NODE_PATH: './',
        NODE_ENV: 'production',
        // Adicione outras variáveis de ambiente de produção aqui
      },
      // Logs
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // Configurações de reinicialização
      min_uptime: '10s',
      max_restarts: 10,
      // Configurações de timeout
      listen_timeout: 8000,
      kill_timeout: 1600,
      // Configurações de monitoramento
      wait_ready: true,
      // Configurações de segurança
      uid: 'www-data',
      gid: 'www-data',
    }
  ],
  // Configurações de deploy (opcional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-production-host',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/portdev-2025.git',
      path: '/var/www/portdev',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
