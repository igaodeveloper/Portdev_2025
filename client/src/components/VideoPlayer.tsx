import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '../types';
import { scaleIn } from '../utils/animations';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ video, isOpen, onClose }: VideoPlayerProps) => {
  if (!video) return null;

  const videoUrl = `https://www.youtube.com/embed/${video.id}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-effect rounded-2xl max-w-6xl w-full"
            {...scaleIn}
            onClick={(e) => e.stopPropagation()}
            data-testid={`player-video-${video.id}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-cosmic-blue">{video.title}</h3>
                <button
                  onClick={onClose}
                  className="text-cosmic-gray hover:text-white text-2xl"
                  data-testid="button-close-player"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="aspect-video bg-cosmic-black rounded-lg overflow-hidden">
                <iframe
                  src={videoUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-testid="iframe-youtube-player"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
