import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchTrendSignals, generateIdeas } from '@/lib/api/trendmine';
import type { TimeWindow, Location, TrendSignal, BusinessIdea, IdeasResponse } from '@/types/trendmine';
import { DEFAULT_SUBREDDITS } from '@/types/trendmine';

const STORAGE_KEY = 'trendmine_results';

interface StoredResults {
  ideas: BusinessIdea[];
  warnings: string[];
  generatedAt: string;
  params: {
    timeWindow: TimeWindow;
    location: Location;
    subreddits: string[];
    socialKeywords: string[];
  };
}

export function useTrendMine() {
  const { toast } = useToast();
  
  // Form state
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('7d');
  const [location, setLocation] = useState<Location>('US');
  const [subreddits, setSubreddits] = useState<string[]>(DEFAULT_SUBREDDITS);
  const [socialKeywords, setSocialKeywords] = useState<string>('');
  
  // Results state
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [signals, setSignals] = useState<TrendSignal[]>([]);
  
  // Loading states
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Load cached results on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredResults = JSON.parse(stored);
        setIdeas(data.ideas);
        setWarnings(data.warnings);
        setTimeWindow(data.params.timeWindow);
        setLocation(data.params.location);
        setSubreddits(data.params.subreddits);
        setSocialKeywords(data.params.socialKeywords.join(', '));
      }
    } catch (e) {
      console.error('Failed to load cached results:', e);
    }
  }, []);

  // Save results to localStorage
  const saveResults = useCallback((ideasData: IdeasResponse, params: StoredResults['params']) => {
    try {
      const toStore: StoredResults = {
        ideas: ideasData.ideas,
        warnings: ideasData.warnings,
        generatedAt: ideasData.generatedAt,
        params,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.error('Failed to cache results:', e);
    }
  }, []);

  const parseSocialKeywords = useCallback((): string[] => {
    return socialKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
  }, [socialKeywords]);

  const refreshData = useCallback(async () => {
    setIsFetchingTrends(true);
    setWarnings([]);
    
    try {
      const keywords = parseSocialKeywords();
      const result = await fetchTrendSignals({
        timeWindow,
        location,
        subreddits,
        socialKeywords: keywords,
      });
      
      setSignals(result.signals);
      if (result.warnings.length > 0) {
        setWarnings(result.warnings);
        toast({
          title: 'Partial data fetched',
          description: result.warnings.join('. '),
          variant: 'default',
        });
      } else {
        toast({
          title: 'Data refreshed',
          description: `Fetched ${result.signals.length} trend signals`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error fetching trends',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingTrends(false);
    }
  }, [timeWindow, location, subreddits, parseSocialKeywords, toast]);

  const generate = useCallback(async () => {
    // First refresh data if no signals
    let currentSignals = signals;
    
    if (currentSignals.length === 0) {
      setIsFetchingTrends(true);
      try {
        const keywords = parseSocialKeywords();
        const result = await fetchTrendSignals({
          timeWindow,
          location,
          subreddits,
          socialKeywords: keywords,
        });
        currentSignals = result.signals;
        setSignals(result.signals);
        if (result.warnings.length > 0) {
          setWarnings(prev => [...prev, ...result.warnings]);
        }
      } catch (error) {
        toast({
          title: 'Error fetching trends',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
        setIsFetchingTrends(false);
        return;
      }
      setIsFetchingTrends(false);
    }

    if (currentSignals.length === 0) {
      toast({
        title: 'No trend data',
        description: 'Please add some social keywords or select subreddits',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingIdeas(true);
    try {
      const result = await generateIdeas(currentSignals);
      setIdeas(result.ideas);
      setWarnings(prev => [...prev, ...result.warnings]);
      
      // Cache results
      const keywords = parseSocialKeywords();
      saveResults(result, { timeWindow, location, subreddits, socialKeywords: keywords });
      
      toast({
        title: 'Ideas generated!',
        description: `Created ${result.ideas.length} business ideas from ${currentSignals.length} signals`,
      });
    } catch (error) {
      toast({
        title: 'Error generating ideas',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  }, [signals, timeWindow, location, subreddits, parseSocialKeywords, toast, saveResults]);

  const clearResults = useCallback(() => {
    setIdeas([]);
    setWarnings([]);
    setSignals([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // Form state
    timeWindow,
    setTimeWindow,
    location,
    setLocation,
    subreddits,
    setSubreddits,
    socialKeywords,
    setSocialKeywords,
    
    // Results
    ideas,
    warnings,
    signals,
    
    // Loading states
    isFetchingTrends,
    isGeneratingIdeas,
    isLoading: isFetchingTrends || isGeneratingIdeas,
    
    // Actions
    refreshData,
    generate,
    clearResults,
  };
}
