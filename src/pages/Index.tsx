import { Header } from '@/components/trendmine/Header';
import { ControlPanel } from '@/components/trendmine/ControlPanel';
import { IdeasGrid } from '@/components/trendmine/IdeasGrid';
import { EthicsNote } from '@/components/trendmine/EthicsNote';
import { useTrendMine } from '@/hooks/useTrendMine';

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
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
    </div>
  );
};

export default Index;
