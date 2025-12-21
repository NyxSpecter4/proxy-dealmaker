import { RoxyVoice } from '@/app/lib/roxy/voice-precise'
import { ProjectProfile } from './project-profile-analyzer'
import { generateMarketIntelligence, MarketIntelligenceData } from './intelligence/market-intelligence'

export interface PitchData {
  hook: string
  problem: string
  solution: string
  acquisition_case: string
  ask: string
  confidence_level: 'high' | 'medium' | 'low'
  target_audience: 'investors' | 'acquirers' | 'partners'
}

export interface CompetitiveAnalysis {
  marketMoat: string
  competitiveAdvantages: string[]
  whyThisWins: string[]
  marketPosition: 'leader' | 'contender' | 'niche' | 'emerging'
}

export class PitchEngine {
  constructor(private analysisData: ProjectProfile) {}

  generatePitchData(): PitchData {
    const profile = this.analysisData
    const metrics = profile.metrics
    const valuation = profile.valuation
    
    // Generate hook based on project characteristics
    const hooks = [
      `A ${profile.technicalSummary.primaryLanguage} powerhouse with ${profile.technicalSummary.stars.toLocaleString()} stars and serious acquisition potential`,
      `The ${profile.name} project: ${profile.tagline || 'A hidden gem in the open source ecosystem'}`,
      `We've identified ${profile.name} as a strategic asset with ${profile.technicalSummary.contributors} active contributors and proven community traction`,
      `${profile.name} represents a ${this.getMarketPosition(metrics.businessPotential.score)} position in the ${profile.technicalSummary.primaryLanguage} ecosystem`
    ]
    
    // Generate problem statement
    const problems = [
      `The market lacks a robust ${this.getProjectType(profile)} solution with ${profile.technicalSummary.primaryLanguage} at its core`,
      `Enterprises struggle with ${this.getProblemArea(profile)} despite increasing demand`,
      `Current solutions are fragmented, leaving room for a unified approach like ${profile.name}`,
      `The ${this.getIndustryFocus(profile)} sector needs better tooling, and ${profile.name} delivers exactly that`
    ]
    
    // Generate solution
    const solutions = [
      `providing a ${this.getSolutionType(metrics)} that addresses core industry pain points`,
      `offering ${this.getKeyFeature(profile)} with enterprise-grade reliability`,
      `delivering ${this.getValueProposition(metrics)} through its active community and proven architecture`,
      `solving ${this.getProblemArea(profile)} with ${profile.technicalSummary.totalLinesOfCode.toLocaleString()} lines of battle-tested code`
    ]
    
    // Generate acquisition case
    const acquisitionCases = [
      `this represents a talent acquisition opportunity with ${profile.technicalSummary.contributors} skilled developers`,
      `the technology stack aligns with current market trends and could accelerate a buyer's roadmap by 12-18 months`,
      `with ${profile.technicalSummary.stars.toLocaleString()} stars and ${profile.technicalSummary.forks.toLocaleString()} forks, this project has proven market validation`,
      `the codebase shows ${this.getCodeQuality(metrics.codeHealth.score)} with active maintenance, reducing integration risk`
    ]
    
    // Generate ask/recommendation
    const asks = [
      `a strategic acquisition in the ${this.getValuationRange(valuation.estimatedValue.medium)} range`,
      `an investment of ${this.getInvestmentAmount(valuation.estimatedValue.medium)} to accelerate growth`,
      `a partnership agreement to leverage the technology while maintaining community engagement`,
      `immediate due diligence with an option to acquire within ${this.getTimeline(metrics.activity.score)} months`
    ]
    
    return {
      hook: hooks[Math.floor(Math.random() * hooks.length)],
      problem: problems[Math.floor(Math.random() * problems.length)],
      solution: solutions[Math.floor(Math.random() * solutions.length)],
      acquisition_case: acquisitionCases[Math.floor(Math.random() * acquisitionCases.length)],
      ask: asks[Math.floor(Math.random() * asks.length)],
      confidence_level: this.getConfidenceLevel(metrics),
      target_audience: this.getTargetAudience(metrics)
    }
  }

  generateScript(): string {
    const pitchData = this.generatePitchData()
    const { technicalSummary, metrics } = this.analysisData
    
    return `
(Confident, analytical tone) "${pitchData.hook}"
      
Let's examine why this represents a strategic opportunity. 
First, the technical foundation: a ${technicalSummary.primaryLanguage} codebase 
comprising ${technicalSummary.totalLinesOfCode.toLocaleString()} lines of production logic.

Community metrics show ${technicalSummary.stars.toLocaleString()} stars, 
${technicalSummary.forks.toLocaleString()} forks, and ${technicalSummary.contributors} contributors—
clear signals of adoption and maintainer engagement.

The investment thesis is clear: ${pitchData.problem} 
This asset addresses it by ${pitchData.solution}.

Our analysis scores the project at:
• Activity: ${metrics.activity.score}/100 (${this.getActivityDescription(metrics.activity.score)})
• Community: ${metrics.community.score}/100 (${this.getCommunityDescription(metrics.community.score)})
• Code Health: ${metrics.codeHealth.score}/100 (${this.getHealthDescription(metrics.codeHealth.score)})
• Business Potential: ${metrics.businessPotential.score}/100 (${this.getBusinessDescription(metrics.businessPotential.score)})

From an acquisition standpoint, ${pitchData.acquisition_case}

Valuation estimates range from $${this.analysisData.valuation.estimatedValue.low.toLocaleString()} 
to $${this.analysisData.valuation.estimatedValue.high.toLocaleString()}, 
with a median of $${this.analysisData.valuation.estimatedValue.medium.toLocaleString()}.

I recommend ${pitchData.ask}

Confidence level: ${pitchData.confidence_level.toUpperCase()}
Target audience: ${pitchData.target_audience.toUpperCase()}
    `
  }

  async deliverPitch(): Promise<{ script: string; audioUrl: string; pitchData: PitchData; marketIntelligence: MarketIntelligenceData }> {
    const script = this.generateScript()
    const pitchData = this.generatePitchData()
    const marketIntelligence = generateMarketIntelligence(this.analysisData)
    
    try {
      const roxy = new RoxyVoice()
      const audioUrl = await roxy.speak(script)
      return { script, audioUrl, pitchData, marketIntelligence }
    } catch (error) {
      console.error('Failed to generate audio pitch:', error)
      // Return script without audio if TTS fails
      return { script, audioUrl: '', pitchData, marketIntelligence }
    }
  }

  generateCompetitiveAnalysis(): CompetitiveAnalysis {
    const marketIntelligence = generateMarketIntelligence(this.analysisData)
    return {
      marketMoat: marketIntelligence.competitiveEdge.marketMoat,
      competitiveAdvantages: marketIntelligence.competitiveEdge.competitiveAdvantages,
      whyThisWins: marketIntelligence.competitiveEdge.whyThisWins,
      marketPosition: marketIntelligence.competitiveEdge.marketPosition
    }
  }

  generateMarketIntelligence(): MarketIntelligenceData {
    return generateMarketIntelligence(this.analysisData)
  }

  // Helper methods for generating dynamic content
  private getMarketPosition(score: number): string {
    if (score > 80) return 'dominant'
    if (score > 60) return 'strong'
    if (score > 40) return 'competitive'
    return 'emerging'
  }

  private getProjectType(profile: ProjectProfile): string {
    const lang = profile.technicalSummary.primaryLanguage.toLowerCase()
    if (lang.includes('js') || lang.includes('ts')) return 'web development'
    if (lang.includes('python')) return 'data science'
    if (lang.includes('java')) return 'enterprise'
    if (lang.includes('go') || lang.includes('rust')) return 'systems programming'
    return 'software development'
  }

  private getProblemArea(profile: ProjectProfile): string {
    const name = profile.name.toLowerCase()
    if (name.includes('api') || name.includes('rest')) return 'API integration'
    if (name.includes('data') || name.includes('db')) return 'data management'
    if (name.includes('ui') || name.includes('front')) return 'user interface development'
    if (name.includes('auth') || name.includes('security')) return 'security implementation'
    return 'technical implementation'
  }

  private getSolutionType(metrics: any): string {
    if (metrics.businessPotential.score > 70) return 'commercial-grade solution'
    if (metrics.codeHealth.score > 70) return 'production-ready framework'
    if (metrics.community.score > 70) return 'community-driven platform'
    return 'technical solution'
  }

  private getKeyFeature(profile: ProjectProfile): string {
    if (profile.technicalSummary.contributors > 10) return 'collaborative development'
    if (profile.technicalSummary.stars > 100) return 'proven adoption'
    if (profile.technicalSummary.totalLinesOfCode > 10000) return 'comprehensive functionality'
    return 'focused capability'
  }

  private getValueProposition(metrics: any): string {
    const strengths = []
    if (metrics.activity.score > 70) strengths.push('active development')
    if (metrics.community.score > 70) strengths.push('strong community')
    if (metrics.codeHealth.score > 70) strengths.push('maintainable codebase')
    if (metrics.businessPotential.score > 70) strengths.push('market relevance')
    
    if (strengths.length > 0) {
      return strengths.join(' and ')
    }
    return 'foundational technology'
  }

  private getIndustryFocus(profile: ProjectProfile): string {
    const topics = profile.analysis.toLowerCase()
    if (topics.includes('ai') || topics.includes('ml')) return 'artificial intelligence'
    if (topics.includes('web') || topics.includes('app')) return 'web application'
    if (topics.includes('data') || topics.includes('analytics')) return 'data analytics'
    if (topics.includes('cloud') || topics.includes('devops')) return 'cloud infrastructure'
    return 'software development'
  }

  private getCodeQuality(score: number): string {
    if (score > 80) return 'excellent quality and maintainability'
    if (score > 60) return 'good quality with solid architecture'
    if (score > 40) return 'adequate quality with some technical debt'
    return 'basic quality requiring modernization'
  }

  private getValuationRange(value: number): string {
    if (value > 1000000) return 'multi-million dollar'
    if (value > 500000) return 'high six-figure'
    if (value > 100000) return 'mid six-figure'
    if (value > 50000) return 'low six-figure'
    return 'five-figure'
  }

  private getInvestmentAmount(value: number): string {
    const amount = value * 0.2 // 20% of valuation for investment
    if (amount > 500000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount > 100000) return `$${Math.round(amount / 1000)}K`
    return `$${Math.round(amount / 1000)}K`
  }

  private getTimeline(activityScore: number): string {
    if (activityScore > 80) return '3-6'
    if (activityScore > 60) return '6-9'
    if (activityScore > 40) return '9-12'
    return '12-18'
  }

  private getConfidenceLevel(metrics: any): 'high' | 'medium' | 'low' {
    const avgScore = (
      metrics.activity.score +
      metrics.community.score +
      metrics.codeHealth.score +
      metrics.businessPotential.score
    ) / 4
    
    if (avgScore > 70) return 'high'
    if (avgScore > 50) return 'medium'
    return 'low'
  }

  private getTargetAudience(metrics: any): 'investors' | 'acquirers' | 'partners' {
    if (metrics.businessPotential.score > 70) return 'acquirers'
    if (metrics.community.score > 70) return 'partners'
    return 'investors'
  }

  private getActivityDescription(score: number): string {
    if (score > 80) return 'Highly active with frequent commits'
    if (score > 60) return 'Regular development activity'
    if (score > 40) return 'Moderate activity level'
    return 'Limited recent activity'
  }

  private getCommunityDescription(score: number): string {
    if (score > 80) return 'Strong community engagement'
    if (score > 60) return 'Growing community interest'
    if (score > 40) return 'Basic community presence'
    return 'Limited community adoption'
  }

  private getHealthDescription(score: number): string {
    if (score > 80) return 'Excellent code health'
    if (score > 60) return 'Good maintenance practices'
    if (score > 40) return 'Adequate code quality'
    return 'Needs improvement'
  }

  private getBusinessDescription(score: number): string {
    if (score > 80) return 'High commercial potential'
    if (score > 60) return 'Good market opportunity'
    if (score > 40) return 'Moderate business value'
    return 'Limited commercial viability'
  }
}

// Utility function to create pitch from analysis results
export async function generatePitchFromAnalysis(analysisResult: any): Promise<{
  script: string
  audioUrl: string
  pitchData: PitchData
  marketIntelligence: MarketIntelligenceData
  profile: ProjectProfile
}> {
  const pitchEngine = new PitchEngine(analysisResult)
  const result = await pitchEngine.deliverPitch()
  return {
    ...result,
    profile: analysisResult
  }
}

// Utility function to generate market intelligence data
export function generateMarketIntelligenceFromAnalysis(analysisResult: any): MarketIntelligenceData {
  return generateMarketIntelligence(analysisResult)
}

// Utility function to generate competitive analysis
export function generateCompetitiveAnalysisFromAnalysis(analysisResult: any): CompetitiveAnalysis {
  const pitchEngine = new PitchEngine(analysisResult)
  return pitchEngine.generateCompetitiveAnalysis()
}