const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

export const searchYouTubeVideos = async (query: string) => {
  const response = await fetch(
    `/api/youtube/search?q=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search videos');
  }
  
  return response.json();
};

export const sendContactForm = async (data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
};
