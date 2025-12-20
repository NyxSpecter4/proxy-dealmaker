import { Octokit } from '@octokit/rest'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { GitHubClient } from './github-client'
import { RepositoryAnalyzer, AnalysisMetrics, ValuationInsights, DealRecommendations } from './analyzer'
import { PitchEngine, generatePitchFromAnalysis } from './pitch-engine'
import { MarketIntelligenceEngine, MarketIntel } from './intelligence/market-analyzer'

export interface ProjectProfile {
  name: string
  tagline: string | null
  analysis: string // AI-generated narrative
  technicalSummary: {
    primaryLanguage: string
    totalLinesOfCode: number
    lastUpdated: string
    stars: number
    forks: number
    contributors: number
  }
  metrics: AnalysisMetrics
  valuation: ValuationInsights
  recommendations: DealRecommendations
  marketIntelligence: MarketIntel | null
  githubUrl: string
  createdAt: string
  updatedAt: string
}

export interface BatchAnalysisResult {
  profiles: ProjectProfile[]
  summary: {
    totalRepositories: number
    totalEstimatedValue: number
    averageActivityScore: number
    averageCommunityScore: number
    topPerformer: string
    highestValue: number
  }
}

export class ProjectProfileAnalyzer {
  private octokit: Octokit
  private supabase: any
  private openai: OpenAI | null = null
  private githubClient: GitHubClient

  constructor(githubToken: string, supabaseUrl?: string, supabaseKey?: string) {
    this.octokit = new Octokit({ auth: githubToken })
    
    // Initialize Supabase if credentials provided
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey)
    }
    
    // Initialize OpenAI if API key available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    
    this.githubClient = new GitHubClient(githubToken)
  }

  async analyzeRepository(owner: string, repo: string): Promise<ProjectProfile> {
    try {
      // 1. Fetch repository data
      const repoData = await this.octokit.repos.get({ owner, repo })
      const languages = await this.octokit.repos.listLanguages({ owner, repo })
      
      // 2. Calculate technical metrics
      const primaryLanguage = Object.keys(languages.data)[0] || 'Unknown'
      const totalLinesOfCode = Object.values(languages.data).reduce((a: number, b: number) => a + b, 0)
      
      // 3. Get repository metrics using existing GitHub client
      const metrics = await this.githubClient.getRepositoryMetrics(owner, repo)
      
      // 4. Run analysis using existing analyzer
      const analysis = await RepositoryAnalyzer.analyzeRepository(metrics)
      
      // 5. Generate AI-powered narrative
      const aiNarrative = await this.generateAINarrative({
        name: repo,
        description: repoData.data.description || 'No description',
        primaryLanguage,
        totalLinesOfCode,
        createdAt: repoData.data.created_at,
        stars: repoData.data.stargazers_count,
        forks: repoData.data.forks_count,
        contributors: metrics.contributors.length,
        metrics: analysis.metrics
      })
      
      // 6. Generate market intelligence
      const marketIntel = await MarketIntelligenceEngine.analyzeProject({
        name: repo,
        description: repoData.data.description || 'No description',
        category: this.inferCategory(repoData.data.description || '', primaryLanguage),
        githubData: repoData.data
      })
      
      // 7. Construct the profile
      const profile: ProjectProfile = {
        name: repo,
        tagline: repoData.data.description,
        analysis: aiNarrative,
        technicalSummary: {
          primaryLanguage,
          totalLinesOfCode,
          lastUpdated: repoData.data.updated_at,
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          contributors: metrics.contributors.length
        },
        metrics: analysis.metrics,
        valuation: analysis.valuation,
        recommendations: analysis.recommendations,
        marketIntelligence: marketIntel,
        githubUrl: repoData.data.html_url,
        createdAt: repoData.data.created_at,
        updatedAt: repoData.data.updated_at
      }
      
      return profile
      
    } catch (error) {
      console.error(`Error analyzing repository ${owner}/${repo}:`, error)
      throw error
    }
  }

  async analyzeMultipleRepositories(repositories: Array<{owner: string, repo: string}>): Promise<BatchAnalysisResult> {
    const profiles: ProjectProfile[] = []
    
    // Analyze each repository sequentially (could be parallel with rate limiting)
    for (const repo of repositories) {
      try {
        const profile = await this.analyzeRepository(repo.owner, repo.repo)
        profiles.push(profile)
      } catch (error) {
        console.error(`Failed to analyze ${repo.owner}/${repo.repo}:`, error)
        // Continue with other repositories
      }
    }
    
    // Generate summary
    const summary = this.generateBatchSummary(profiles)
    
    return {
      profiles,
      summary
    }
  }

  async analyzeUserRepositories(username: string, limit: number = 10): Promise<BatchAnalysisResult> {
    // Get user's repositories
    const repos = await this.octokit.repos.listForUser({
      username,
      per_page: limit,
      sort: 'updated',
      direction: 'desc'
    })
    
    const repositoryList = repos.data.map(repo => ({
      owner: repo.owner.login,
      repo: repo.name
    }))
    
    return this.analyzeMultipleRepositories(repositoryList)
  }

  async analyzeOrganizationRepositories(org: string, limit: number = 10): Promise<BatchAnalysisResult> {
    // Get organization's repositories
    const repos = await this.octokit.repos.listForOrg({
      org,
      per_page: limit,
      sort: 'updated',
      direction: 'desc'
    })
    
    const repositoryList = repos.data.map(repo => ({
      owner: repo.owner.login,
      repo: repo.name
    }))
    
    return this.analyzeMultipleRepositories(repositoryList)
  }

  private async generateAINarrative(repoData: {
    name: string
    description: string | null
    primaryLanguage: string
    totalLinesOfCode: number
    createdAt: string
    stars: number
    forks: number
    contributors: number
    metrics: AnalysisMetrics
  }): Promise<string> {
    // If OpenAI is not available, return a basic narrative
    if (!this.openai) {
      return this.generateBasicNarrative(repoData)
    }
    
    try {
      const prompt = `
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

Based ONLY on this data, generate a concise, professional investment thesis. Do NOT mention build time. Focus on:
1. The project's apparent purpose and technical approach.
2. The sophistication implied by its structure and primary language.
3. A potential market opportunity or acquisition angle.
4. Key strengths and risks based on the metrics provided.

Keep the response under 300 words.
`
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional investment analyst specializing in technology startups and open source projects. Provide clear, data-driven insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
      
      return response.choices[0]?.message?.content || this.generateBasicNarrative(repoData)
      
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.generateBasicNarrative(repoData)
    }
  }

  private generateBasicNarrative(repoData: {
    name: string
    description: string | null
    primaryLanguage: string
    totalLinesOfCode: number
    createdAt: string
    stars: number
    forks: number
    contributors: number
    metrics: AnalysisMetrics
  }): string {
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

  private generateBatchSummary(profiles: ProjectProfile[]): BatchAnalysisResult['summary'] {
    if (profiles.length === 0) {
      return {
        totalRepositories: 0,
        totalEstimatedValue: 0,
        averageActivityScore: 0,
        averageCommunityScore: 0,
        topPerformer: '',
        highestValue: 0
      }
    }
    
    const totalEstimatedValue = profiles.reduce((sum, profile) => 
      sum + profile.valuation.estimatedValue.medium, 0
    )
    
    const averageActivityScore = profiles.reduce((sum, profile) => 
      sum + profile.metrics.activity.score, 0
    ) / profiles.length
    
    const averageCommunityScore = profiles.reduce((sum, profile) => 
      sum + profile.metrics.community.score, 0
    ) / profiles.length
    
    // Find top performer by combined score
    let topPerformer = profiles[0]
    let highestScore = 0
    
    for (const profile of profiles) {
      const combinedScore = (
        profile.metrics.activity.score +
        profile.metrics.community.score +
        profile.metrics.codeHealth.score +
        profile.metrics.businessPotential.score
      ) / 4
      
      if (combinedScore > highestScore) {
        highestScore = combinedScore
        topPerformer = profile
      }
    }
    
    // Find highest value
    const highestValue = Math.max(...profiles.map(p => p.valuation.estimatedValue.medium))
    
    return {
      totalRepositories: profiles.length,
      totalEstimatedValue,
      averageActivityScore,
      averageCommunityScore,
      topPerformer: topPerformer.name,
      highestValue
    }
  }

  async saveProfileToDatabase(profile: ProjectProfile, userId: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    const { error } = await this.supabase
      .from('project_profiles')
      .insert({
        user_id: userId,
        repository_name: profile.name,
        repository_url: profile.githubUrl,
        profile_data: profile,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      throw new Error(`Failed to save profile to database: ${error.message}`)
    }
  }

  async saveToRepositoryAnalyses(
    profile: ProjectProfile,
    userId: string,
    pitchData?: any,
    options: any = {}
  ): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    // Extract repo owner and name from GitHub URL
    const repoUrl = profile.githubUrl
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    const repoOwner = repoMatch ? repoMatch[1] : 'unknown'
    const repoName = repoMatch ? repoMatch[2] : profile.name
    
    // Prepare analysis data for repository_analyses table
    const analysisData = {
      user_id: userId,
      repo_url: repoUrl,
      repo_owner: repoOwner,
      repo_name: repoName,
      repo_description: profile.tagline,
      analyzed_at: new Date().toISOString(),
      analysis_status: 'completed',
      analysis_version: '1.0.0',
      
      // Core metrics (flattened)
      total_lines_of_code: profile.technicalSummary.totalLinesOfCode,
      primary_language: profile.technicalSummary.primaryLanguage,
      file_count: 0, // Would need to fetch from GitHub API
      stars: profile.technicalSummary.stars,
      forks: profile.technicalSummary.forks,
      contributors: profile.technicalSummary.contributors,
      last_commit_date: profile.updatedAt,
      created_date: profile.createdAt,
      updated_date: profile.updatedAt,
      
      // Analysis results (structured JSON)
      metrics: profile.metrics,
      valuation_insights: profile.valuation,
      recommendations: profile.recommendations,
      pitch_data: pitchData,
      ai_thesis: profile.analysis,
      
      // Raw data and metadata
      raw_github_data: {}, // Would be populated with raw API response
      analysis_options: options
    }
    
    const { data, error } = await this.supabase
      .from('repository_analyses')
      .insert(analysisData)
      .select('id')
      .single()
    
    if (error) {
      console.error('Failed to save to repository_analyses:', error)
      // Try to insert into github_analyses as fallback
      await this.supabase
        .from('github_analyses')
        .insert({
          user_id: userId,
          repository_owner: repoOwner,
          repository_name: repoName,
          repository_url: repoUrl,
          analysis_status: 'completed',
          metrics: profile.metrics,
          valuation_insights: profile.valuation,
          recommendations: profile.recommendations,
          raw_data: {},
          completed_at: new Date().toISOString()
        })
      
      throw new Error(`Failed to save to repository_analyses: ${error.message}`)
    }
    
    return data.id
  }

  async getProfilesFromDatabase(userId: string): Promise<ProjectProfile[]> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized')
    }
    
    const { data, error } = await this.supabase
      .from('project_profiles')
      .select('profile_data')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch profiles from database: ${error.message}`)
    }
    
    return data.map((row: any) => row.profile_data as ProjectProfile)
  }

  // Pitch generation methods
  async generatePitch(profile: ProjectProfile): Promise<{
    script: string
    audioUrl: string
    pitchData: any
  }> {
    const pitchEngine = new PitchEngine(profile)
    return pitchEngine.deliverPitch()
  }

  async analyzeRepositoryWithPitch(
    owner: string,
    repo: string,
    userId?: string,
    options: any = {}
  ): Promise<{
    profile: ProjectProfile
    pitch: {
      script: string
      audioUrl: string
      pitchData: any
    }
    analysisId?: string
  }> {
    const profile = await this.analyzeRepository(owner, repo)
    const pitch = await this.generatePitch(profile)
    
    let analysisId: string | undefined
    
    // Save to repository_analyses table if userId provided
    if (userId && this.supabase) {
      try {
        analysisId = await this.saveToRepositoryAnalyses(profile, userId, pitch.pitchData, options)
      } catch (error) {
        console.error('Failed to save analysis to database:', error)
        // Continue without database save
      }
    }
    
    return {
      profile,
      pitch,
      analysisId
    }
  }

  async analyzeMultipleRepositoriesWithPitches(
    repositories: Array<{owner: string, repo: string}>
  ): Promise<{
    profiles: ProjectProfile[]
    pitches: Array<{
      script: string
      audioUrl: string
      pitchData: any
    }>
    summary: BatchAnalysisResult['summary']
  }> {
    const profiles: ProjectProfile[] = []
    const pitches: Array<{
      script: string
      audioUrl: string
      pitchData: any
    }> = []
    
    for (const repo of repositories) {
      try {
        const result = await this.analyzeRepositoryWithPitch(repo.owner, repo.repo)
        profiles.push(result.profile)
        pitches.push(result.pitch)
      } catch (error) {
        console.error(`Failed to analyze ${repo.owner}/${repo.repo}:`, error)
      }
    }
    
    const summary = this.generateBatchSummary(profiles)
    
    return {
      profiles,
      pitches,
      summary
    }
  }

  private inferCategory(description: string, primaryLanguage: string): string {
    const desc = description.toLowerCase()
    const lang = primaryLanguage.toLowerCase()
    
    // Simple category inference based on keywords
    if (desc.includes('game') || desc.includes('gaming') || desc.includes('player') ||
        desc.includes('battle') || desc.includes('tournament')) {
      return 'gaming'
    }
    
    if (desc.includes('property') || desc.includes('real estate') || desc.includes('rental') ||
        desc.includes('management') || desc.includes('housing')) {
      return 'property-tech'
    }
    
    if (desc.includes('ai') || desc.includes('machine learning') || desc.includes('artificial') ||
        desc.includes('neural') || desc.includes('deep learning') || lang.includes('python')) {
      return 'ai-ml'
    }
    
    // Default to ai-ml as per market-analyzer.ts
    return 'ai-ml'
  }
}