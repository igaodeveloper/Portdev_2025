// Type definitions for YouTube Iframe API
declare namespace YT {
  interface PlayerEvent {
    target: Player;
    data: number;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    rel?: 0 | 1;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    cc_load_policy?: 0 | 1;
    iv_load_policy?: 1 | 3;
    fs?: 0 | 1;
    enablejsapi?: 0 | 1;
    origin?: string;
    widgetid?: number;
  }

  interface PlayerOptions {
    videoId?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerEvent) => void;
      onError?: (event: PlayerEvent) => void;
      onPlaybackQualityChange?: (event: PlayerEvent) => void;
      onPlaybackRateChange?: (event: PlayerEvent) => void;
    };
  }

  class Player {
    constructor(element: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerState;
    getAvailableQualityLevels(): string[];
    setPlaybackQuality(suggestedQuality: string): void;
    setPlaybackRate(suggestedRate: number): void;
    getPlaybackRate(): number;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    destroy(): void;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

declare var YT: {
  Player: typeof YT.Player;
  PlayerState: typeof YT.PlayerState;
  loading: number;
  ready: (callback: () => void) => void;
  setConfig: (config: {[key: string]: any}) => void;
};

// Extend the global Window interface
declare global {
  interface Window {
    YT: {
      Player: typeof YT.Player;
      PlayerState: typeof YT.PlayerState;
      loading: number;
      ready: (callback: () => void) => void;
      setConfig: (config: {[key: string]: any}) => void;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
