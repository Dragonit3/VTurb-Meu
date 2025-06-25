import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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

export const VideoEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados do formulário
  const [title, setTitle] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVideo(id);
    }
  }, [id]);

  const fetchVideo = async (videoId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/videos/${videoId}`);
      if (response.ok) {
        const videoData = await response.json();
        setVideo(videoData);
        setTitle(videoData.title);
        setPrimaryColor(videoData.primaryColor);
        setAutoplay(videoData.autoplay);
        setMuted(videoData.muted);
      } else {
        alert('Vídeo não encontrado');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao buscar vídeo:', error);
      alert('Erro ao carregar vídeo');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:3001/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          primaryColor,
          autoplay,
          muted,
        }),
      });

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
        navigate('/');
      } else {
        const error = await response.json();
        alert(`Erro ao salvar: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Carregando vídeo...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Vídeo não encontrado</div>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Voltar à Lista
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>✏️ Editar Vídeo</h1>
        <Link to="/" className="btn btn-secondary">
          ← Voltar à Lista
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Título do Vídeo
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="primaryColor" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Cor Principal
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                style={{
                  width: '50px',
                  height: '40px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Reproduzir automaticamente</span>
            </label>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '4px', marginLeft: '26px' }}>
              O vídeo começará a tocar automaticamente quando carregado
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={muted}
                onChange={(e) => setMuted(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Iniciar sem som</span>
            </label>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '4px', marginLeft: '26px' }}>
              O vídeo iniciará mutado (recomendado para autoplay)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {saving ? 'Salvando...' : '💾 Salvar Configurações'}
            </button>
            <Link
              to="/"
              className="btn btn-secondary"
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Preview das configurações */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>🔍 Preview das Configurações</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <span style={{ 
            padding: '4px 8px', 
            backgroundColor: primaryColor, 
            color: 'white', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Cor: {primaryColor}
          </span>
          {autoplay && (
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
          {muted && (
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
    </div>
  );
}; 