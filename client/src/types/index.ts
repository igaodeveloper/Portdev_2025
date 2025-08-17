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
  channelId: string;
  channelTitle: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  comments: string;
  publishedAt: string;
  channelThumbnail: string;
  url?: string;
}

export interface YouTubeThumbnails {
  default: {
    url: string;
    width: number;
    height: number;
  };
  medium: {
    url: string;
    width: number;
    height: number;
  };
  high: {
    url: string;
    width: number;
    height: number;
  };
  standard?: {
    url: string;
    width: number;
    height: number;
  };
  maxres?: {
    url: string;
    width: number;
    height: number;
  };
}

export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: YouTubeThumbnails;
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
  }[];
}

export interface YouTubeVideoDetails {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    statistics: {
      viewCount: string;
      likeCount: string;
      dislikeCount: string;
      favoriteCount: string;
      commentCount: string;
    };
    contentDetails: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
      licensedContent: boolean;
      contentRating: Record<string, unknown>;
      projection: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
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
