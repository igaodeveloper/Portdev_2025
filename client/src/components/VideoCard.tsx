import { motion } from 'framer-motion';
import { Video } from '../types';
import { cardHover, fadeInUp } from '../utils/animations';
import { FiThumbsUp, FiMessageSquare, FiEye } from 'react-icons/fi';

interface VideoCardProps {
  video: Video;
  onOpenPlayer: (video: Video) => void;
}

export const VideoCard = ({ video, onOpenPlayer }: VideoCardProps) => {
  return (
    <motion.div
      className="glass-effect rounded-2xl overflow-hidden hover:bg-opacity-20 transition-all duration-500 cursor-pointer group flex flex-col h-full"
      onClick={() => onOpenPlayer(video)}
      {...fadeInUp}
      {...cardHover}
      data-testid={`card-video-${video.id}`}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex items-center space-x-2">
            <span className="bg-cosmic-purple/90 text-white text-xs px-2 py-1 rounded flex items-center">
              <FiEye className="mr-1" /> {video.views}
            </span>
            <span className="bg-cosmic-blue/90 text-white text-xs px-2 py-1 rounded flex items-center">
              <FiThumbsUp className="mr-1" /> {video.likes}
            </span>
            <span className="bg-cosmic-pink/90 text-white text-xs px-2 py-1 rounded flex items-center">
              <FiMessageSquare className="mr-1" /> {video.comments}
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-cosmic-black/90 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cosmic-blue transition-colors duration-300 line-clamp-2">
          {video.title}
        </h3>
        
        <div className="flex items-center mt-2 mb-3">
          <img 
            src={video.channelThumbnail} 
            alt={video.channelTitle}
            className="w-8 h-8 rounded-full mr-2 border-2 border-cosmic-blue/30"
          />
          <span className="text-sm text-cosmic-gray">{video.channelTitle}</span>
        </div>
        
        <p className="text-cosmic-gray text-sm mb-3 line-clamp-2 flex-1">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-cosmic-gray/80 mt-auto pt-2 border-t border-cosmic-gray/10">
          <span>{video.publishedAt}</span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <FiThumbsUp className="mr-1" /> {video.likes}
            </span>
            <span className="flex items-center">
              <FiMessageSquare className="mr-1" /> {video.comments}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
