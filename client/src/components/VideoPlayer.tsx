import React from 'react';
import { FiX, FiClock, FiEye, FiThumbsUp, FiMessageSquare, FiCalendar, FiUser } from 'react-icons/fi';
import { Video } from '../types';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper function to safely format dates
const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Data indisponível';
    
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: ptBR
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex-shrink-0">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all -mt-2 -mr-2"
            aria-label="Fechar player de vídeo"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

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
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center text-gray-300">
              <FiUser className="mr-1" />
              <span>{video.channelTitle}</span>
            </div>
            <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-1" />
                <span>{formatDate(video.publishedAt)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center">
              <FiEye className="mr-2 text-blue-400" />
              <span>{video.views} visualizações</span>
            </div>
            <div className="flex items-center">
              <FiThumbsUp className="mr-2 text-green-400" />
              <span>{video.likes} curtidas</span>
            </div>
            <div className="flex items-center">
              <FiMessageSquare className="mr-2 text-yellow-400" />
              <span>{video.comments} comentários</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-2 text-purple-400" />
              <span>Duração: {video.duration}</span>
            </div>
          </div>

          {video.description && (
            <div className="mt-4 p-3 bg-gray-800/50 rounded">
              <h3 className="font-semibold mb-2">Descrição:</h3>
              <p className="text-gray-300 text-sm whitespace-pre-line">{video.description}</p>
            </div>
          )}
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
    </div>
  );
};
