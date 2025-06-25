# 🚀 Guia de Instalação - VTurb Player MVP

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Bunny Stream (para hospedagem de vídeos)

## 🛠️ Instalação Local (Desenvolvimento)

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd vturb-player-mvp
```

### 2. Instale todas as dependências
```bash
npm run install:all
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Para desenvolvimento local
PORT=3001
HOST=localhost
NODE_ENV=development

API_URL=http://localhost:3001
PLAYER_URL=http://localhost:3002
DASHBOARD_URL=http://localhost:3000

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,http://localhost:3001

# Suas credenciais do Bunny Stream
BUNNY_STREAM_API_KEY=sua_api_key
BUNNY_STREAM_LIBRARY_ID=seu_library_id
BUNNY_CDN_HOSTNAME=seu_hostname.b-cdn.net
```

### 4. Execute em modo desenvolvimento
```bash
npm run dev
```

Isso iniciará:
- API: http://localhost:3001
- Player: http://localhost:3002  
- Dashboard: http://localhost:3000

## 🌐 Instalação em VPS (Produção)

### 1. Configuração do servidor
Certifique-se de que sua VPS tem:
- Node.js 18+
- PM2 (gerenciador de processos)
- Nginx (proxy reverso)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Instalar Nginx (Ubuntu/Debian)
sudo apt update
sudo apt install nginx
```

### 2. Configure as variáveis de ambiente para produção
```bash
cp env.example .env
```

Edite o `.env` com as configurações da sua VPS:
```env
# Configurações da VPS
PORT=80
HOST=0.0.0.0
NODE_ENV=production

# Substitua SEU_DOMINIO.COM pelo seu domínio ou IP
API_URL=http://SEU_DOMINIO.COM/api
PLAYER_URL=http://SEU_DOMINIO.COM/player
DASHBOARD_URL=http://SEU_DOMINIO.COM/dashboard

# CORS - adicione seu domínio
ALLOWED_ORIGINS=http://SEU_DOMINIO.COM,https://SEU_DOMINIO.COM

# Suas credenciais do Bunny Stream
BUNNY_STREAM_API_KEY=sua_api_key
BUNNY_STREAM_LIBRARY_ID=seu_library_id
BUNNY_CDN_HOSTNAME=seu_hostname.b-cdn.net
```

### 3. Build e deploy
```bash
# Instalar dependências
npm run install:all

# Build de produção
npm run build

# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configuração do Nginx
Crie o arquivo `/etc/nginx/sites-available/vturb`:

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.COM;

    # API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Embed scripts
    location /embed/ {
        proxy_pass http://localhost:3001/embed/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Headers CORS para embed
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }

    # Dashboard (arquivos estáticos)
    location /dashboard/ {
        alias /caminho/para/vturb-player-mvp/dashboard/dist/;
        try_files $uri $uri/ /dashboard/index.html;
    }

    # Player (arquivos estáticos)
    location /player/ {
        alias /caminho/para/vturb-player-mvp/player/dist/;
        try_files $uri $uri/ /player/index.html;
        
        # Headers CORS para player
        add_header Access-Control-Allow-Origin *;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
    }
}
```

Ativar o site:
```bash
sudo ln -s /etc/nginx/sites-available/vturb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 📊 Verificação da Instalação

### 1. Teste os endpoints:
- Health check: `http://SEU_DOMINIO.COM/health`
- Dashboard: `http://SEU_DOMINIO.COM/dashboard`
- Player: `http://SEU_DOMINIO.COM/player`

### 2. Teste o embed:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Teste VTurb Player</title>
</head>
<body>
    <div id="vturb-player-container"></div>
    <script src="http://SEU_DOMINIO.COM/embed/script/VIDEO_ID"></script>
</body>
</html>
```

## 🔧 Comandos Úteis

```bash
# Ver logs da aplicação
pm2 logs

# Reiniciar aplicação
pm2 restart all

# Parar aplicação
pm2 stop all

# Ver status
pm2 status

# Monitorar recursos
pm2 monit
```

## 🚨 Solução de Problemas

### Erro "EADDRINUSE: address already in use"
```bash
# Verificar o que está usando a porta 80
sudo lsof -i :80
sudo kill -9 PID_DO_PROCESSO
```

### Erro de CORS
Verifique se as URLs no `.env` estão corretas e se o Nginx está configurado com os headers CORS.

### Vídeos não carregam
Verifique se as credenciais do Bunny Stream estão corretas no `.env`.

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do PM2: `pm2 logs`
2. Logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Health check: `curl http://localhost:3001/health` 