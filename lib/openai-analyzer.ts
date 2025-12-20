import { OpenAI } from 'openai';

export class RepoAnalyzer {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  async analyzeRepo(repoName: string, repoData: any): Promise<{
    valueProposition: string;
    targetCustomers: string[];
    pricingRecommendation: string;
    keyFeatures: string[];
  }> {
    const prompt = `
    Analyze this GitHub repository for sale:
    Name: ${repoName}
    Description: ${repoData.description || 'No description'}
    Language: ${repoData.language || 'Unknown'}
    Stars: ${repoData.stargazers_count || 0}
    Size: ${repoData.size} KB
    
    Provide a sales analysis with:
    1. Value proposition (1 sentence)
    2. Target customer types (3 types)
    3. Pricing recommendation (contact-based, but suggest range)
    4. Key features to highlight (3-4 features)
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content || '';
    
    // Parse the response (simplified)
    return {
      valueProposition: analysis.split('1.')[1]?.split('2.')[0]?.trim() || 'High-value software solution',
      targetCustomers: ['Tech Startups', 'Enterprise Teams', 'Developers'],
      pricingRecommendation: 'Contact for custom quote',
      keyFeatures: ['Clean Architecture', 'TypeScript', 'Scalable Design']
    };
  }

  async generatePitch(repoName: string, analysis: any): Promise<string> {
    const prompt = `Create a sales pitch for ${repoName}: ${analysis.valueProposition}`;
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || 'This is a valuable software asset...';
  }
}
