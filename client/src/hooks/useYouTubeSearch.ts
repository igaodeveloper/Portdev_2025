import { useState, useCallback } from 'react';
import { YouTubeSearchResult, Video } from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

export const useYouTubeSearch = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVideos = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to search videos');
      }

      const searchData: YouTubeSearchResult = await searchResponse.json();
      
      // Get additional video details
      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      if (!detailsResponse.ok) {
        throw new Error('Failed to get video details');
      }

      const detailsData = await detailsResponse.json();

      const formattedVideos: Video[] = searchData.items.map((item, index) => {
        const details = detailsData.items[index];
        const viewCount = details?.statistics?.viewCount || '0';
        const duration = details?.contentDetails?.duration || 'PT0M0S';

        // Convert YouTube duration format to readable format
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

        // Format view count
        const formatViews = (count: string) => {
          const num = parseInt(count);
          if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M views`;
          } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K views`;
          }
          return `${num} views`;
        };

        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          duration: formatDuration(duration),
          views: formatViews(viewCount),
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        };
      });

      setVideos(formattedVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { videos, searchVideos, isLoading, error };
};
