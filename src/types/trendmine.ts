export type TimeWindow = '24h' | '7d' | '30d';
export type Location = 'CA' | 'US' | 'worldwide';

export interface TrendSignal {
  platform: 'reddit' | 'google_trends' | 'tiktok_ig';
  text: string;
  metadata: {
    upvotes?: number;
    comments?: number;
    subreddit?: string;
    url?: string;
    region?: string;
    relatedQueries?: string[];
  };
}

export interface BusinessIdea {
  id: string;
  title: string;
  problem: string;
  whoItHelps: string;
  whyNow: string;
  mvpPlan: string[];
  platforms: ('Reddit' | 'Google Trends' | 'TikTok/IG')[];
  topKeywords: string[];
  evidence: string[];
  confidenceScore: number;
  theme: string;
}

export interface IdeasResponse {
  ideas: BusinessIdea[];
  warnings: string[];
  generatedAt: string;
}

export const DEFAULT_SUBREDDITS = [
  'entrepreneurship',
  'smallbusiness', 
  'startups',
  'sidehustle',
  'marketing',
  'ecommerce',
  'technology'
];
