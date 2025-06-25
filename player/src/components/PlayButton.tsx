import React from 'react';

interface PlayButtonProps {
  size?: number;
  color: string;
  onClick: (e: React.MouseEvent) => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  size = 60,
  color,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 12px ${color}40`,
        transition: 'all 0.2s ease',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = `0 6px 16px ${color}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
      }}
    >
      <svg
        width={size * 0.4}
        height={size * 0.4}
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}; 