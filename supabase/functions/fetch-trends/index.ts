// this function fetches public reddit and google trends signals and returns them as one list

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface TrendSignal {
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

interface FetchParams {
  timeWindow: '24h' | '7d' | '30d';
  location: 'CA' | 'US' | 'worldwide';
  subreddits: string[];
  socialKeywords: string[];
}

// maps the ui time window to reddit's time filter values
function getTimeFilter(timeWindow: string): string {
  switch (timeWindow) {
    case '24h': return 'day';
    case '7d': return 'week';
    case '30d': return 'month';
    default: return 'week';
  }
}

// fetches top posts from each subreddit and converts them into signals
async function fetchRedditPosts(subreddits: string[], timeWindow: string): Promise<TrendSignal[]> {
  const signals: TrendSignal[] = [];
  const timeFilter = getTimeFilter(timeWindow);
  
  for (const subreddit of subreddits.slice(0, 7)) { // limit to 7 subreddits
    try {
      const url = `https://www.reddit.com/r/${subreddit}/top.json?t=${timeFilter}&limit=10`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TrendMine/1.0',
        },
      });
      
      if (!response.ok) {
        console.warn(`Failed to fetch r/${subreddit}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const posts = data?.data?.children || [];
      
      for (const post of posts) {
        const { title, ups, num_comments, selftext, permalink, subreddit: sub } = post.data;
        signals.push({
          platform: 'reddit',
          text: title + (selftext ? ` - ${selftext.slice(0, 200)}` : ''),
          metadata: {
            upvotes: ups,
            comments: num_comments,
            subreddit: sub,
            url: `https://reddit.com${permalink}`,
          },
        });
      }
      
      // small delay to avoid spamming requests
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`Error fetching r/${subreddit}:`, e);
    }
  }
  
  return signals;
}

// fetches daily trending searches from google trends rss and converts them into signals
async function fetchGoogleTrends(location: string): Promise<TrendSignal[]> {
  const signals: TrendSignal[] = [];
  
  try {
    const geoMap: Record<string, string> = {
      'CA': 'CA',
      'US': 'US',
      'worldwide': 'US', // fallback for worldwide
    };
    const geo = geoMap[location] || 'US';
    
    const url = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TrendMine/1.0',
      },
    });
    
    if (!response.ok) {
      console.warn(`Google Trends RSS failed: ${response.status}`);
      return signals;
    }
    
    const text = await response.text();
    
    // pulls the rss titles and keeps the first 15 trend items
    const titleMatches = text.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g);
    let count = 0;
    
    for (const match of titleMatches) {
      if (count >= 15) break; // limit results
      const title = match[1].trim();
      if (title && title !== 'Daily Search Trends') {
        signals.push({
          platform: 'google_trends',
          text: title,
          metadata: {
            region: location,
          },
        });
        count++;
      }
    }
    
    // grabs approx traffic values and attaches them to the matching trend items
    const trafficMatches = text.matchAll(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/g);
    const trafficArr = [...trafficMatches].map(m => m[1]);
    
    signals.forEach((signal, i) => {
      if (trafficArr[i]) {
        signal.metadata.relatedQueries = [trafficArr[i]];
      }
    });
    
  } catch (e) {
    console.error('Error fetching Google Trends:', e);
  }
  
  return signals;
}

// converts the user keywords into signals so the generator can use them
function processSocialKeywords(keywords: string[]): TrendSignal[] {
  return keywords.map(keyword => ({
    platform: 'tiktok_ig' as const,
    text: keyword.replace(/^#/, ''), // remove leading hashtag if present
    metadata: {},
  }));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: FetchParams = await req.json();
    const { timeWindow, location, subreddits, socialKeywords } = params;
    
    const warnings: string[] = [];
    let allSignals: TrendSignal[] = [];
    
    // fetch reddit and google trends in parallel, but keep going even if one fails
    const [redditSignals, trendsSignals] = await Promise.all([
      fetchRedditPosts(subreddits, timeWindow).catch(e => {
        console.error('Reddit fetch failed:', e);
        warnings.push('Reddit data fetch failed');
        return [] as TrendSignal[];
      }),
      fetchGoogleTrends(location).catch(e => {
        console.error('Google Trends fetch failed:', e);
        warnings.push('Google Trends data fetch failed');
        return [] as TrendSignal[];
      }),
    ]);
    
    const socialSignals = processSocialKeywords(socialKeywords);
    
    // combine everything into one signals list for the next step
    allSignals = [...redditSignals, ...trendsSignals, ...socialSignals];
    
    return new Response(
      JSON.stringify({ 
        signals: allSignals, 
        warnings 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in fetch-trends:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        signals: [],
        warnings: ['Failed to fetch trend data'],
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});