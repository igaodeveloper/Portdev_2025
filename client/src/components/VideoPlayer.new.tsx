import { FiX } from 'react-icons/fi';
import { Video } from '../types';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  autoPlayNext?: boolean;
}

export const VideoPlayer = ({ 
  video, 
  isOpen, 
  onClose, 
  onNext,
  onPrevious,
  autoPlayNext = true 
}: VideoPlayerProps) => {
  if (!isOpen || !video) return null;

  const videoUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0&showinfo=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full h-full max-w-6xl mx-4 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
          aria-label="Fechar player de vídeo"
        >
          <FiX size={24} />
        </button>

        {/* Video container */}
        <div className="relative w-full h-0 pb-[56.25%] bg-black">
          <iframe
            src={videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>

        {/* Video info */}
        <div className="mt-4 text-white">
          <h2 className="text-xl font-bold">{video.title}</h2>
          <p className="text-gray-300">{video.channelTitle}</p>
        </div>

        {/* Navigation buttons */}
        {(onPrevious || onNext) && (
          <div className="flex justify-between mt-4">
            <button
              onClick={onPrevious}
              disabled={!onPrevious}
              className={`px-4 py-2 rounded ${
                onPrevious 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              className={`px-4 py-2 rounded ${
                onNext 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
