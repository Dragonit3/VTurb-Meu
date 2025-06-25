import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { PlayButton } from './PlayButton';
import { MuteButton } from './MuteButton';

interface VideoConfig {
  id: string;
  title: string;
  videoUrl: string;
  thumbUrl?: string;
  primaryColor: string;
  autoplay: boolean;
  muted: boolean;
}

interface PlayerConfig {
  apiUrl: string;
  primaryColor?: string;
  autoplay?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
}

interface VTurbPlayerProps {
  videoId: string;
  videoConfig: VideoConfig;
  playerConfig: PlayerConfig;
}

export const VTurbPlayer: React.FC<VTurbPlayerProps> = ({
  videoId,
  videoConfig,
  playerConfig
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(videoConfig.muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showThumb, setShowThumb] = useState(!videoConfig.autoplay);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryColor = playerConfig.primaryColor || videoConfig.primaryColor || '#3B82F6';
  const width = playerConfig.width || 640;
  const height = playerConfig.height || 360;

  // Inicializar vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configurar vídeo
    video.muted = isMuted;
    video.autoplay = videoConfig.autoplay;
    
    if (videoConfig.autoplay) {
      setIsPlaying(true);
      setShowThumb(false);
    }

    // Event listeners
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setShowThumb(false);
      trackEvent('play', { currentTime: video.currentTime });
    };

    const handlePause = () => {
      setIsPlaying(false);
      trackEvent('pause', { currentTime: video.currentTime });
    };

    const handleEnded = () => {
      setIsPlaying(false);
      trackEvent('ended', { currentTime: video.currentTime });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoConfig.autoplay, isMuted]);

  // Registrar eventos de analytics
  const trackEvent = async (type: string, data?: any) => {
    try {
      await fetch(`${playerConfig.apiUrl}/api/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          videoId,
          timestamp: Date.now(),
          data: {
            ...data,
            currentTime: videoRef.current?.currentTime,
            duration: videoRef.current?.duration
          }
        })
      });
    } catch (error) {
      console.warn('Erro ao registrar evento:', error);
    }
  };

  // Controles do vídeo
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent('first_interaction');
    }

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
    trackEvent('mute_toggle', { muted: !isMuted });
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleThumbClick = () => {
    setShowThumb(false);
    setIsMuted(false);
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={handleVideoClick}
    >
      {/* Vídeo */}
      <video
        ref={videoRef}
        src={videoConfig.videoUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        playsInline
        preload="metadata"
      />

      {/* Thumbnail overlay */}
      {showThumb && videoConfig.thumbUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${videoConfig.thumbUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={handleThumbClick}
        >
          <PlayButton
            size={80}
            color={primaryColor}
            onClick={handleThumbClick}
          />
        </div>
      )}

      {/* Controles */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '20px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        {/* Barra de progresso inteligente */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          color={primaryColor}
          style={{ flex: 1 }}
        />

        {/* Botão de mute */}
        <MuteButton
          isMuted={isMuted}
          color={primaryColor}
          onClick={toggleMute}
        />
      </div>

      {/* Botão de play central */}
      {!isPlaying && !showThumb && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <PlayButton
            size={60}
            color={primaryColor}
            onClick={togglePlay}
          />
        </div>
      )}
    </div>
  );
}; 