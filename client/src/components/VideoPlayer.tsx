import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '../types';
import { scaleIn, fadeInUp } from '../utils/animations';
import { 
  FiThumbsUp, 
  FiMessageSquare, 
  FiEye, 
  FiClock, 
  FiX, 
  FiYoutube, 
  FiPlay, 
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiSettings,
  FiShare2,
  FiDownload,
  FiInfo,
  FiRotateCw
} from 'react-icons/fi';
import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback, 
  useMemo 
} from 'react';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  autoPlayNext?: boolean;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const QUALITY_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: '144p', value: 'small' },
  { label: '240p', value: 'small' },
  { label: '360p', value: 'medium' },
  { label: '480p', value: 'medium' },
  { label: '720p', value: 'hd720' },
  { label: '1080p', value: 'hd1080' },
  { label: '1440p', value: 'hd1440' },
  { label: '2160p', value: 'hd2160' },
];

export const VideoPlayer = ({ 
  video, 
  isOpen, 
  onClose, 
  onNext,
  onPrevious,
  autoPlayNext = true 
}: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [showControls, setShowControls] = useState(true);
  const [isPiP, setIsPiP] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  
  // Format time in seconds to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 't':
        toggleTheaterMode();
        break;
      case 'c':
        toggleCaptions();
        break;
      case 'p':
        togglePictureInPicture();
        break;
      case 'ArrowLeft':
        seek(-5);
        break;
      case 'ArrowRight':
        seek(5);
        break;
      case 'j':
        seek(-10);
        break;
      case 'l':
        seek(10);
        break;
      case '>':
      case '.':
        if (playerRef.current) {
          playerRef.current.seekTo(currentTime + 5, true);
        }
        break;
      case '<':
      case ',':
        if (playerRef.current) {
          playerRef.current.seekTo(Math.max(0, currentTime - 5), true);
        }
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const percent = parseInt(e.key) / 10;
        if (playerRef.current) {
          playerRef.current.seekTo(duration * percent, true);
        }
        break;
      case '0':
        if (playerRef.current) {
          playerRef.current.seekTo(0, true);
        }
        break;
      case 'i':
        setShowInfo(prev => !prev);
        break;
      case '?':
        // Show keyboard shortcuts help
        break;
      default:
        break;
    }
  }, [isOpen, currentTime, duration]);

  // Toggle play/pause with better error handling
  const togglePlayPause = useCallback(async () => {
    if (!playerRef.current) {
      console.warn('Player not initialized');
      return;
    }

    try {
      const state = playerRef.current.getPlayerState ? 
        playerRef.current.getPlayerState() : 
        YT.PlayerState.UNSTARTED;
      
      if (state === YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        // If video is ended, restart it from the beginning
        if (state === YT.PlayerState.ENDED) {
          playerRef.current.seekTo(0, true);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      // Attempt to reinitialize the player on error
      if (video) {
        const event = new CustomEvent('youtube-player-init', { 
          detail: { videoId: video.id } 
        });
        window.dispatchEvent(event);
      }
    }
  }, [isPlaying, video]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted, volume]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Toggle theater mode
  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
  }, []);

  // Toggle picture in picture
  const togglePictureInPicture = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled && iframeRef.current) {
        // Get the video element from the iframe
        const iframe = iframeRef.current;
        const video = iframe.contentDocument?.querySelector('video');
        
        if (video) {
          if (video !== document.pictureInPictureElement) {
            await video.requestPictureInPicture();
            setIsPiP(true);
          }
        } else {
          console.warn('No video element found in the iframe');
          // Fallback to showing a message to the user
          alert('Picture-in-Picture is not available for this video');
        }
      }
    } catch (error) {
      console.error('Error toggling Picture-in-Picture:', error);
      alert('Failed to toggle Picture-in-Picture. Please try again.');
    }
  }, []);

  // Toggle captions
  const toggleCaptions = useCallback(() => {
    if (playerRef.current) {
      // Toggle captions using YouTube Player API
      playerRef.current.isMuted() ? playerRef.current.unMute() : playerRef.current.mute();
      setShowCaptions(prev => !prev);
    }
  }, []);

  // Seek video by seconds
  const seek = useCallback((seconds: number) => {
    if (playerRef.current) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  }, [currentTime, duration]);

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
      if (newVolume === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  }, [isMuted]);

  // Handle progress bar click
  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  }, [duration]);

  // Initialize YouTube Player API
  useEffect(() => {
    if (!isOpen || !video) return;

    // Function to initialize the YouTube player
    const initializePlayer = () => {
      if (!iframeRef.current) return;

      // Clear any existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying existing player:', e);
        }
        playerRef.current = null;
      }
      
      try {
        // Ensure YT is defined
        if (!window.YT || !window.YT.Player) {
          throw new Error('YouTube Player API not loaded');
        }
        
        playerRef.current = new window.YT.Player(iframeRef.current, {
          videoId: video.id,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            cc_load_policy: showCaptions ? 1 : 0,
            iv_load_policy: 3,
            fs: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            widgetid: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsLoading(false);
              setIsPlaying(true);
              setDuration(event.target.getDuration());
              
              // Set initial volume
              event.target.setVolume(volume * 100);
              if (isMuted) {
                event.target.mute();
              }
              
              // Set playback rate if changed
              if (playbackRate !== 1) {
                event.target.setPlaybackRate(playbackRate);
              }
            },
            onStateChange: (event: any) => {
              switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                  setIsPlaying(true);
                  setIsLoading(false);
                  break;
                case window.YT.PlayerState.PAUSED:
                  setIsPlaying(false);
                  break;
                case window.YT.PlayerState.ENDED:
                  setIsPlaying(false);
                  if (autoPlayNext && onNext) {
                    onNext();
                  }
                  break;
                case window.YT.PlayerState.BUFFERING:
                  setIsLoading(true);
                  break;
                case window.YT.PlayerState.CUED:
                  setIsLoading(false);
                  break;
                default:
                  break;
              }
            },
            onError: (event: any) => {
              console.error('YouTube Player Error:', event.data);
              setError('An error occurred while loading the video. Please try again later.');
              setIsLoading(false);
            },
            onPlaybackQualityChange: (event: any) => {
              console.log('Playback quality changed to:', event.data);
            },
            onPlaybackRateChange: (event: any) => {
              console.log('Playback rate changed to:', event.data);
              setPlaybackRate(event.data);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setError('Failed to initialize video player. Please try again.');
        setIsLoading(false);
      }
    };

    // Load YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Set up the callback for when the API is ready
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    } else {
      // If YT is already loaded, initialize the player directly
      initializePlayer();
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying player on cleanup:', e);
        }
        playerRef.current = null;
      }
      if ((window as any).onYouTubeIframeAPIReady) {
        (window as any).onYouTubeIframeAPIReady = undefined;
      }
    };
  }, [isOpen, video, autoPlayNext, onNext, isMuted, playbackRate, quality, showCaptions, volume]);

  // Update current time
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle PiP change
  useEffect(() => {
    const handlePiPChange = () => {
      setIsPiP(!!document.pictureInPictureElement);
    };

    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);
    
    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Handle mouse movement for showing/hiding controls
  useEffect(() => {
    if (!isOpen) return;
    
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, isPlaying]);

  if (!video) return null;

  const videoUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const channelUrl = `https://www.youtube.com/channel/${video.channelId || 'UC'}`;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercentage = 0; // This would require more complex tracking

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className={`fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto ${
            isTheaterMode ? 'pt-0' : ''
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowControls(prev => !prev)}
        >
          <motion.div
            className={`glass-effect rounded-2xl w-full my-8 overflow-hidden ${
              isTheaterMode ? 'max-w-full mx-0 my-0 rounded-none h-screen' : 'max-w-6xl'
            }`}
            initial="initial"
            animate="animate"
            variants={scaleIn}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Container */}
            <div className="aspect-video w-full relative bg-black">
              {/* Loading Indicator */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
                  <div className="bg-red-600/80 text-white p-4 rounded-lg max-w-md">
                    <p className="font-bold">Error Loading Video</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* YouTube iframe */}
              <div className={`w-full h-full ${isLoading ? 'invisible' : ''}`}>
                <div id="yt-player" ref={iframeRef}></div>
              </div>

              {/* Video Controls Overlay */}
              <div 
                className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-gray-700 cursor-pointer group"
                  onClick={handleProgressBarClick}
                >
                  <div 
                    className="h-full bg-red-600 relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div 
                      className="absolute right-0 top-1/2 -mt-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ right: '0', transform: 'translateX(50%)' }}
                    />
                  </div>
                  {bufferPercentage > 0 && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-gray-500/50"
                      style={{ width: `${bufferPercentage}%` }}
                    />
                  )}
                </div>

                {/* Video Controls */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Play/Pause Button */}
                    <button 
                      onClick={togglePlayPause}
                      className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <FiPause className="w-5 h-5" />
                      ) : (
                        <FiPlay className="w-5 h-5" />
                      )}
                    </button>

                    {/* Volume Controls */}
                    <div className="flex items-center group">
                      <button 
                        onClick={toggleMute}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <FiVolumeX className="w-5 h-5" />
                        ) : volume < 0.5 ? (
                          <FiVolume2 className="w-5 h-5" />
                        ) : (
                          <FiVolume2 className="w-5 h-5" />
                        )}
                      </button>
                      <div className="w-24 h-1 bg-gray-600 rounded-full mx-2 group-hover:block hidden">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-full h-1 bg-red-600 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #fff 0%, #fff ${volume * 100}%, #4B5563 ${volume * 100}%, #4B5563 100%)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Time Display */}
                    <div className="text-white text-xs font-mono ml-2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Playback Speed */}
                    <div className="relative group">
                      <button 
                        onClick={() => setIsSettingsOpen(prev => !prev)}
                        className="px-2 py-1 text-white text-sm hover:bg-white/10 rounded transition-colors"
                      >
                        {playbackRate}x
                      </button>
                      {isSettingsOpen && (
                        <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                          <div className="text-xs text-gray-400 px-3 py-1 border-b border-gray-700">Playback Speed</div>
                          {PLAYBACK_SPEEDS.map(speed => (
                            <button
                              key={speed}
                              onClick={() => {
                                if (playerRef.current) {
                                  playerRef.current.setPlaybackRate(speed);
                                  setPlaybackRate(speed);
                                }
                                setIsSettingsOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1 text-sm ${
                                speed === playbackRate 
                                  ? 'text-blue-500 font-medium' 
                                  : 'text-white hover:bg-white/10'
                              }`}
                            >
                              {speed === 1 ? 'Normal' : `${speed}x`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Captions */}
                    <button 
                      onClick={toggleCaptions}
                      className={`p-2 rounded-full transition-colors ${
                        showCaptions ? 'text-blue-500' : 'text-white hover:bg-white/10'
                      }`}
                      aria-label={showCaptions ? 'Hide captions' : 'Show captions'}
                    >
                      <span className="text-xs font-bold">CC</span>
                    </button>

                    {/* Settings */}
                    <button 
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Settings"
                    >
                      <FiSettings className="w-5 h-5" />
                    </button>

                    {/* Picture in Picture */}
                    <button 
                      onClick={togglePictureInPicture}
                      className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      aria-label={isPiP ? 'Exit Picture in Picture' : 'Enter Picture in Picture'}
                    >
                      <FiMaximize className="w-5 h-5 transform rotate-45" />
                    </button>

                    {/* Fullscreen */}
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                      {isFullscreen ? (
                        <FiMinimize className="w-5 h-5" />
                      ) : (
                        <FiMaximize className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Play/Pause Button (Large) */}
              {!isPlaying && (
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Play"
                >
                  <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center">
                    <FiPlay className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-10"
                aria-label="Close video"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Video Info */}
            <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800">
              <div className="flex items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">{video.title}</h2>
                  <div className="flex items-center text-gray-300 text-sm flex-wrap gap-x-4 gap-y-1">
                    <span>{parseInt(video.views).toLocaleString()} views</span>
                    <span>•</span>
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <FiThumbsUp className="mr-1" />
                      <span>{parseInt(video.likes).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
                    <FiThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
                    <FiShare2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <a
                      href={channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center group"
                    >
                      <img
                        src={video.channelThumbnail}
                        alt={video.channelTitle}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {video.channelTitle}
                        </div>
                        <div className="text-xs text-gray-400">1.2M subscribers</div>
                      </div>
                    </a>
                    <button className="ml-4 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors">
                      Subscribe
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowInfo(prev => !prev)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={showInfo ? 'Hide info' : 'Show info'}
                  >
                    <FiInfo className="w-5 h-5" />
                  </button>
                </div>
                
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 flex items-center px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiYoutube className="mr-2" /> Watch on YouTube
                </a>
              </div>

              {/* Video Description */}
              {showInfo && (
                <motion.div 
                  {...fadeInUp}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800/50 rounded-xl p-4 mt-4 mx-4 mb-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-gray-300 whitespace-pre-line text-sm">
                    {video.description || 'No description available.'}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-medium text-white mb-2">Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      <div>Published: {new Date(video.publishedAt).toLocaleDateString()}</div>
                      <div>Views: {parseInt(video.views).toLocaleString()}</div>
                      <div>Likes: {parseInt(video.likes).toLocaleString()}</div>
                      <div>Comments: {parseInt(video.comments).toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
