// this edge function takes trend signals and turns them into structured business ideas

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

interface BusinessIdea {
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

// short random id for each idea
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
// AI CODE BELOW
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { signals } = await req.json() as { signals: TrendSignal[] };
    
    if (!signals || signals.length === 0) {
      return new Response(
        JSON.stringify({ 
          ideas: [], 
          warnings: ['No trend signals provided'],
          generatedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GENERATOR_API_KEY = Deno.env.get('GENERATOR_API_KEY');
    if (!GENERATOR_API_KEY) {
      throw new Error('GENERATOR_API_KEY is not configured');
    }

    console.log(`Generating ideas from ${signals.length} signals`);

    // summary of the signals for the generator
    const signalSummary = signals.map(s => {
      let details = s.text;
      if (s.platform === 'reddit' && s.metadata.upvotes) {
        details += ` (${s.metadata.upvotes} upvotes, ${s.metadata.comments} comments, r/${s.metadata.subreddit})`;
      }
      if (s.platform === 'google_trends' && s.metadata.region) {
        details += ` (trending in ${s.metadata.region})`;
      }
      return `[${s.platform}] ${details}`;
    }).join('\n');

    const systemPrompt = `You are a business idea generator that analyzes real trend data to create actionable, ethical business ideas.

Your task:
1. Analyze the provided trend signals from Reddit, Google Trends, and TikTok/Instagram
2. Identify 3-6 distinct trend themes by clustering related signals
3. For each theme, generate 2 business ideas (total 6-12 ideas)
4. Ground each idea in the evidence from the signals

Requirements for each idea:
- Must be ethical and legitimate business
- Must be actionable as an MVP
- Must reference specific trend evidence
- Must explain why timing is right based on trends

Output a JSON object with this exact structure:
{
  "ideas": [
    {
      "title": "Short catchy business name/concept",
      "problem": "1-2 sentences describing the problem/need",
      "whoItHelps": "Target audience description",
      "whyNow": "Why this is timely, referencing specific trend evidence",
      "mvpPlan": ["Step 1", "Step 2", "Step 3"],
      "platforms": ["Reddit", "Google Trends", "TikTok/IG"],
      "topKeywords": ["keyword1", "keyword2", "keyword3"],
      "evidence": ["Specific signal quote 1", "Specific signal quote 2"],
      "confidenceScore": 75,
      "theme": "Theme name this idea belongs to"
    }
  ]
}

Only include platforms that actually contributed signals to the idea.
Confidence score should be 0-100 based on signal strength (upvotes, relevance, multiple sources).`;

    const userPrompt = `Here are the current trend signals to analyze:

${signalSummary}

Generate 6-12 business ideas based on these trends. Return ONLY the JSON object, no markdown or explanation.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GENERATOR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API credits exhausted, please add funds' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, parsing...');
    
    let parsedIdeas: { ideas: Omit<BusinessIdea, 'id'>[] };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      parsedIdeas = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse AI response:', e, content);
      throw new Error('Failed to parse AI response');
    }

    // Add IDs to each idea
    const ideas: BusinessIdea[] = parsedIdeas.ideas.map(idea => ({
      ...idea,
      id: generateId(),
    }));

    console.log(`Generated ${ideas.length} ideas`);

    return new Response(
      JSON.stringify({ 
        ideas, 
        warnings: [],
        generatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-ideas:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        ideas: [],
        warnings: ['Failed to generate ideas'],
        generatedAt: new Date().toISOString(),
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
