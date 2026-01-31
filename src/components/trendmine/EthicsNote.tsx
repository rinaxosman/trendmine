import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function EthicsNote() {
  return (

    // THIS NOTICE IS AI GENERATED 
    
    <Card className="bg-muted/50">
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Ethics Note</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              TrendMine only uses public data: Reddit posts from public subreddits, 
              Google Trends public search data, and user-provided TikTok/Instagram keywords. 
              We do not scrape private accounts, require logins, or access any private data. 
              All data collection follows platform terms of service.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
