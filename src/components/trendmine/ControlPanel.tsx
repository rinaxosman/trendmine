import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubredditSelect } from './SubredditSelect';
import type { TimeWindow, Location } from '@/types/trendmine';

interface ControlPanelProps {
  timeWindow: TimeWindow;
  setTimeWindow: (val: TimeWindow) => void;
  location: Location;
  setLocation: (val: Location) => void;
  subreddits: string[];
  setSubreddits: (val: string[]) => void;
  socialKeywords: string;
  setSocialKeywords: (val: string) => void;
  onRefresh: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  isFetchingTrends: boolean;
  isGeneratingIdeas: boolean;
}

export function ControlPanel({
  timeWindow,
  setTimeWindow,
  location,
  setLocation,
  subreddits,
  setSubreddits,
  socialKeywords,
  setSocialKeywords,
  onRefresh,
  onGenerate,
  isLoading,
  isFetchingTrends,
  isGeneratingIdeas,
}: ControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trend configuration</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Time Window</Label>
            <Select value={timeWindow} onValueChange={(v) => setTimeWindow(v as TimeWindow)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={(v) => setLocation(v as Location)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="worldwide">Worldwide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Subreddits */}
        <div className="space-y-2">
          <Label>Reddit Subreddits</Label>
          <SubredditSelect value={subreddits} onChange={setSubreddits} />
        </div>

        {/* TikTok/IG Keywords */}
        <div className="space-y-2">
          <Label>TikTok / Instagram Keywords</Label>
          <Textarea
            placeholder="meal prep, modest fashion, ottawa food, skincare..."
            value={socialKeywords}
            onChange={(e) => setSocialKeywords(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Enter up to 10 keywords or hashtags, (comma separated)
          </p>
        </div>

        {/*BUuttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingTrends ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          
          <Button
            onClick={onGenerate}
            disabled={isLoading}
          >
            <Sparkles className={`mr-2 h-4 w-4 ${isGeneratingIdeas ? 'animate-pulse' : ''}`} />
            {isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
