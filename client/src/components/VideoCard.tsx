import { motion } from 'framer-motion';
import { Video } from '../types';
import { cardHover, fadeInUp } from '../utils/animations';

interface VideoCardProps {
  video: Video;
  onOpenPlayer: (video: Video) => void;
}

export const VideoCard = ({ video, onOpenPlayer }: VideoCardProps) => {
  return (
    <motion.div
      className="glass-effect rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-500 cursor-pointer group"
      onClick={() => onOpenPlayer(video)}
      {...fadeInUp}
      {...cardHover}
      data-testid={`card-video-${video.id}`}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <motion.img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-cosmic-purple rounded-full flex items-center justify-center">
            <i className="fas fa-play text-white text-xl"></i>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-cosmic-black bg-opacity-75 px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 text-cosmic-blue">{video.title}</h3>
      <p className="text-cosmic-gray text-sm mb-4 line-clamp-2">{video.description}</p>
      <div className="flex items-center justify-between text-sm text-cosmic-gray">
        <span>{video.views}</span>
        <span>{video.publishedAt}</span>
      </div>
    </motion.div>
  );
};
