import OpenAI from 'openai';

export class GenesisAIEngine {
  private openai: OpenAI;

  constructor() {
    // USING YOUR VERCEL ENV VAR
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async analyzeRepository(repo: any) {
    console.log('🤖 GENESIS AI analyzing:', repo.name);
    
    const prompt = `
    As GENESIS AI, the intelligent software valuation AI, analyze this GitHub repository:
    
    REPOSITORY: ${repo.name}
    ${repo.description ? `DESCRIPTION: ${repo.description}` : ''}
    ${repo.language ? `PRIMARY LANGUAGE: ${repo.language}` : ''}
    
    IMPORTANT: Ignore commit count and GitHub stars. Focus on architectural complexity.
    
    Estimate the total Senior Engineering Hours required to build this specific architecture from scratch.
    Consider:
    - Codebase size and structure
    - Technical complexity and architecture
    - Integration points and dependencies
    - Testing and documentation requirements
    - Deployment and operational complexity
    
    Provide a comprehensive analysis including:
    1. Estimated engineering hours (number)
    2. Technical sophistication score (1-10)
    3. Market demand potential (1-10)
    4. Unique value proposition
    5. Ideal buyer profile
    6. Key selling points
    
    Format as JSON with these exact keys:
    - estimated_hours
    - technical_sophistication
    - market_demand_potential
    - unique_value_proposition
    - ideal_buyer_profile
    - key_selling_points
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const analysis = JSON.parse(response.choices[0].message.content!);
      
      // Calculate intelligent valuation based on engineering hours
      const estimatedHours = analysis.estimated_hours || 100;
      const hourlyRate = 125; // $125/hr for senior engineer
      let baseValue = estimatedHours * hourlyRate;
      
      // Apply strategic premium for cutting-edge tech
      const techScore = analysis.technical_sophistication || 5;
      const marketScore = analysis.market_demand_potential || 5;
      
      // Premium multiplier based on technical sophistication
      const techMultiplier = 1 + (techScore / 10); // 1.1x to 2x
      const marketMultiplier = 1 + (marketScore / 10); // 1.1x to 2x
      
      const adjustedValue = baseValue * techMultiplier * marketMultiplier;
      
      return {
        ...analysis,
        ai_valuation: `$${Math.round(adjustedValue).toLocaleString()}+`,
        base_engineering_value: `$${Math.round(baseValue).toLocaleString()}`,
        estimated_hours: estimatedHours,
        hourly_rate: hourlyRate,
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