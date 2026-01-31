import { useRef, useState } from 'react';
import { Navbar } from '@/components/trendmine/Navbar';
import { HeroBanner } from '@/components/trendmine/HeroBanner';
import { ControlPanel } from '@/components/trendmine/ControlPanel';
import { IdeasGrid } from '@/components/trendmine/IdeasGrid';
import { EthicsNote } from '@/components/trendmine/EthicsNote';
import { SignUpModal } from '@/components/trendmine/SignUpModal';
import { useTrendMine } from '@/hooks/useTrendMine';

const Index = () => {
  const appSectionRef = useRef<HTMLDivElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalIsLogin, setAuthModalIsLogin] = useState(false);

  const {
    timeWindow,
    setTimeWindow,
    location,
    setLocation,
    subreddits,
    setSubreddits,
    socialKeywords,
    setSocialKeywords,
    ideas,
    warnings,
    isFetchingTrends,
    isGeneratingIdeas,
    isLoading,
    refreshData,
    generate,
  } = useTrendMine();

  const scrollToApp = () => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        onSignUpClick={() => {
          setAuthModalIsLogin(false);
          setAuthModalOpen(true);
        }}
        onLogInClick={() => {
          setAuthModalIsLogin(true);
          setAuthModalOpen(true);
        }}
      />

      {/* Hero Banner */}
      <HeroBanner onTryNowClick={scrollToApp} />

      {/* Main App Section */}
      <main
        id="app"
        ref={appSectionRef}
        className="container mx-auto px-4 py-12 md:py-16 space-y-8"
      >
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Generate Your Ideas
          </h2>
          <p className="text-muted-foreground">
            Configure your trend sources below and let AI discover business opportunities for you.
          </p>
        </div>

        <ControlPanel
          timeWindow={timeWindow}
          setTimeWindow={setTimeWindow}
          location={location}
          setLocation={setLocation}
          subreddits={subreddits}
          setSubreddits={setSubreddits}
          socialKeywords={socialKeywords}
          setSocialKeywords={setSocialKeywords}
          onRefresh={refreshData}
          onGenerate={generate}
          isLoading={isLoading}
          isFetchingTrends={isFetchingTrends}
          isGeneratingIdeas={isGeneratingIdeas}
        />

        <IdeasGrid
          ideas={ideas}
          warnings={warnings}
          isLoading={isGeneratingIdeas}
        />

        <EthicsNote />
      </main>

      {/* Auth Modal */}
      <SignUpModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultIsLogin={authModalIsLogin}
      />
    </div>
  );
};

export default Index;
