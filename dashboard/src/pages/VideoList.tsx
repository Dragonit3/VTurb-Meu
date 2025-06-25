import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbUrl?: string;
  primaryColor: string;
  autoplay: boolean;
  muted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedScript = (videoId: string) => {
    return `<script src="http://localhost:3001/embed/${videoId}.js"></script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Script copiado para a área de transferência!');
  };

  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    if (window.confirm(`Tem certeza que deseja remover o vídeo "${videoTitle}"? Esta ação não pode ser desfeita.`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/videos/${videoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Vídeo removido com sucesso!');
          fetchVideos(); // Recarregar a lista
        } else {
          const error = await response.json();
          alert(`Erro ao remover vídeo: ${error.error}`);
        }
      } catch (error) {
        console.error('Erro ao remover vídeo:', error);
        alert('Erro ao remover vídeo');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Carregando vídeos...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🎬 Vídeos</h1>
        <Link to="/upload" className="btn btn-primary">
          ➕ Upload Novo Vídeo
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
        <h3 style={{ marginBottom: 16 }}>Nenhum vídeo encontrado</h3>
        <p style={{ marginBottom: 32 }}>Faça upload do seu primeiro vídeo para começar!</p>
        <Link to="/upload" className="btn btn-primary">
            Fazer Upload
        </Link>
        </div>
        
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {videos.map((video) => (
            <div key={video.id} className="card">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {video.thumbUrl && (
                  <img 
                    src={video.thumbUrl} 
                    alt={video.title}
                    style={{ width: '120px', height: '67px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3>{video.title}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    Criado em: {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: video.primaryColor, 
                      color: 'white', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Cor: {video.primaryColor}
                    </span>
                    {video.autoplay && (
                      <span style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#10B981', 
                        color: 'white', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Autoplay
                      </span>
                    )}
                    {video.muted && (
                      <span style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#6B7280', 
                        color: 'white', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Mudo
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => copyToClipboard(generateEmbedScript(video.id))}
                  >
                    📋 Copiar Script
                  </button>
                  <Link 
                    to={`/videos/${video.id}/edit`} 
                    className="btn btn-primary"
                  >
                    ✏️ Editar
                  </Link>
                  <Link 
                    to={`/videos/${video.id}/metrics`} 
                    className="btn btn-primary"
                  >
                    📊 Ver Métricas
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteVideo(video.id, video.title)}
                    style={{ backgroundColor: '#EF4444', color: 'white' }}
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 