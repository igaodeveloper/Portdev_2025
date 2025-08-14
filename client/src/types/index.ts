export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  detailedDescription: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  url?: string;
}

export interface YouTubeSearchResult {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        high: { url: string };
      };
      publishedAt: string;
    };
    statistics?: {
      viewCount: string;
    };
    contentDetails?: {
      duration: string;
    };
  }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export interface IDEFile {
  id: string;
  name: string;
  content: string;
  language: string;
  isActive: boolean;
}

export interface TerminalCommand {
  command: string;
  output: string;
  timestamp: Date;
}

export interface Skill {
  name: string;
  percentage: number;
  category: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  date: string;
}
