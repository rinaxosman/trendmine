import { ArrowDown, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onTryNowClick: () => void;
}

export function HeroBanner({ onTryNowClick }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Idea Generator
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Turn Trending Topics into{' '}
            <span className="text-gradient-warm">Business Ideas</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            TrendMine scans Reddit, Google Trends, and social media to discover
            what people are talking about — then uses AI to generate actionable
            startup and side-hustle ideas just for you.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-warm text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Real-time Trends</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-warm text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-warm text-sm">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span>MVP Plans</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              size="lg"
              onClick={onTryNowClick}
              className="bg-gradient-accent hover:opacity-90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-warm-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Try It Now
              <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No sign-up required. Start generating ideas instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
