import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  color: string;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  color,
  style
}) => {
  // Barra inteligente: avança mais rápido no início e mais lento no final
  const getIntelligentProgress = (current: number, total: number): number => {
    if (total === 0) return 0;
    
    const progress = current / total;
    
    // Função de easing: acelera no início, desacelera no final
    // Usando uma função cúbica para criar sensação de "passando rápido"
    return Math.pow(progress, 0.7);
  };

  const progress = getIntelligentProgress(currentTime, duration);
  const percentage = Math.min(progress * 100, 100);

  return (
    <div
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '2px',
        overflow: 'hidden',
        ...style
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '2px',
          transition: 'width 0.1s ease-out',
          boxShadow: `0 0 8px ${color}40`
        }}
      />
    </div>
  );
}; 