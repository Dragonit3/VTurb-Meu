// Tipos principais do VTurb Player
export interface VideoConfig {
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

export interface PlayerOptions {
  width?: number;
  height?: number;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export interface AnalyticsEvent {
  type: 'play' | 'pause' | 'timeupdate' | 'ended' | 'click' | 'error';
  videoId: string;
  timestamp: number;
  data?: {
    currentTime?: number;
    duration?: number;
    playRate?: number;
    retention?: number;
    utmSource?: string;
    utmCampaign?: string;
    utmMedium?: string;
    elementId?: string;
  };
}

export interface RetentionData {
  videoId: string;
  second: number;
  viewers: number;
  retention: number;
  date: string;
}

export interface VideoMetrics {
  videoId: string;
  impressions: number;
  plays: number;
  playRate: number;
  averageWatchTime: number;
  totalWatchTime: number;
  retentionData: RetentionData[];
  clickEvents: ClickEvent[];
}

export interface ClickEvent {
  videoId: string;
  elementId: string;
  timestamp: number;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
}

// Interfaces para serviços (seguindo inversão de dependência)
export interface VideoService {
  getVideoConfig(id: string): Promise<VideoConfig>;
  uploadVideo(file: File, config: Partial<VideoConfig>): Promise<VideoConfig>;
  updateVideoConfig(id: string, config: Partial<VideoConfig>): Promise<VideoConfig>;
}

export interface AnalyticsService {
  recordEvent(event: AnalyticsEvent): Promise<void>;
  getVideoMetrics(videoId: string, filters?: AnalyticsFilters): Promise<VideoMetrics>;
  getRetentionData(videoId: string, dateRange?: DateRange): Promise<RetentionData[]>;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Utilitários
export const generateVideoId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getUTMParams = (): Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content'].forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });
  
  return utmParams;
};

// Constantes
export const DEFAULT_COLORS = {
  primary: '#3B82F6',
  secondary: '#1F2937',
  accent: '#F59E0B'
};

export const PLAYER_DEFAULTS = {
  width: 640,
  height: 360,
  autoplay: false,
  muted: true,
  loop: false,
  controls: false
}; 