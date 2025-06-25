# 🏗️ Arquitetura do VTurb Player

## Visão Geral

O VTurb Player é um sistema modular seguindo os princípios SOLID e Clean Architecture, composto por três módulos principais:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Dashboard    │    │      API        │    │     Player      │
│   (React)       │◄──►│   (Node.js)     │◄──►│    (React)      │
│   Porta 3000    │    │   Porta 3001    │    │   Porta 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │  Cloudflare     │    │   Páginas       │
│   (PostgreSQL)  │    │   Stream        │    │   HTML          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Módulos

### 1. API Backend (`/api`)

**Responsabilidades:**
- Upload e gerenciamento de vídeos
- Geração de scripts embedáveis
- Coleta e processamento de métricas
- Configurações de vídeo

**Tecnologias:**
- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)
- Multer (upload de arquivos)

**Princípios Aplicados:**
- **SRP**: Cada rota tem uma responsabilidade específica
- **SSOT**: Configurações centralizadas no banco
- **DRY**: Middleware reutilizável
- **KISS**: APIs REST simples

### 2. Player Embutível (`/player`)

**Responsabilidades:**
- Reprodução de vídeo
- Interface do usuário
- Coleta de eventos
- Barra de progresso inteligente

**Tecnologias:**
- React + TypeScript
- Vite (build)
- CSS-in-JS

**Princípios Aplicados:**
- **SRP**: Componentes com responsabilidades únicas
- **DRY**: Componentes reutilizáveis (ProgressBar, PlayButton)
- **KISS**: Interface minimalista
- **Open/Closed**: Extensível via props

### 3. Dashboard (`/dashboard`)

**Responsabilidades:**
- Upload de vídeos
- Visualização de métricas
- Gerenciamento de configurações
- Geração de scripts

**Tecnologias:**
- React + TypeScript
- React Router
- Recharts (gráficos)

## Fluxo de Dados

### 1. Upload de Vídeo
```
Dashboard → API → Cloudflare Stream → Supabase
```

### 2. Reprodução
```
Página HTML → Script Embed → Player → API (métricas)
```

### 3. Analytics
```
Player → API → Supabase → Dashboard
```

## Estrutura de Dados

### Vídeos
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  thumb_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  autoplay BOOLEAN DEFAULT false,
  muted BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Eventos
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  type VARCHAR(50) NOT NULL,
  timestamp BIGINT NOT NULL,
  data JSONB,
  utm_source VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_medium VARCHAR(100)
);
```

## Segurança

### CORS
- Configuração restritiva por origem
- Credenciais habilitadas apenas para domínios confiáveis

### Upload
- Validação de tipo de arquivo (apenas vídeo)
- Limite de tamanho (2GB)
- Sanitização de nomes de arquivo

### API
- Rate limiting (futuro)
- Autenticação JWT (futuro)
- Validação de entrada

## Performance

### CDN
- Cloudflare Stream para vídeos
- Cache de scripts embedáveis
- Compressão automática

### Otimizações
- Lazy loading do player
- Compressão de assets
- Minificação de código
- Cache de configurações

## Escalabilidade

### Horizontal
- API stateless
- Banco de dados distribuído
- CDN global

### Vertical
- Processamento assíncrono
- Queue para uploads grandes
- Cache em memória

## Monitoramento

### Métricas
- Taxa de play
- Retenção por segundo
- Tempo médio assistido
- Eventos de clique

### Logs
- Erros de carregamento
- Falhas de upload
- Performance de API

## Próximas Etapas

### Fase 2: Analytics Avançado
- Retenção por segundo
- Filtros UTM
- Exportação CSV
- Webhooks

### Fase 3: Testes A/B
- Divisão de tráfego
- Comparativo de versões
- Gatilhos automáticos

### Fase 4: Recursos Avançados
- Múltiplos formatos
- Subtítulos
- Qualidade adaptativa
- Integração com GA4 