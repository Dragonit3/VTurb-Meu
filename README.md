# 🎬 VTurb Player Inteligente - MVP

Player de vídeo embutível com foco em aumentar a taxa de visualização e conversão em páginas de vendas.

## 🚀 Funcionalidades do MVP

- ✅ Upload rápido de vídeos .mp4
- ✅ Script único embutível em qualquer HTML
- ✅ Barra de tempo inteligente (acelera no início, desacelera no final)
- ✅ Customização visual (cor, thumb, autoplay)
- ✅ Métricas de playrate e retenção
- ✅ Dashboard administrativo

## 📁 Estrutura do Projeto

```
/vturb-mvp
├── /api          → Backend API (Node.js + Express)
├── /player       → Player embutível (React)
├── /dashboard    → Painel administrativo (React)
├── /shared       → Tipos e utilitários compartilhados
└── /docs         → Documentação
```

## 🛠️ Instalação

```bash
# Instalar dependências principais
npm install

# Instalar dependências de cada módulo
cd api && npm install
cd ../player && npm install  
cd ../dashboard && npm install
```

## 🚀 Executar em Desenvolvimento

```bash
# Executar todos os serviços simultaneamente
npm run dev

# Ou executar individualmente:
npm run dev:api      # API na porta 3001
npm run dev:player   # Player na porta 3002
npm run dev:dashboard # Dashboard na porta 3000
```

## 📦 Build para Produção

```bash
npm run build
```

## 🎯 Como Usar

1. **Upload de Vídeo**: Acesse o dashboard em `http://localhost:3000`
2. **Gerar Script**: Após upload, copie o script gerado
3. **Embutir**: Cole o script em qualquer página HTML

```html
<!-- Exemplo de uso -->
<script src="https://mvp.vturb.ai/embed/abc123.js"></script>
```

## 🏗️ Princípios de Arquitetura

- **SRP**: Cada módulo tem uma responsabilidade única
- **SSOT**: Configurações centralizadas em uma única fonte
- **DRY**: Componentes e funções reutilizáveis
- **KISS**: Simplicidade na implementação
- **YAGNI**: Apenas funcionalidades essenciais no MVP

## 📊 Métricas Coletadas

- Taxa de play (impressões vs plays)
- Retenção por segundo
- Tempo médio assistido
- Eventos de clique (com `data-vturb-event="click"`)

## 🔧 Tecnologias

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Banco**: Supabase/PostgreSQL
- **Hospedagem**: Cloudflare Stream
- **CDN**: Cloudflare

## 📝 Próximas Etapas

- [ ] Testes A/B
- [ ] Analytics avançado
- [ ] Integração com mais CDNs
- [ ] API de webhooks 