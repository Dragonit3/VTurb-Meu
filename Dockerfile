# Multi-stage build para VTurb Player MVP
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json files
COPY package*.json ./
COPY api/package*.json ./api/
COPY player/package*.json ./player/
COPY dashboard/package*.json ./dashboard/
COPY shared/package*.json ./shared/

# Instalar dependências
RUN npm install
RUN cd api && npm install
RUN cd ../player && npm install
RUN cd ../dashboard && npm install
RUN cd ../shared && npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build:api
RUN npm run build:player
RUN npm run build:dashboard

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

# Copiar apenas arquivos necessários para produção
COPY package*.json ./
COPY api/package*.json ./api/

# Instalar apenas dependências de produção
RUN npm ci --only=production
RUN cd api && npm ci --only=production

# Copiar arquivos compilados
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/player/dist ./player/dist
COPY --from=builder /app/dashboard/dist ./dashboard/dist

# Copiar arquivos de configuração
COPY --from=builder /app/.env* ./

# Expor porta
EXPOSE 80

# Comando de inicialização
CMD ["npm", "run", "start"] 