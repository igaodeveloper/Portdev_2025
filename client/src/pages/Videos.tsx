import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { Video } from '../types';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { fadeInUp, staggerContainer } from '../utils/animations';

// Log para depuração
console.log('Variável de ambiente VITE_YOUTUBE_API_KEY:', import.meta.env.VITE_YOUTUBE_API_KEY);

export const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { videos, searchVideos, isLoading, error } = useYouTubeSearch();

  useEffect(() => {
    // Load default videos on mount
    searchVideos('react typescript tutorial');
  }, [searchVideos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos(searchQuery);
    }
  };

  const handleOpenPlayer = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  return (
    <section className="py-20 pt-32">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-glow"
          {...fadeInUp}
        >
          Video <span className="text-cosmic-purple">Tutorials</span>
        </motion.h2>
        
        {/* YouTube Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search programming tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-cosmic-black bg-opacity-50 border border-cosmic-purple rounded-full text-white placeholder-cosmic-gray focus:outline-none focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue focus:ring-opacity-50"
              data-testid="input-video-search"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-full hover:shadow-lg transition-all duration-300"
              data-testid="button-search-videos"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-purple mx-auto"></div>
            <p className="text-cosmic-gray mt-4">Searching videos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
            <p className="text-red-400">Error: {error}</p>
            <p className="text-cosmic-gray mt-2">Please try again or check your API key.</p>
          </div>
        )}

        {/* Videos Grid */}
        {!isLoading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-video text-cosmic-gray text-4xl mb-4"></i>
            <p className="text-cosmic-gray">No videos found. Try a different search term.</p>
          </div>
        )}

        {!isLoading && videos.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            {...staggerContainer}
          >
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onOpenPlayer={handleOpenPlayer}
              />
            ))}
          </motion.div>
        )}

        <VideoPlayer
          video={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={handleClosePlayer}
        />
      </div>
    </section>
  );
};
