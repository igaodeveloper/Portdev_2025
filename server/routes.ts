import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || '';

export async function registerRoutes(app: Express): Promise<Server> {
  // YouTube API proxy
  app.get('/api/youtube/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ error: 'YouTube API key not configured' });
      }

      // Search for videos
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q as string)}&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error('YouTube API search failed');
      }

      const searchData = await searchResponse.json();
      
      // Get additional video details
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      let detailsData = { items: [] };
      if (detailsResponse.ok) {
        detailsData = await detailsResponse.json();
      }

      // Combine search results with details
      const videos = searchData.items.map((item: any, index: number) => {
        const details = detailsData.items?.[index] || {};
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

      res.json({ videos });
    } catch (error) {
      console.error('YouTube API error:', error);
      res.status(500).json({ error: 'Failed to search videos' });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, projectType, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // In a real application, you would:
      // 1. Validate the email format
      // 2. Send the email using a service like SendGrid, Mailgun, or nodemailer
      // 3. Store the message in a database
      // 4. Send a confirmation email to the user

      console.log('Contact form submission:', {
        name,
        email,
        projectType,
        message,
        timestamp: new Date().toISOString(),
      });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.json({ 
        success: true, 
        message: 'Thank you for your message! I\'ll get back to you soon.' 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
