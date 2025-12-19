import OpenAI from 'openai'
import { AnalysisMetrics } from './analyzer'

export interface RepositoryAnalysisData {
  name: string
  description: string | null
  primaryLanguage: string
  totalLinesOfCode: number
  createdAt: string
  stars: number
  forks: number
  contributors: number
  metrics: AnalysisMetrics
}

export interface AINarrativeOptions {
  tone?: 'professional' | 'casual' | 'technical' | 'investor'
  length?: 'short' | 'medium' | 'detailed'
  focus?: 'technical' | 'business' | 'community' | 'all'
  includeRecommendations?: boolean
}

export class OpenAIService {
  private openai: OpenAI | null = null
  private enabled: boolean = false

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY
    if (key) {
      this.openai = new OpenAI({ apiKey: key })
      this.enabled = true
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  async generateRepositoryNarrative(
    repoData: RepositoryAnalysisData,
    options: AINarrativeOptions = {}
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI service not initialized. Please provide an API key.')
    }

    const prompt = this.buildPrompt(repoData, options)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(options)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: this.getMaxTokens(options.length),
        ...this.getAdditionalParams(options)
      })
      
      return response.choices[0]?.message?.content || this.generateFallbackNarrative(repoData)
      
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.generateFallbackNarrative(repoData)
    }
  }

  async generateComparativeAnalysis(
    repositories: RepositoryAnalysisData[],
    options: AINarrativeOptions = {}
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI service not initialized.')
    }

    const prompt = this.buildComparativePrompt(repositories, options)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional investment analyst comparing multiple software projects. Provide clear, data-driven comparative insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
      
      return response.choices[0]?.message?.content || 'Comparative analysis unavailable.'
      
    } catch (error) {
      console.error('OpenAI API error:', error)
      return 'Comparative analysis could not be generated.'
    }
  }

  async generateInvestmentThesis(
    repoData: RepositoryAnalysisData,
    options: AINarrativeOptions = {}
  ): Promise<{
    thesis: string
    strengths: string[]
    risks: string[]
    opportunity: string
  }> {
    if (!this.openai) {
      return this.generateFallbackInvestmentThesis(repoData)
    }

    const prompt = `
Generate a comprehensive investment thesis for the GitHub repository "${repoData.name}".

Repository Data:
- Description: ${repoData.description || 'No description'}
- Primary Language: ${repoData.primaryLanguage}
- Size: ${repoData.totalLinesOfCode} lines of code
- Created: ${repoData.createdAt}
- Stars: ${repoData.stars}
- Forks: ${repoData.forks}
- Contributors: ${repoData.contributors}

Metrics:
- Activity Score: ${repoData.metrics.activity.score}/100
- Community Score: ${repoData.metrics.community.score}/100
- Code Health Score: ${repoData.metrics.codeHealth.score}/100
- Business Potential Score: ${repoData.metrics.businessPotential.score}/100

Please provide a structured response with the following sections:
1. Investment Thesis (2-3 sentences summarizing the opportunity)
2. Key Strengths (bullet points)
3. Key Risks (bullet points)
4. Market Opportunity (1-2 sentences)

Format the response as JSON with keys: thesis, strengths, risks, opportunity.
`

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an investment analyst specializing in technology startups. Provide structured, data-driven analysis in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
      
      const content = response.choices[0]?.message?.content
      if (content) {
        try {
          return JSON.parse(content)
        } catch (e) {
          console.error('Failed to parse OpenAI JSON response:', e)
        }
      }
      
    } catch (error) {
      console.error('OpenAI API error:', error)
    }
    
    return this.generateFallbackInvestmentThesis(repoData)
  }

  private buildPrompt(repoData: RepositoryAnalysisData, options: AINarrativeOptions): string {
    const { tone = 'professional', focus = 'all' } = options
    
    let focusInstructions = ''
    switch (focus) {
      case 'technical':
        focusInstructions = 'Focus on the technical architecture, code quality, and development practices.'
        break
      case 'business':
        focusInstructions = 'Focus on commercial potential, market fit, and business model opportunities.'
        break
      case 'community':
        focusInstructions = 'Focus on community engagement, contributor ecosystem, and adoption metrics.'
        break
      case 'all':
        focusInstructions = 'Provide a balanced analysis covering technical, business, and community aspects.'
        break
    }
    
    return `
Analyze this GitHub repository for a potential investor showcase:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description'}
- Primary Language: ${repoData.primaryLanguage}
- Size: ${repoData.totalLinesOfCode} lines of code
- Created: ${repoData.createdAt}
- Stars: ${repoData.stars}
- Forks: ${repoData.forks}
- Contributors: ${repoData.contributors}
- Activity Score: ${repoData.metrics.activity.score}/100
- Community Score: ${repoData.metrics.community.score}/100
- Code Health Score: ${repoData.metrics.codeHealth.score}/100
- Business Potential Score: ${repoData.metrics.businessPotential.score}/100

Based ONLY on this data, generate a concise, ${tone} investment thesis. Do NOT mention build time. ${focusInstructions}

Keep the response under 300 words.
`
  }

  private buildComparativePrompt(repositories: RepositoryAnalysisData[], options: AINarrativeOptions): string {
    const repoSummaries = repositories.map((repo, index) => `
Repository ${index + 1}: ${repo.name}
- Description: ${repo.description || 'No description'}
- Language: ${repo.primaryLanguage}
- Size: ${repo.totalLinesOfCode} LOC
- Stars: ${repo.stars}, Forks: ${repo.forks}, Contributors: ${repo.contributors}
- Activity: ${repo.metrics.activity.score}/100
- Community: ${repo.metrics.community.score}/100
- Code Health: ${repo.metrics.codeHealth.score}/100
- Business Potential: ${repo.metrics.businessPotential.score}/100
`).join('\n')

    return `
Compare these GitHub repositories for investment potential:

${repoSummaries}

Provide a comparative analysis that:
1. Identifies the strongest project overall and why
2. Highlights each project's unique strengths
3. Points out potential risks for each
4. Recommends which project(s) are most suitable for acquisition vs investment vs partnership
5. Suggests a strategic approach for engaging with these projects

Format your response in clear sections with bullet points where appropriate.
`
  }

  private getSystemPrompt(options: AINarrativeOptions): string {
    const { tone = 'professional' } = options
    
    switch (tone) {
      case 'professional':
        return 'You are a professional investment analyst specializing in technology startups and open source projects. Provide clear, data-driven insights.'
      case 'casual':
        return 'You are a tech-savvy analyst explaining project potential to non-technical stakeholders. Use accessible language.'
      case 'technical':
        return 'You are a senior software architect analyzing technical projects. Focus on architecture, code quality, and technical decisions.'
      case 'investor':
        return 'You are a venture capital partner evaluating technology investments. Focus on market opportunity, team, and financial potential.'
      default:
        return 'You are a professional investment analyst specializing in technology startups and open source projects. Provide clear, data-driven insights.'
    }
  }

  private getMaxTokens(length?: string): number {
    switch (length) {
      case 'short': return 300
      case 'medium': return 500
      case 'detailed': return 800
      default: return 500
    }
  }

  private getAdditionalParams(options: AINarrativeOptions): any {
    const params: any = {}
    
    if (options.tone === 'technical') {
      params.temperature = 0.5 // More deterministic for technical analysis
    } else if (options.tone === 'investor') {
      params.temperature = 0.8 // More creative for investment insights
    }
    
    return params
  }

  private generateFallbackNarrative(repoData: RepositoryAnalysisData): string {
    const strengths: string[] = []
    const risks: string[] = []
    
    if (repoData.metrics.activity.score > 70) {
      strengths.push('high development activity')
    } else if (repoData.metrics.activity.score < 40) {
      risks.push('limited recent development activity')
    }
    
    if (repoData.metrics.community.score > 70) {
      strengths.push('strong community engagement')
    } else if (repoData.metrics.community.score < 40) {
      risks.push('limited community adoption')
    }
    
    if (repoData.metrics.codeHealth.score > 70) {
      strengths.push('good code health and maintenance')
    } else if (repoData.metrics.codeHealth.score < 40) {
      risks.push('potential code quality concerns')
    }
    
    if (repoData.metrics.businessPotential.score > 70) {
      strengths.push('strong business potential')
    } else if (repoData.metrics.businessPotential.score < 40) {
      risks.push('limited commercial viability')
    }
    
    const strengthText = strengths.length > 0 
      ? `Key strengths include ${strengths.join(', ')}. `
      : ''
    
    const riskText = risks.length > 0
      ? `Areas for consideration include ${risks.join(', ')}. `
      : ''
    
    return `${repoData.name} is a ${repoData.primaryLanguage} project with ${repoData.totalLinesOfCode} lines of code, created in ${new Date(repoData.createdAt).getFullYear()}. ${strengthText}${riskText}The project has attracted ${repoData.stars} stars and ${repoData.forks} forks with contributions from ${repoData.contributors} developers.`
  }

  private generateFallbackInvestmentThesis(repoData: RepositoryAnalysisData): {
    thesis: string
    strengths: string[]
    risks: string[]
    opportunity: string
  } {
    const strengths: string[] = []
    const risks: string[] = []
    
    if (repoData.metrics.activity.score > 70) strengths.push('Active development with regular contributions')
    if (repoData.metrics.community.score > 70) strengths.push('Strong community adoption and engagement')
    if (repoData.metrics.codeHealth.score > 70) strengths.push('Well-maintained codebase with good practices')
    if (repoData.metrics.businessPotential.score > 70) strengths.push('High commercial potential in target market')
    
    if (repoData.metrics.activity.score < 40) risks.push('Limited recent development activity')
    if (repoData.metrics.community.score < 40) risks.push('Small community with limited adoption')
    if (repoData.metrics.codeHealth.score < 40) risks.push('Code quality and maintenance concerns')
    if (repoData.metrics.businessPotential.score < 40) risks.push('Unclear commercial viability')
    
    const thesis = `${repoData.name} represents a ${repoData.primaryLanguage}-based project with ${repoData.totalLinesOfCode} lines of code. ${strengths.length > 0 ? 'Key strengths suggest potential for growth.' : 'The project shows foundational work with room for development.'}`
    
    const opportunity = `Opportunity exists in the ${repoData.primaryLanguage} ecosystem with ${repoData.stars} stars indicating market interest.`
    
    return {
      thesis,
      strengths: strengths.length > 0 ? strengths : ['Foundational technology with growth potential'],
      risks: risks.length > 0 ? risks : ['Standard risks associated with open source projects'],
      opportunity
    }
  }
}