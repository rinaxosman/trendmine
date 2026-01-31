import { supabase } from "@/integrations/supabase/client";
import type { TimeWindow, Location, TrendSignal, IdeasResponse } from "@/types/trendmine";

interface FetchTrendsParams {
  timeWindow: TimeWindow;
  location: Location;
  subreddits: string[];
  socialKeywords: string[];
}

interface TrendsResponse {
  signals: TrendSignal[];
  warnings: string[];
}

export async function fetchTrendSignals(params: FetchTrendsParams): Promise<TrendsResponse> {
  const { data, error } = await supabase.functions.invoke('fetch-trends', {
    body: params,
  });

  if (error) {
    console.error('Error fetching trends:', error);
    throw new Error(error.message || 'Failed to fetch trend signals');
  }

  return data as TrendsResponse;
}

export async function generateIdeas(signals: TrendSignal[]): Promise<IdeasResponse> {
  const { data, error } = await supabase.functions.invoke('generate-ideas', {
    body: { signals },
  });

  if (error) {
    console.error('Error generating ideas:', error);
    throw new Error(error.message || 'Failed to generate ideas');
  }

  return data as IdeasResponse;
}
