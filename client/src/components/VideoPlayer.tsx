import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '../types';
import { scaleIn, fadeInUp } from '../utils/animations';
import { FiThumbsUp, FiMessageSquare, FiEye, FiClock, FiX, FiYoutube } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ video, isOpen, onClose }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fechar o player ao pressionar a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!video) return null;

  const videoUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  const channelUrl = `https://www.youtube.com/channel/${video.channelId || 'UC'}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-effect rounded-2xl max-w-6xl w-full my-8 overflow-hidden"
            {...scaleIn}
            onClick={(e) => e.stopPropagation()}
            data-testid={`player-video-${video.id}`}
            layoutId={`video-${video.id}`}
          >
            <div className="relative">
              <div className="aspect-video bg-cosmic-black">
                <iframe
                  ref={iframeRef}
                  src={videoUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-testid="iframe-youtube-player"
                ></iframe>
              </div>
              
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 bg-cosmic-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-cosmic-pink transition-colors duration-300 z-10"
                data-testid="button-close-player"
                aria-label="Fechar player"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              <motion.div {...fadeInUp} className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{video.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-cosmic-gray text-sm mb-6">
                  <a 
                    href={channelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-cosmic-blue transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img 
                      src={video.channelThumbnail} 
                      alt={video.channelTitle}
                      className="w-10 h-10 rounded-full mr-2 border-2 border-cosmic-blue/30"
                    />
                    <span className="font-medium">{video.channelTitle}</span>
                  </a>
                  
                  <div className="flex items-center space-x-4 ml-auto">
                    <span className="flex items-center">
                      <FiEye className="mr-1" /> {video.views} visualizações
                    </span>
                    <span className="flex items-center">
                      <FiThumbsUp className="mr-1" /> {video.likes}
                    </span>
                    <span className="flex items-center">
                      <FiMessageSquare className="mr-1" /> {video.comments} comentários
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" /> {video.publishedAt}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 mb-6">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-cosmic-red/90 hover:bg-cosmic-red text-white rounded-full text-sm font-medium transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiYoutube className="mr-2" /> Assistir no YouTube
                  </a>
                </div>
              </motion.div>

              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.1 }}
                className="bg-cosmic-black/30 rounded-xl p-4 border border-cosmic-gray/10"
              >
                <h3 className="text-lg font-semibold text-white mb-3">Descrição</h3>
                <p className="text-cosmic-gray whitespace-pre-line">
                  {video.description || 'Nenhuma descrição disponível.'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
