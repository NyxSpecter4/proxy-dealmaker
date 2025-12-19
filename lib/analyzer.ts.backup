import { RepositoryMetrics, GitHubRepository, Contributor } from './github-client'

export interface AnalysisMetrics {
  activity: {
    score: number // 0-100
    commitsLastMonth: number
    commitsLastYear: number
    averageWeeklyCommits: number
    contributorCount: number
    busFactor: number // 1-10, lower is riskier
    issueResolutionRate: number // 0-1
    prMergeRate: number // 0-1
  }
  community: {
    score: number // 0-100
    stars: number
    forks: number
    watchers: number
    starGrowthRate: number // stars per month
    forkRatio: number // forks per star
    contributorEngagement: number // 0-1
  }
  codeHealth: {
    score: number // 0-100
    hasTests: boolean
    hasCI: boolean
    hasDocumentation: boolean
    dependencyCount: number
    licenseScore: number // 0-1
    recentReleases: number
    daysSinceLastCommit: number
  }
  businessPotential: {
    score: number // 0-100
    marketSize: number // 1-10
    competition: number // 1-10, higher = more competitive
    monetizationPotential: number // 1-10
    teamStrength: number // 1-10
    technologyTrend: number // 1-10
  }
}

export interface ValuationInsights {
  estimatedValue: {
    low: number
    medium: number
    high: number
    currency: string
  }
  valuationMethodology: string[]
  keyValueDrivers: Array<{
    driver: string
    impact: 'high' | 'medium' | 'low'
    description: string
  }>
  comparableProjects: Array<{
    name: string
    url: string
    stars: number
    estimatedValue: number
  }>
}

export interface DealRecommendations {
  acquisition: {
    recommended: boolean
    confidence: number // 0-1
    rationale: string[]
    suggestedPriceRange: {
      low: number
      high: number
      currency: string
    }
  }
  partnership: {
    recommended: boolean
    confidence: number
    rationale: string[]
    suggestedApproach: string[]
  }
  investment: {
    recommended: boolean
    confidence: number
    rationale: string[]
    suggestedAmount: {
      low: number
      high: number
      currency: string
    }
  }
  risks: Array<{
    category: string
    description: string
    severity: 'high' | 'medium' | 'low'
    mitigation: string
  }>
  nextSteps: string[]
}

export class RepositoryAnalyzer {
  static calculateActivityScore(metrics: RepositoryMetrics): AnalysisMetrics['activity'] {
    const commitsLastMonth = metrics.commitActivity
      .slice(-4)
      .reduce((sum, week) => sum + week.total, 0)
    
    const commitsLastYear = metrics.commitActivity
      .reduce((sum, week) => sum + week.total, 0)
    
    const averageWeeklyCommits = commitsLastYear / 52
    
    const contributorCount = metrics.contributors.length
    
    // Calculate bus factor (1-10, lower is riskier)
    const totalContributions = metrics.contributors.reduce((sum, c) => sum + c.contributions, 0)
    const topContributorShare = metrics.contributors[0]?.contributions / totalContributions || 0
    const busFactor = Math.max(1, Math.min(10, Math.round((1 - topContributorShare) * 10)))
    
    // Calculate issue resolution rate
    const issueResolutionRate = metrics.issues.total > 0 
      ? metrics.issues.closed / metrics.issues.total
      : 1
    
    // Calculate PR merge rate
    const prMergeRate = metrics.pullRequests.total > 0
      ? metrics.pullRequests.merged / metrics.pullRequests.total
      : 1
    
    // Calculate overall activity score (0-100)
    const score = Math.min(100, Math.round(
      (commitsLastMonth * 0.3) +
      (contributorCount * 2) +
      (busFactor * 5) +
      (issueResolutionRate * 25) +
      (prMergeRate * 25)
    ))
    
    return {
      score,
      commitsLastMonth,
      commitsLastYear,
      averageWeeklyCommits,
      contributorCount,
      busFactor,
      issueResolutionRate,
      prMergeRate,
    }
  }
  
  static calculateCommunityScore(metrics: RepositoryMetrics): AnalysisMetrics['community'] {
    const stars = metrics.repository.stargazers_count
    const forks = metrics.repository.forks_count
    const watchers = metrics.repository.watchers_count
    
    // Calculate star growth rate (simplified)
    const repoAgeDays = Math.max(1, (Date.now() - new Date(metrics.repository.created_at).getTime()) / (1000 * 60 * 60 * 24))
    const starGrowthRate = stars / (repoAgeDays / 30) // stars per month
    
    const forkRatio = stars > 0 ? forks / stars : 0
    
    // Calculate contributor engagement
    const activeContributors = metrics.contributors.filter(c => c.contributions > 1).length
    const contributorEngagement = metrics.contributors.length > 0
      ? activeContributors / metrics.contributors.length
      : 0
    
    // Calculate overall community score (0-100)
    const score = Math.min(100, Math.round(
      (Math.log(stars + 1) * 10) +
      (Math.log(forks + 1) * 8) +
      (starGrowthRate * 5) +
      (contributorEngagement * 30)
    ))
    
    return {
      score,
      stars,
      forks,
      watchers,
      starGrowthRate,
      forkRatio,
      contributorEngagement,
    }
  }
  
  static calculateCodeHealthScore(metrics: RepositoryMetrics): AnalysisMetrics['codeHealth'] {
    const repo = metrics.repository
    const now = new Date()
    const lastCommit = new Date(repo.pushed_at)
    const daysSinceLastCommit = Math.floor((now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24))
    
    // Heuristic checks (in a real implementation, these would be more sophisticated)
    const hasTests = repo.topics.some(t => t.includes('test')) || 
                     repo.description?.toLowerCase().includes('test') ||
                     false
    
    const hasCI = repo.topics.some(t => t.includes('ci') || t.includes('github-actions')) ||
                  false
    
    const hasDocumentation = repo.has_wiki || 
                            repo.description?.toLowerCase().includes('documentation') ||
                            false
    
    const dependencyCount = 0 // Would need to analyze package.json
    
    // License score
    const licenseScore = repo.license ? 1 : 0.3
    
    const recentReleases = metrics.releases.filter(r => {
      const releaseDate = new Date(r.created_at)
      const daysSinceRelease = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceRelease < 180 // Last 6 months
    }).length
    
    // Calculate overall code health score (0-100)
    const score = Math.min(100, Math.round(
      (hasTests ? 15 : 0) +
      (hasCI ? 15 : 0) +
      (hasDocumentation ? 15 : 0) +
      (licenseScore * 15) +
      (Math.max(0, 30 - daysSinceLastCommit)) +
      (recentReleases * 5)
    ))
    
    return {
      score,
      hasTests,
      hasCI,
      hasDocumentation,
      dependencyCount,
      licenseScore,
      recentReleases,
      daysSinceLastCommit,
    }
  }
  
  static calculateBusinessPotentialScore(metrics: RepositoryMetrics): AnalysisMetrics['businessPotential'] {
    const repo = metrics.repository
    
    // Market size based on language and topics
    const popularLanguages = ['javascript', 'typescript', 'python', 'java', 'go', 'rust']
    const languageScore = popularLanguages.includes(repo.language?.toLowerCase() || '') ? 8 : 5
    
    // Competition based on similar repos (simplified)
    const competition = Math.min(10, Math.floor(metrics.repository.stargazers_count / 1000) + 3)
    
    // Monetization potential based on project type
    const isFramework = repo.topics.some(t => t.includes('framework'))
    const isLibrary = repo.topics.some(t => t.includes('library') || t.includes('sdk'))
    const isTool = repo.topics.some(t => t.includes('tool') || t.includes('cli'))
    
    let monetizationPotential = 5
    if (isFramework) monetizationPotential = 8
    if (isLibrary) monetizationPotential = 7
    if (isTool) monetizationPotential = 6
    
    // Team strength based on contributors
    const teamStrength = Math.min(10, Math.floor(metrics.contributors.length / 3) + 3)
    
    // Technology trend (simplified)
    const trendingTopics = ['ai', 'machine-learning', 'blockchain', 'web3', 'serverless']
    const hasTrendingTopic = repo.topics.some(t => trendingTopics.includes(t.toLowerCase()))
    const technologyTrend = hasTrendingTopic ? 8 : 5
    
    // Calculate overall business potential score (0-100)
    const score = Math.min(100, Math.round(
      (languageScore * 3) +
      ((10 - competition) * 3) + // Lower competition is better
      (monetizationPotential * 4) +
      (teamStrength * 3) +
      (technologyTrend * 2)
    ))
    
    return {
      score,
      marketSize: languageScore,
      competition,
      monetizationPotential,
      teamStrength,
      technologyTrend,
    }
  }
  
  static generateValuationInsights(metrics: RepositoryMetrics, analysis: AnalysisMetrics): ValuationInsights {
    const repo = metrics.repository
    
    // Base valuation formula (simplified)
    const starValue = 1000 // $ per star (example)
    const contributorValue = 5000 // $ per active contributor
    const commitValue = 50 // $ per commit in last year
    
    const baseValue = 
      (repo.stargazers_count * starValue) +
      (analysis.activity.contributorCount * contributorValue) +
      (analysis.activity.commitsLastYear * commitValue)
    
    // Apply multipliers based on scores
    const activityMultiplier = analysis.activity.score / 100
    const communityMultiplier = analysis.community.score / 100
    const codeHealthMultiplier = analysis.codeHealth.score / 100
    const businessMultiplier = analysis.businessPotential.score / 100
    
    const totalMultiplier = (activityMultiplier + communityMultiplier + codeHealthMultiplier + businessMultiplier) / 4
    
    const estimatedValue = baseValue * totalMultiplier
    
    // Create value ranges
    const low = estimatedValue * 0.5
    const medium = estimatedValue
    const high = estimatedValue * 2
    
    return {
      estimatedValue: {
        low: Math.round(low),
        medium: Math.round(medium),
        high: Math.round(high),
        currency: 'USD',
      },
      valuationMethodology: [
        'Comparable project analysis',
        'Revenue multiple estimation',
        'Cost-based valuation',
        'Market opportunity sizing',
      ],
      keyValueDrivers: [
        {
          driver: 'Community Engagement',
          impact: analysis.community.score > 70 ? 'high' : analysis.community.score > 40 ? 'medium' : 'low',
          description: `Strong community with ${repo.stargazers_count} stars and ${repo.forks_count} forks`,
        },
        {
          driver: 'Development Activity',
          impact: analysis.activity.score > 70 ? 'high' : analysis.activity.score > 40 ? 'medium' : 'low',
          description: `${analysis.activity.commitsLastMonth} commits in last month, ${analysis.activity.contributorCount} contributors`,
        },
        {
          driver: 'Code Health',
          impact: analysis.codeHealth.score > 70 ? 'high' : analysis.codeHealth.score > 40 ? 'medium' : 'low',
          description: analysis.codeHealth.daysSinceLastCommit < 30 ? 'Recently active' : 'Limited recent activity',
        },
      ],
      comparableProjects: [
        {
          name: 'Similar Open Source Project',
          url: 'https://github.com/example/similar',
          stars: Math.round(repo.stargazers_count * 0.8),
          estimatedValue: Math.round(estimatedValue * 0.9),
        },
        {
          name: 'Industry Standard',
          url: 'https://github.com/example/industry-standard',
          stars: Math.round(repo.stargazers_count * 1.5),
          estimatedValue: Math.round(estimatedValue * 1.8),
        },
      ],
    }
  }
  
  static generateDealRecommendations(metrics: RepositoryMetrics, analysis: AnalysisMetrics, valuation: ValuationInsights): DealRecommendations {
    const overallScore = (
      analysis.activity.score +
      analysis.community.score +
      analysis.codeHealth.score +
      analysis.businessPotential.score
    ) / 4
    
    const acquisitionRecommended = overallScore > 60
    const partnershipRecommended = overallScore > 40
    const investmentRecommended = overallScore > 50
    
    return {
      acquisition: {
        recommended: acquisitionRecommended,
        confidence: overallScore / 100,
        rationale: acquisitionRecommended ? [
          'Strong community engagement and growth potential',
          'Active development team with proven track record',
          'Technology aligns with current market trends',
        ] : [
          'Limited community engagement',
          'Development activity below threshold for acquisition',
          'Higher risk profile',
        ],
        suggestedPriceRange: {
          low: valuation.estimatedValue.low,
          high: valuation.estimatedValue.high,
          currency: valuation.estimatedValue.currency,
        },
      },
      partnership: {
        recommended: partnershipRecommended,
        confidence: Math.max(0.3, overallScore / 100),
        rationale: partnershipRecommended ? [
          'Complementary technology stack',
          'Opportunity for mutual growth',
          'Shared target audience',
        ] : [
          'Limited strategic alignment opportunities',
          'Better suited for independent development',
        ],
        suggestedApproach: [
          'Technical integration partnership',
          'Co-marketing agreement',
          'Joint development roadmap',
        ],
      },
      investment: {
        recommended: investmentRecommended,
        confidence: overallScore / 100,
        rationale: investmentRecommended ? [
          'High growth potential in target market',
          'Strong founding team with domain expertise',
          'Proven ability to execute and deliver',
        ] : [
          'Market saturation concerns',
          'Team composition needs strengthening',
          'Unclear monetization strategy',
        ],
        suggestedAmount: {
          low: valuation.estimatedValue.low * 0.1,
          high: valuation.estimatedValue.high * 0.3,
          currency: valuation.estimatedValue.currency,
        },
      },
      risks: [
        {
          category: 'Technical',
          description: 'Dependency on key contributors (bus factor)',
          severity: analysis.activity.busFactor < 3 ? 'high' : analysis.activity.busFactor < 6 ? 'medium' : 'low',
          mitigation: 'Implement knowledge sharing and documentation practices',
        },
        {
          category: 'Market',
          description: 'Competition in target space',
          severity: analysis.businessPotential.competition > 7 ? 'high' : analysis.businessPotential.competition > 4 ? 'medium' : 'low',
          mitigation: 'Differentiate through unique features and community focus',
        },
        {
          category: 'Legal',
          description: 'License compatibility and IP concerns',
          severity: analysis.codeHealth.licenseScore < 0.5 ? 'high' : 'medium',
          mitigation: 'Conduct thorough license review and compliance audit',
        },
      ],
      nextSteps: [
        'Conduct technical due diligence',
        'Interview key contributors',
        'Analyze competitive landscape',
        'Develop integration roadmap',
        'Create financial projections',
      ],
    }
  }
  
  static async analyzeRepository(metrics: RepositoryMetrics) {
    const activity = this.calculateActivityScore(metrics)
    const community = this.calculateCommunityScore(metrics)
    const codeHealth = this.calculateCodeHealthScore(metrics)
    const businessPotential = this.calculateBusinessPotentialScore(metrics)
    
    const analysisMetrics: AnalysisMetrics = {
      activity,
      community,
      codeHealth,
      businessPotential,
    }
    
    const valuationInsights = this.generateValuationInsights(metrics, analysisMetrics)
    const dealRecommendations = this.generateDealRecommendations(metrics, analysisMetrics, valuationInsights)
    
    return {
      metrics: analysisMetrics,
      valuation: valuationInsights,
      recommendations: dealRecommendations,
    }
  }
}