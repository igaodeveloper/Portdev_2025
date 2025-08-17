import { useState, useCallback, useEffect } from 'react';
import { YouTubeSearchResult, Video, YouTubeVideoDetails } from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const SEARCH_HISTORY_KEY = 'youtube_search_history';
const MAX_HISTORY_ITEMS = 10;

interface SearchFilters {
  sortBy: 'relevance' | 'date' | 'viewCount' | 'rating' | 'title';
  duration?: 'short' | 'medium' | 'long' | 'any';
  hd?: boolean;
  captions?: boolean;
  pageToken?: string;
}

interface SearchResult {
  videos: Video[];
  nextPageToken?: string;
  prevPageToken?: string;
  totalResults: number;
}

export const useYouTubeSearch = () => {
  const [searchResult, setSearchResult] = useState<SearchResult>({
    videos: [],
    totalResults: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [lastSearch, setLastSearch] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Omit<SearchFilters, 'pageToken'>>({
    sortBy: 'relevance',
    duration: 'any',
    hd: false,
    captions: false,
  });

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Format duration from YouTube format to human readable
  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match?.[1] || '').replace('H', '');
    const minutes = (match?.[2] || '').replace('M', '');
    const seconds = (match?.[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  };

  // Format count to K/M format
  const formatCount = (count: string): string => {
    const num = parseInt(count);
    if (isNaN(num)) return '0';
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Update search history
  const updateSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory(prev => {
      // Remove duplicate and limit history size
      const newHistory = [
        query,
        ...prev.filter(item => item.toLowerCase() !== query.toLowerCase())
      ].slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }
      
      return newHistory;
    });
  }, []);

  // Search videos function
  const searchVideos = useCallback(async (
    query: string, 
    filters: Omit<SearchFilters, 'pageToken'> = currentFilters,
    pageToken?: string
  ) => {
    if (!query.trim()) {
      setSearchResult({ videos: [], totalResults: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    if (pageToken) {
      // Keep the last search when loading more pages
      setLastSearch(prev => prev || query);
    } else if (query !== lastSearch) {
      setLastSearch(query);
      updateSearchHistory(query);
    }

    try {
      // Build URL parameters
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: '12',
        key: YOUTUBE_API_KEY,
        order: filters.sortBy,
        videoDefinition: filters.hd ? 'high' : 'any',
        videoCaption: filters.captions ? 'closedCaption' : 'any',
        ...(pageToken && { pageToken }),
      });

      // Add duration filter if specified
      if (filters.duration && filters.duration !== 'any') {
        // Ensure we use English values for the YouTube API
        const durationMap: Record<string, string> = {
          'short': 'short',
          'medium': 'medium',
          'long': 'long',
          'longa': 'long',  // Handle Portuguese variant
          'curta': 'short', // Handle Portuguese variant
          'média': 'medium' // Handle Portuguese variant
        };
        
        const englishDuration = durationMap[filters.duration] || filters.duration;
        params.set('videoDuration', englishDuration);
      }

      // Make the search request
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        const errorData = await searchResponse.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch videos');
      }

      const searchData: YouTubeSearchResult = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        setSearchResult(prev => ({
          ...prev,
          videos: [],
          nextPageToken: undefined,
          prevPageToken: undefined,
          totalResults: 0
        }));
        return;
      }

      // Get video details
      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);

      if (!detailsResponse.ok) {
        throw new Error('Failed to fetch video details');
      }

      const detailsData: YouTubeVideoDetails = await detailsResponse.json();
      
      // Format video data
      const formattedVideos: Video[] = searchData.items.map((item) => {
        const details = detailsData.items.find(d => d.id === item.id.videoId);
        const viewCount = details?.statistics?.viewCount || '0';
        const duration = details?.contentDetails?.duration || 'PT0M0S';
        const likeCount = details?.statistics?.likeCount || '0';
        const commentCount = details?.statistics?.commentCount || '0';
        const snippet = details?.snippet || item.snippet;

        return {
          id: item.id.videoId,
          channelId: snippet.channelId,
          title: snippet.title,
          channelTitle: snippet.channelTitle,
          description: snippet.description,
          thumbnail: snippet.thumbnails.high?.url || 
                    snippet.thumbnails.medium?.url || 
                    snippet.thumbnails.default?.url || '',
          duration: formatDuration(duration),
          views: formatCount(viewCount),
          likes: formatCount(likeCount),
          comments: formatCount(commentCount),
          publishedAt: new Date(snippet.publishedAt).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          channelThumbnail: snippet.thumbnails.default?.url || '',
        };
      });

      setSearchResult(prev => ({
        videos: pageToken ? [...prev.videos, ...formattedVideos] : formattedVideos,
        nextPageToken: searchData.nextPageToken,
        prevPageToken: searchData.prevPageToken,
        totalResults: searchData.pageInfo?.totalResults || 0,
      }));
    } catch (err) {
      console.error('Error searching videos:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSearchResult(prev => ({
        ...prev,
        videos: []
      }));
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters, lastSearch, updateSearchHistory]);

  // Load next/previous page
  const loadNextPage = useCallback(() => {
    if (searchResult.nextPageToken && lastSearch) {
      searchVideos(lastSearch, currentFilters, searchResult.nextPageToken);
    }
  }, [lastSearch, currentFilters, searchResult.nextPageToken, searchVideos]);

  const loadPrevPage = useCallback(() => {
    if (searchResult.prevPageToken && lastSearch) {
      searchVideos(lastSearch, currentFilters, searchResult.prevPageToken);
    }
  }, [lastSearch, currentFilters, searchResult.prevPageToken, searchVideos]);

  // Update filters and trigger new search
  const updateFilters = useCallback((newFilters: Omit<SearchFilters, 'pageToken'>) => {
    setCurrentFilters(newFilters);
    if (lastSearch) {
      searchVideos(lastSearch, newFilters);
    }
  }, [lastSearch, searchVideos]);

  return { 
    videos: searchResult.videos, 
    searchVideos, 
    isLoading, 
    error, 
    lastSearch,
    searchHistory,
    currentFilters,
    setCurrentFilters: updateFilters,
    hasNextPage: !!searchResult.nextPageToken,
    hasPrevPage: !!searchResult.prevPageToken,
    loadNextPage: searchResult.nextPageToken ? loadNextPage : undefined,
    loadPrevPage: searchResult.prevPageToken ? loadPrevPage : undefined,
    totalResults: searchResult.totalResults,
  };
};
