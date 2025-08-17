import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { Video } from '../types';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { FiSearch, FiFilter, FiX, FiClock, FiTrendingUp, FiStar } from 'react-icons/fi';
import { debounce } from 'lodash';

export const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    sortBy: 'relevance' | 'date' | 'viewCount' | 'rating' | 'title';
    duration: 'any' | 'short' | 'medium' | 'long';
    hd: boolean;
    captions: boolean;
  }>({
    sortBy: 'relevance',
    duration: 'any',
    hd: false,
    captions: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { videos, searchVideos, isLoading, error, lastSearch } = useYouTubeSearch();

  // Carrega vídeos iniciais e buscas recentes
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Busca inicial
    searchVideos('programming tutorials', {
      sortBy: 'relevance',
      duration: 'any',
      hd: false,
      captions: false
    });
  }, []);

  // Salva buscas recentes
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item.toLowerCase() !== query.toLowerCase())
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Busca com debounce
  const debouncedSearch = useRef(
    debounce((query: string, currentFilters: typeof filters) => {
      if (query.trim()) {
        searchVideos(query, {
          sortBy: currentFilters.sortBy,
          duration: currentFilters.duration as 'any' | 'short' | 'medium' | 'long',
          hd: currentFilters.hd,
          captions: currentFilters.captions
        });
        saveSearch(query);
      }
    }, 800)
  ).current;

  // Atualiza a busca quando a query ou filtros mudam
  useEffect(() => {
    if (searchQuery.trim() || lastSearch) {
      debouncedSearch(searchQuery || lastSearch, filters);
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery, filters, lastSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos(searchQuery, {
        sortBy: filters.sortBy,
        duration: filters.duration as 'any' | 'short' | 'medium' | 'long',
        hd: filters.hd,
        captions: filters.captions
      });
      saveSearch(searchQuery);
    } else if (lastSearch) {
      searchVideos(lastSearch, {
        sortBy: filters.sortBy,
        duration: filters.duration as 'any' | 'short' | 'medium' | 'long',
        hd: filters.hd,
        captions: filters.captions
      });
    }
  };

  const handleOpenPlayer = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchVideos('programming tutorials', {
      sortBy: 'relevance',
      duration: 'any',
      hd: false,
      captions: false
    });
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const applyFilter = (
    filterType: 'sortBy' | 'duration' | 'hd' | 'captions', 
    value: string | boolean
  ) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    } as const;
    
    setFilters(newFilters);
    
    // Se houver uma busca ativa, refaz a busca com os novos filtros
    const searchFilters = {
      sortBy: newFilters.sortBy,
      duration: newFilters.duration as 'any' | 'short' | 'medium' | 'long',
      hd: newFilters.hd,
      captions: newFilters.captions
    };
    
    if (searchQuery.trim()) {
      searchVideos(searchQuery, searchFilters);
    } else if (lastSearch) {
      searchVideos(lastSearch, searchFilters);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <motion.section 
      className="min-h-screen py-20 pt-32 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-pink">
            Video Library
          </h1>
          <p className="text-xl text-cosmic-gray max-w-2xl mx-auto">
            Explore tutoriais e conteúdos sobre programação, design e muito mais.
          </p>
        </motion.div>
        
        {/* Barra de Pesquisa Avançada */}
        <motion.div
          className="max-w-4xl mx-auto mb-12 relative"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cosmic-gray text-xl" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Pesquisar vídeos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-24 py-5 bg-cosmic-black/50 backdrop-blur-sm border-2 border-cosmic-purple/20 rounded-2xl text-white placeholder-cosmic-gray/70 focus:outline-none focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/30 transition-all duration-300 text-lg"
                data-testid="input-video-search"
                onFocus={() => setShowFilters(false)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 text-cosmic-gray hover:text-white transition-colors"
                  aria-label="Limpar busca"
                >
                  <FiX size={24} />
                </button>
              )}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button
                  type="button"
                  onClick={toggleFilters}
                  className={`p-2 rounded-xl transition-all duration-300 ${showFilters ? 'bg-cosmic-blue/20 text-cosmic-blue' : 'text-cosmic-gray hover:bg-cosmic-purple/20 hover:text-cosmic-purple'}`}
                  aria-label="Filtros"
                >
                  <FiFilter size={20} />
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white rounded-xl hover:shadow-lg hover:shadow-cosmic-purple/30 transition-all duration-300 flex items-center space-x-2"
                  data-testid="button-search-videos"
                >
                  <span>Pesquisar</span>
                </button>
              </div>
            </div>
          </form>

          {/* Filtros Avançados */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-4 p-6 bg-cosmic-black/50 backdrop-blur-lg border border-cosmic-purple/20 rounded-2xl shadow-xl"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiFilter className="mr-2" /> Filtros Avançados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-cosmic-gray mb-2">Ordenar por</h4>
                    <div className="flex flex-wrap gap-2">
                      {[/* eslint-disable @typescript-eslint/no-unused-vars */
                        { value: 'relevance', label: 'Relevância', icon: <FiStar size={16} /> },
                        { value: 'date', label: 'Data de publicação', icon: <FiClock size={16} /> },
                        { value: 'viewCount', label: 'Mais visualizados', icon: <FiTrendingUp size={16} /> },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => applyFilter('sortBy', item.value)}
                          className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all ${filters.sortBy === item.value ? 'bg-cosmic-blue/20 text-cosmic-blue' : 'bg-cosmic-black/50 text-cosmic-gray hover:bg-cosmic-purple/20'}`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  

                  <div>
                    <h4 className="text-sm font-medium text-cosmic-gray mb-2">Duração</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Qualquer', 'Curta (< 4min)', 'Média (4-20min)', 'Longa (> 20min)'].map((item) => {
                        const value = item.toLowerCase().split(' ')[0];
                        return (
                          <button
                            key={value}
                            onClick={() => applyFilter('duration', value === 'qualquer' ? 'any' : value)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${filters.duration === (value === 'qualquer' ? 'any' : value) ? 'bg-cosmic-purple/20 text-cosmic-purple' : 'bg-cosmic-black/50 text-cosmic-gray hover:bg-cosmic-purple/10'}`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sugestões de Busca */}
          {searchQuery && recentSearches.length > 0 && (
            <motion.div 
              className="absolute z-10 w-full mt-2 bg-cosmic-black/80 backdrop-blur-lg rounded-xl shadow-2xl border border-cosmic-purple/20 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="p-2">
                <h4 className="px-4 py-2 text-sm font-medium text-cosmic-gray">Buscas recentes</h4>
                {recentSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item);
                      searchVideos(item);
                      setShowFilters(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-cosmic-purple/10 rounded-lg transition-colors flex items-center"
                  >
                    <FiClock className="mr-2 text-cosmic-gray" size={16} />
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="inline-block relative">
              <div className="w-20 h-20 border-4 border-cosmic-purple/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-cosmic-purple border-r-cosmic-blue border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-lg text-cosmic-gray">Buscando vídeos incríveis...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="text-center py-16 bg-cosmic-black/50 backdrop-blur-sm rounded-2xl border border-red-500/20 p-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ocorreu um erro</h3>
            <p className="text-cosmic-gray mb-6">{error}</p>
            <button
              onClick={() => searchVideos(searchQuery || 'programming tutorials')}
              className="px-6 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white rounded-lg hover:shadow-lg hover:shadow-cosmic-purple/30 transition-all"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}

        {/* Videos Grid */}
        {!isLoading && !error && videos.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-cosmic-purple/10 rounded-full mb-6">
              <svg className="w-12 h-12 text-cosmic-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-cosmic-gray max-w-md mx-auto">
              Não encontramos vídeos correspondentes à sua busca. Tente termos diferentes ou verifique sua conexão.
            </p>
          </motion.div>
        )}

        {!isLoading && videos.length > 0 && (
          <>
            <motion.div
              className="mb-8 flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-white">
                Resultados para: <span className="text-cosmic-purple">{searchQuery || 'Destaques'}</span>
              </h3>
              <span className="text-sm text-cosmic-gray">{videos.length} vídeos encontrados</span>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <VideoCard
                      video={video}
                      onOpenPlayer={handleOpenPlayer}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Player de Vídeo */}
        <AnimatePresence>
          {isPlayerOpen && selectedVideo && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClosePlayer}
            >
              <motion.div
                className="relative w-full max-w-5xl bg-cosmic-black rounded-2xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClosePlayer}
                  className="absolute -top-12 right-0 text-white hover:text-cosmic-purple transition-colors z-10"
                  aria-label="Fechar player"
                >
                  <FiX size={32} />
                </button>
                <VideoPlayer
                  video={selectedVideo}
                  isOpen={isPlayerOpen}
                  onClose={handleClosePlayer}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
