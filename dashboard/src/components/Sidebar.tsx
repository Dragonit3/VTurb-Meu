import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#1F2937',
      color: 'white',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#3B82F6' }}>🎬 VTurb Player</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#9CA3AF' }}>
          Player Inteligente
        </p>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link
              to="/"
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive('/') ? 'white' : '#D1D5DB',
                backgroundColor: isActive('/') ? '#3B82F6' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              📋 Lista de Vídeos
            </Link>
          </li>
          
          <li style={{ marginBottom: '10px' }}>
            <Link
              to="/upload"
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive('/upload') ? 'white' : '#D1D5DB',
                backgroundColor: isActive('/upload') ? '#3B82F6' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              📤 Upload de Vídeo
            </Link>
          </li>
        </ul>
      </nav>

      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '30px', 
        borderTop: '1px solid #374151',
        fontSize: '12px',
        color: '#9CA3AF'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>Status dos Serviços:</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#10B981', 
            marginRight: '8px' 
          }} />
          API (3001)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#10B981', 
            marginRight: '8px' 
          }} />
          Player (3002)
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#10B981', 
            marginRight: '8px' 
          }} />
          Dashboard (3000)
        </div>
      </div>
    </div>
  );
}; 