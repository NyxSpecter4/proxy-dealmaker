import OpenAI from 'openai';

export class KalaAIEngine {
  private openai: OpenAI;

  constructor() {
    // USING YOUR VERCEL ENV VAR
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async analyzeRepository(repo: any) {
    console.log('🤖 KALA.AI analyzing:', repo.name);
    
    const prompt = `
    As KALA.AI, the intelligent software valuation AI, analyze this repository:
    
    REPOSITORY: ${repo.name}
    ${repo.description ? `DESCRIPTION: ${repo.description}` : ''}
    ${repo.language ? `LANGUAGE: ${repo.language}` : ''}
    
    Provide a comprehensive analysis including:
    1. Technical sophistication (1-10)
    2. Market demand potential (1-10)
    3. Unique value proposition
    4. Ideal buyer profile
    5. Recommended pricing strategy
    6. Key selling points
    
    Format as JSON.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const analysis = JSON.parse(response.choices[0].message.content!);
      
      // Calculate intelligent valuation based on AI analysis
      const techScore = analysis.technical_sophistication || 5;
      const marketScore = analysis.market_demand_potential || 5;
      const baseValue = (techScore * marketScore * 1000) + 50000;
      
      return {
        ...analysis,
        ai_valuation: `$${baseValue.toLocaleString()}+`,
        confidence: (techScore + marketScore) / 2,
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return {
        error: 'AI analysis failed',
        message: 'Check OpenAI API key and configuration',
        ai_valuation: '$TBD',
        confidence: 0
      };
    }
  }

  async generateDynamicPitch(repo: any, analysis: any, buyerType: string) {
    const prompt = `
    Generate a compelling sales pitch for ${repo.name}.
    
    Analysis: ${JSON.stringify(analysis)}
    Target Buyer: ${buyerType}
    
    Create a 3-paragraph pitch that:
    1. Grabs attention with the unique value
    2. Explains technical advantages
    3. Calls to action with pricing
    
    Be persuasive and professional.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  }
}