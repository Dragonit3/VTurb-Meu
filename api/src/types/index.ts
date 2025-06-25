// Tipos para a API do VTurb Player

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

export interface AnalyticsEvent {
  type: 'play' | 'pause' | 'timeupdate' | 'ended' | 'click' | 'error' | 'impression';
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

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
} 