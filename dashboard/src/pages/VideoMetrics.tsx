import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface VideoMetrics {
  videoId: string;
  impressions: number;
  plays: number;
  playRate: number;
  averageWatchTime: number;
  totalWatchTime: number;
  retentionData: any[];
  clickEvents: any[];
}

export const VideoMetrics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [metrics, setMetrics] = useState<VideoMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMetrics();
    }
  }, [id]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/analytics/videos/${id}/metrics`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Carregando métricas...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Erro ao carregar métricas</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>📊 Métricas do Vídeo</h1>
        <p>Análise detalhada do desempenho do seu vídeo</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3 style={{ color: '#3B82F6', marginBottom: '10px' }}>👁️ Impressões</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metrics.impressions.toLocaleString()}</div>
          <small style={{ color: '#666' }}>Vezes que o vídeo foi carregado</small>
        </div>

        <div className="card">
          <h3 style={{ color: '#10B981', marginBottom: '10px' }}>▶️ Plays</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metrics.plays.toLocaleString()}</div>
          <small style={{ color: '#666' }}>Vezes que o vídeo foi reproduzido</small>
        </div>

        <div className="card">
          <h3 style={{ color: '#F59E0B', marginBottom: '10px' }}>📈 Taxa de Play</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {metrics.playRate > 0 ? `${(metrics.playRate * 100).toFixed(1)}%` : '0%'}
          </div>
          <small style={{ color: '#666' }}>Plays / Impressões</small>
        </div>

        <div className="card">
          <h3 style={{ color: '#8B5CF6', marginBottom: '10px' }}>⏱️ Tempo Médio</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {metrics.averageWatchTime > 0 ? `${Math.round(metrics.averageWatchTime)}s` : '0s'}
          </div>
          <small style={{ color: '#666' }}>Tempo médio assistido</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3>📊 Retenção por Segundo</h3>
          {metrics.retentionData.length > 0 ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '2px' }}>
              {metrics.retentionData.map((data, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    backgroundColor: '#3B82F6',
                    height: `${data.retention * 100}%`,
                    minHeight: '1px',
                    borderRadius: '2px 2px 0 0'
                  }}
                  title={`Segundo ${data.second}: ${(data.retention * 100).toFixed(1)}%`}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <div>📈</div>
              <p>Nenhum dado de retenção disponível</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>🖱️ Eventos de Clique</h3>
          {metrics.clickEvents.length > 0 ? (
            <div>
              {metrics.clickEvents.map((event, index) => (
                <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: 'bold' }}>{event.elementId}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(event.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <div>🖱️</div>
              <p>Nenhum evento de clique registrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>📋 Script de Incorporação</h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '14px',
          border: '1px solid #e9ecef'
        }}>
          {`<script src="http://localhost:3001/embed/${id}.js"></script>`}
        </div>
        <button 
          className="btn btn-primary"
          style={{ marginTop: '10px' }}
          onClick={() => {
            navigator.clipboard.writeText(`<script src="http://localhost:3001/embed/${id}.js"></script>`);
            alert('Script copiado!');
          }}
        >
          📋 Copiar Script
        </button>
      </div>
    </div>
  );
}; 