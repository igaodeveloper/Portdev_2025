import { useState, useCallback } from 'react';
import { YouTubeSearchResult, Video, YouTubeVideoDetails } from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

interface SearchFilters {
  sortBy: 'relevance' | 'date' | 'viewCount' | 'rating' | 'title';
  duration?: 'short' | 'medium' | 'long' | 'any';
  hd?: boolean;
  captions?: boolean;
}

export const useYouTubeSearch = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState('');

  const searchVideos = useCallback(async (query: string, filters: SearchFilters = {
    sortBy: 'relevance',
    duration: 'any',
    hd: false,
    captions: false,
  }) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setLastSearch(query);

    try {
      // Construir parâmetros da URL
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: '12',
        key: YOUTUBE_API_KEY,
        order: filters.sortBy,
        videoDefinition: filters.hd ? 'high' : 'any',
        videoCaption: filters.captions ? 'closedCaption' : 'any',
      });

      // Adicionar filtro de duração se especificado
      if (filters.duration && filters.duration !== 'any') {
        switch (filters.duration) {
          case 'short':
            params.set('videoDuration', 'short');
            break;
          case 'medium':
            params.set('videoDuration', 'medium');
            break;
          case 'long':
            params.set('videoDuration', 'long');
            break;
        }
      }

      // Fazer a busca
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json().catch(() => ({}));
        console.error('Erro na busca:', errorData);
        throw new Error(errorData.error?.message || 'Falha ao buscar vídeos');
      }

      const searchData: YouTubeSearchResult = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        setVideos([]);
        return;
      }

      // Obter detalhes adicionais dos vídeos
      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);

      if (!detailsResponse.ok) {
        throw new Error('Falha ao obter detalhes dos vídeos');
      }

      const detailsData: YouTubeVideoDetails = await detailsResponse.json();
      
      // Formatar os dados dos vídeos
      const formattedVideos: Video[] = searchData.items.map((item) => {
        const details = detailsData.items.find(d => d.id === item.id.videoId);
        const viewCount = details?.statistics?.viewCount || '0';
        const duration = details?.contentDetails?.duration || 'PT0M0S';
        const likeCount = details?.statistics?.likeCount || '0';
        const commentCount = details?.statistics?.commentCount || '0';

        // Converter duração do YouTube para formato legível
        const formatDuration = (duration: string) => {
          const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          const hours = (match?.[1] || '').replace('H', '');
          const minutes = (match?.[2] || '').replace('M', '');
          const seconds = (match?.[3] || '').replace('S', '');
          
          if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
          }
          return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
        };

        // Formatar contagem de visualizações
        const formatCount = (count: string) => {
          const num = parseInt(count);
          if (isNaN(num)) return '0';
          
          if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
          } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
          }
          return num.toString();
        };

        return {
          id: item.id.videoId,
          channelId: item.snippet.channelId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          duration: formatDuration(duration),
          views: formatCount(viewCount),
          likes: formatCount(likeCount),
          comments: formatCount(commentCount),
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          channelThumbnail: item.snippet.thumbnails.default?.url,
        };
      });

      setVideos(formattedVideos);
    } catch (err) {
      console.error('Erro ao buscar vídeos:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    videos, 
    searchVideos, 
    isLoading, 
    error, 
    lastSearch 
  };
};
