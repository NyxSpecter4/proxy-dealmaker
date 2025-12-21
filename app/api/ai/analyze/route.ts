import { NextResponse } from 'next/server';
import { GenesisAIEngine } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const { repos } = await request.json();
    const engine = new GenesisAIEngine();
    
    const results: Record<string, any> = {};
    
    // Analyze each repo with AI
    for (const repo of repos) {
      try {
        const analysis = await engine.analyzeRepository(repo);
        results[repo.name] = analysis;
      } catch (error) {
        results[repo.name] = { error: 'Analysis failed', name: repo.name };
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      engine: 'GENESIS AI GPT-4',
      analyzed_at: new Date().toISOString(),
      repos_analyzed: repos.length
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'AI analysis failed',
      details: error.message,
      required: 'OPENAI_API_KEY in environment variables'
    }, { status: 500 });
  }
}