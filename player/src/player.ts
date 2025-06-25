import React from 'react';
import ReactDOM from 'react-dom/client';
import { VTurbPlayer } from './components/VTurbPlayer';

// Interface para configurações do player
interface PlayerConfig {
  apiUrl: string;
  primaryColor?: string;
  autoplay?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
}

// Classe principal do VTurb Player
class VTurbPlayerClass {
  private config: PlayerConfig;
  private videoId: string;
  private container: HTMLElement | null = null;

  constructor(videoId: string, config: PlayerConfig) {
    this.videoId = videoId;
    this.config = {
      primaryColor: '#3B82F6',
      autoplay: false,
      muted: true,
      width: 640,
      height: 360,
      ...config
    };
  }

  // Inicializar o player
  async init(containerId?: string): Promise<void> {
    try {
      // Buscar configurações do vídeo
      const response = await fetch(`${this.config.apiUrl}/embed/${this.videoId}/config`);
      if (!response.ok) {
        throw new Error('Vídeo não encontrado');
      }
      
      const videoConfig = await response.json();
      
      // Encontrar ou criar container
      let container: HTMLElement;
      if (containerId) {
        container = document.getElementById(containerId) || document.body;
      } else {
        container = document.createElement('div');
        container.id = `vturb-player-${this.videoId}`;
        document.body.appendChild(container);
      }
      
      this.container = container;
      
      // Renderizar o player
      const root = ReactDOM.createRoot(container);
      root.render(
        React.createElement(VTurbPlayer, {
          videoId: this.videoId,
          videoConfig,
          playerConfig: this.config
        })
      );
      
      // Registrar impressão
      this.trackEvent('impression');
      
    } catch (error) {
      console.error('Erro ao inicializar VTurb Player:', error);
      this.showError('Erro ao carregar o vídeo');
    }
  }

  // Registrar evento de analytics
  private async trackEvent(type: string, data?: any): Promise<void> {
    try {
      await fetch(`${this.config.apiUrl}/api/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          videoId: this.videoId,
          timestamp: Date.now(),
          data: {
            ...data,
            ...this.getUTMParams()
          }
        })
      });
    } catch (error) {
      console.warn('Erro ao registrar evento:', error);
    }
  }

  // Obter parâmetros UTM
  private getUTMParams(): Record<string, string> {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content'].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });
    
    return utmParams;
  }

  // Mostrar erro
  private showError(message: string): void {
    if (this.container) {
      this.container.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${this.config.width}px;
          height: ${this.config.height}px;
          background: #f3f4f6;
          color: #6b7280;
          font-family: Arial, sans-serif;
          border-radius: 8px;
        ">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
            <div>${message}</div>
          </div>
        </div>
      `;
    }
  }

  // Método público para registrar eventos
  public track(type: string, data?: any): void {
    this.trackEvent(type, data);
  }
}

// Expor globalmente
declare global {
  interface Window {
    VTurbPlayer: {
      init: (videoId: string, config: PlayerConfig) => VTurbPlayerClass;
    };
  }
}

window.VTurbPlayer = {
  init: (videoId: string, config: PlayerConfig) => {
    return new VTurbPlayerClass(videoId, config);
  }
};

export { VTurbPlayerClass as VTurbPlayer }; 