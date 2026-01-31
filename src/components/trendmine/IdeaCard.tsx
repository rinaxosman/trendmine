import { Copy, Download, Users, Target, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { BusinessIdea } from '@/types/trendmine';

interface IdeaCardProps {
  idea: BusinessIdea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const text = `
${idea.title}

Problem: ${idea.problem}
Who it helps: ${idea.whoItHelps}
Why now: ${idea.whyNow}

MVP Plan:
${idea.mvpPlan.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Keywords: ${idea.topKeywords.join(', ')}
Confidence: ${idea.confidenceScore}%
    `.trim();

    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(idea, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idea-${idea.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'JSON exported' });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{idea.title}</h3>
          <Badge className={getConfidenceColor(idea.confidenceScore)}>
            {idea.confidenceScore}%
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          {idea.theme}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {/* Problem */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target className="h-4 w-4" />
            Problem / Need
          </div>
          <p className="text-sm">{idea.problem}</p>
        </div>

        {/* Who it helps */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Who it helps
          </div>
          <p className="text-sm">{idea.whoItHelps}</p>
        </div>

        {/* Why now */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4" />
            Why now
          </div>
          <p className="text-sm">{idea.whyNow}</p>
        </div>

        {/* MVP Plan */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            MVP Plan
          </div>
          <ol className="space-y-1 text-sm list-decimal list-inside">
            {idea.mvpPlan.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1">
          {idea.platforms.map(platform => (
            <Badge key={platform} variant="secondary" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1">
          {idea.topKeywords.slice(0, 5).map(keyword => (
            <Badge key={keyword} variant="outline" className="text-xs">
              #{keyword}
            </Badge>
          ))}
        </div>

        {/* Evidence */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground">Evidence:</p>
          <ul className="space-y-1">
            {idea.evidence.slice(0, 3).map((ev, i) => (
              <li key={i} className="text-xs text-muted-foreground truncate">
                • {ev}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={exportJson}>
            <Download className="h-3 w-3 mr-1" />
            JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
