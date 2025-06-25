import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const VideoUpload: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    primaryColor: '#3B82F6',
    autoplay: false,
    muted: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar preview do vídeo
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo de vídeo');
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('primaryColor', formData.primaryColor);
      formDataToSend.append('autoplay', formData.autoplay.toString());
      formDataToSend.append('muted', formData.muted.toString());

      const response = await fetch('http://localhost:3001/api/videos', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const video = await response.json();
        alert('Vídeo enviado com sucesso!');
        navigate('/');
      } else {
        const error = await response.json();
        alert(`Erro ao enviar vídeo: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar vídeo. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>📤 Upload de Vídeo</h1>
        <p>Faça upload do seu vídeo e configure as opções do player</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Arquivo de Vídeo (.mp4)</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="form-input"
              required
            />
            <small style={{ color: '#666' }}>
              Máximo: 2GB | Duração: até 50 minutos
            </small>
          </div>

          {previewUrl && (
            <div className="form-group">
              <label className="form-label">Preview</label>
              <video
                src={previewUrl}
                controls
                style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Título do Vídeo</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Digite o título do vídeo"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cor Principal</label>
            <input
            type="color"
            name="primaryColor"
            value={formData.primaryColor}
            onChange={e => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
            style={{
                width: '60px',
                height: '40px',
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 0 0 1px #D1D5DB',
                cursor: 'pointer', // <-- garante que o mouse vira mãozinha
                display: 'inline-block',
                verticalAlign: 'middle'
            }}
            />
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {formData.primaryColor}
            </span>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="autoplay"
                checked={formData.autoplay}
                onChange={handleInputChange}
              />
              Reproduzir automaticamente
            </label>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="muted"
                checked={formData.muted}
                onChange={handleInputChange}
              />
              Iniciar sem som
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Enviando...' : '📤 Enviar Vídeo'}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 