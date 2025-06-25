import { Router } from 'express';
import { VideoConfig } from '../types';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env da pasta raiz do projeto (três níveis acima)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const router = Router();

// Middleware para garantir CORS em todos os endpoints de embed
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// GET /embed/:id.js - Gerar script embedável
router.get('/:id.js', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Buscar configurações do vídeo no banco de dados
    
        const script = `
(function() {
  // VTurb Player - ${id}
  
  // Configurar URL HLS baseada no hostname do Bunny CDN
  const BUNNY_CDN_HOSTNAME = '${process.env.BUNNY_CDN_HOSTNAME || 'vz-d6fcd262-b88.b-cdn.net'}';
  const hlsUrl = 'https://${process.env.BUNNY_CDN_HOSTNAME || 'vz-d6fcd262-b88.b-cdn.net'}/${id}/playlist.m3u8';
  
  // Criar container para o player
  const container = document.createElement('div');
  container.id = 'vturb-player-${id}';
  container.style.cssText = 'width: 100%; max-width: 640px; margin: 20px auto; text-align: center;';
  
  // Inserir no local correto da página
  const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
  if (currentScript && currentScript.parentNode) {
    currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  } else {
    document.body.appendChild(container);
  }
  
  // Criar estrutura do player com design melhorado
  container.innerHTML = \`
    <div id="vturb-container-${id}" style="
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      position: relative;
      transition: transform 0.2s ease;
    ">
      <video 
        id="vturb-video-${id}"
        controls 
        muted
        preload="metadata"
        style="
          width: 100%; 
          height: auto; 
          display: block;
          background: #000;
        "
      ></video>
      
      <!-- Barra de progresso customizada -->
      <div id="vturb-progress-container-${id}" style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
      ">
        <div id="vturb-progress-${id}" style="
          height: 100%;
          background: linear-gradient(90deg, #3B82F6, #1D4ED8);
          width: 0%;
          transition: width 0.2s ease;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        "></div>
      </div>
      
      <!-- Loading indicator -->
      <div id="vturb-loading-${id}" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      ">
        <div style="
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: vturb-spin-${id} 1s linear infinite;
        "></div>
        Carregando vídeo...
      </div>
    </div>
    
    <style>
      @keyframes vturb-spin-${id} {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      #vturb-container-${id}:hover {
        transform: translateY(-2px);
      }
    </style>
  \`;
  
  // Função para esconder loading
  function hideLoading() {
    const loading = document.getElementById('vturb-loading-${id}');
    if (loading) loading.style.display = 'none';
  }
  
  // Função para mostrar erro
  function showError(message) {
    const loading = document.getElementById('vturb-loading-${id}');
    if (loading) {
      loading.innerHTML = \`
        <div style="color: #EF4444; text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
          <div>\${message}</div>
        </div>
      \`;
    }
  }
  
  // Carregar HLS.js dinamicamente
  const hlsScript = document.createElement('script');
  hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
  hlsScript.onload = function() {
    const video = document.getElementById('vturb-video-${id}');
    const progress = document.getElementById('vturb-progress-${id}');
    let hasPlayed = false;
    let hls = null;
    
    // Configurar HLS
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        console.log('VTurb: HLS manifest carregado');
        hideLoading();
      });
      
      hls.on(Hls.Events.ERROR, function(event, data) {
        console.error('VTurb: Erro HLS', data);
        if (data.fatal) {
          showError('Erro ao carregar vídeo');
        }
      });
      
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', hideLoading);
      video.addEventListener('error', () => showError('Erro ao carregar vídeo'));
      
    } else {
      showError('Seu navegador não suporta streaming de vídeo');
      return;
    }
    
    // Event listeners para analytics e UI
    if (video && progress) {
      
      // Play event (primeira vez)
      video.addEventListener('play', function() {
        if (!hasPlayed) {
          hasPlayed = true;
          fetch('${process.env.API_URL || 'http://localhost:3001'}/api/analytics/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'play',
              videoId: '${id}',
              timestamp: Date.now(),
              data: { 
                url: window.location.href,
                userAgent: navigator.userAgent,
                hlsSupported: Hls.isSupported()
              }
            })
          }).catch(console.warn);
        }
      });
      
      // Atualizar barra de progresso
      video.addEventListener('timeupdate', function() {
        if (video.duration > 0) {
          const percent = (video.currentTime / video.duration) * 100;
          progress.style.width = percent + '%';
        }
      });
      
      // Eventos adicionais para analytics
      video.addEventListener('ended', function() {
        fetch('${process.env.API_URL || 'http://localhost:3001'}/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ended',
            videoId: '${id}',
            timestamp: Date.now(),
            data: { 
              watchTime: video.currentTime,
              duration: video.duration,
              completion: (video.currentTime / video.duration) * 100
            }
          })
        }).catch(console.warn);
      });
      
      // Pause event
      video.addEventListener('pause', function() {
        fetch('${process.env.API_URL || 'http://localhost:3001'}/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pause',
            videoId: '${id}',
            timestamp: Date.now(),
            data: { 
              currentTime: video.currentTime,
              duration: video.duration
            }
          })
        }).catch(console.warn);
      });
    }
    
    // Registrar impressão inicial
    fetch('${process.env.API_URL || 'http://localhost:3001'}/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'impression',
        videoId: '${id}',
        timestamp: Date.now(),
        data: { 
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      })
    }).catch(console.warn);
  };
  
  hlsScript.onerror = function() {
    showError('Erro ao carregar player de vídeo');
  };
  
  document.head.appendChild(hlsScript);
})();
    `.trim();
    
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.send(script);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar script' });
  }
});

// GET /embed/:id/config - Buscar configurações do vídeo
router.get('/:id/config', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Buscar no banco de dados
    
    const config: VideoConfig = {
      id,
      title: 'Vídeo de exemplo',
      videoUrl: 'https://example.com/video.mp4',
      thumbUrl: 'https://example.com/thumb.jpg',
      primaryColor: '#3B82F6',
      autoplay: false,
      muted: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

export { router as embedRoutes }; 