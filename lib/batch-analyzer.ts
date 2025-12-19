import { ProjectProfileAnalyzer, ProjectProfile, BatchAnalysisResult } from './project-profile-analyzer'
import { OpenAIService } from './openai-service'

export interface BatchAnalysisOptions {
  maxConcurrent?: number
  delayBetweenRequests?: number // ms
  includeAINarratives?: boolean
  saveToDatabase?: boolean
  userId?: string
  onProgress?: (progress: BatchProgress) => void
}

export interface BatchProgress {
  completed: number
  total: number
  currentRepository?: string
  status: 'idle' | 'processing' | 'completed' | 'failed'
  errors: Array<{ repository: string; error: string }>
}

export interface BatchAnalysisJob {
  id: string
  repositories: Array<{ owner: string; repo: string }>
  options: BatchAnalysisOptions
  status: 'pending' | 'processing' | 'completed' | 'failed'
  results?: BatchAnalysisResult
  progress: BatchProgress
  createdAt: Date
  completedAt?: Date
}

export class BatchAnalyzer {
  private analyzer: ProjectProfileAnalyzer
  private openaiService: OpenAIService | null = null
  private activeJobs: Map<string, BatchAnalysisJob> = new Map()
  
  constructor(githubToken: string, openaiApiKey?: string) {
    this.analyzer = new ProjectProfileAnalyzer(githubToken)
    
    if (openaiApiKey || process.env.OPENAI_API_KEY) {
      this.openaiService = new OpenAIService(openaiApiKey)
    }
  }
  
  async createBatchJob(
    repositories: Array<{ owner: string; repo: string }>,
    options: BatchAnalysisOptions = {}
  ): Promise<string> {
    const jobId = this.generateJobId()
    
    const job: BatchAnalysisJob = {
      id: jobId,
      repositories,
      options,
      status: 'pending',
      progress: {
        completed: 0,
        total: repositories.length,
        status: 'idle',
        errors: []
      },
      createdAt: new Date()
    }
    
    this.activeJobs.set(jobId, job)
    
    // Start processing in background
    this.processJob(jobId).catch(error => {
      console.error(`Job ${jobId} failed:`, error)
    })
    
    return jobId
  }
  
  async processJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }
    
    job.status = 'processing'
    job.progress.status = 'processing'
    this.updateProgress(jobId, job.progress)
    
    const profiles: ProjectProfile[] = []
    const errors: Array<{ repository: string; error: string }> = []
    
    const maxConcurrent = job.options.maxConcurrent || 1
    const delay = job.options.delayBetweenRequests || 1000
    
    // Process repositories in batches to respect rate limits
    for (let i = 0; i < job.repositories.length; i += maxConcurrent) {
      const batch = job.repositories.slice(i, i + maxConcurrent)
      
      const batchPromises = batch.map(async (repo, index) => {
        const repoName = `${repo.owner}/${repo.repo}`
        
        // Update progress
        job.progress.currentRepository = repoName
        job.progress.completed = i + index
        this.updateProgress(jobId, job.progress)
        
        try {
          // Add delay between requests to avoid rate limiting
          if (index > 0) {
            await this.delay(delay)
          }
          
          const profile = await this.analyzer.analyzeRepository(repo.owner, repo.repo)
          
          // Enhance with AI narrative if enabled
          if (job.options.includeAINarratives && this.openaiService?.isEnabled()) {
            try {
              const aiNarrative = await this.openaiService.generateRepositoryNarrative({
                name: profile.name,
                description: profile.tagline,
                primaryLanguage: profile.technicalSummary.primaryLanguage,
                totalLinesOfCode: profile.technicalSummary.totalLinesOfCode,
                createdAt: profile.createdAt,
                stars: profile.technicalSummary.stars,
                forks: profile.technicalSummary.forks,
                contributors: profile.technicalSummary.contributors,
                metrics: profile.metrics
              })
              
              profile.analysis = aiNarrative
            } catch (aiError) {
              console.error(`Failed to generate AI narrative for ${repoName}:`, aiError)
              // Continue with existing analysis
            }
          }
          
          // Save to database if enabled
          if (job.options.saveToDatabase && job.options.userId) {
            try {
              await this.analyzer.saveProfileToDatabase(profile, job.options.userId)
            } catch (dbError) {
              console.error(`Failed to save ${repoName} to database:`, dbError)
            }
          }
          
          profiles.push(profile)
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(`Failed to analyze ${repoName}:`, error)
          errors.push({ repository: repoName, error: errorMessage })
        }
      })
      
      await Promise.all(batchPromises)
    }
    
    // Update final progress
    job.progress.completed = job.repositories.length
    job.progress.currentRepository = undefined
    job.progress.errors = errors
    job.progress.status = 'completed'
    this.updateProgress(jobId, job.progress)
    
    // Generate summary
    const summary = this.generateBatchSummary(profiles)
    
    job.results = {
      profiles,
      summary
    }
    
    job.status = 'completed'
    job.completedAt = new Date()
    this.activeJobs.set(jobId, job)
    
    // Notify progress callback
    if (job.options.onProgress) {
      job.options.onProgress(job.progress)
    }
  }
  
  getJob(jobId: string): BatchAnalysisJob | undefined {
    return this.activeJobs.get(jobId)
  }
  
  getJobStatus(jobId: string): BatchProgress | undefined {
    const job = this.activeJobs.get(jobId)
    return job?.progress
  }
  
  getJobResults(jobId: string): BatchAnalysisResult | undefined {
    const job = this.activeJobs.get(jobId)
    return job?.results
  }
  
  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.activeJobs.get(jobId)
    if (!job) {
      return false
    }
    
    if (job.status === 'processing') {
      // In a real implementation, we would cancel ongoing requests
      job.status = 'failed'
      job.progress.status = 'failed'
      this.activeJobs.set(jobId, job)
      return true
    }
    
    return false
  }
  
  async analyzeTaskRepositories(options?: BatchAnalysisOptions): Promise<BatchAnalysisResult> {
    const repositories = [
      { owner: 'NyxSpecter4', repo: 'bountywarz' },
      { owner: 'NyxSpecter4', repo: 'RWS-CC' },
      { owner: 'NyxSpecter4', repo: 'camel-racing' }
    ]
    
    const jobId = await this.createBatchJob(repositories, {
      maxConcurrent: 1, // Process sequentially to avoid rate limiting
      delayBetweenRequests: 2000,
      includeAINarratives: true,
      ...options
    })
    
    // Wait for completion
    return this.waitForJobCompletion(jobId)
  }
  
  async analyzeUserRepositories(
    username: string,
    limit: number = 10,
    options?: BatchAnalysisOptions
  ): Promise<BatchAnalysisResult> {
    // Get user's repositories
    const repos = await this.analyzer['octokit'].repos.listForUser({
      username,
      per_page: limit,
      sort: 'updated',
      direction: 'desc'
    })
    
    const repositories = repos.data.map(repo => ({
      owner: repo.owner.login,
      repo: repo.name
    }))
    
    const jobId = await this.createBatchJob(repositories, options)
    return this.waitForJobCompletion(jobId)
  }
  
  async analyzeOrganizationRepositories(
    org: string,
    limit: number = 10,
    options?: BatchAnalysisOptions
  ): Promise<BatchAnalysisResult> {
    // Get organization's repositories
    const repos = await this.analyzer['octokit'].repos.listForOrg({
      org,
      per_page: limit,
      sort: 'updated',
      direction: 'desc'
    })
    
    const repositories = repos.data.map(repo => ({
      owner: repo.owner.login,
      repo: repo.name
    }))
    
    const jobId = await this.createBatchJob(repositories, options)
    return this.waitForJobCompletion(jobId)
  }
  
  async waitForJobCompletion(jobId: string, timeout: number = 300000): Promise<BatchAnalysisResult> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const job = this.activeJobs.get(jobId)
      
      if (!job) {
        throw new Error(`Job ${jobId} not found`)
      }
      
      if (job.status === 'completed' && job.results) {
        return job.results
      }
      
      if (job.status === 'failed') {
        throw new Error(`Job ${jobId} failed: ${job.progress.errors.map(e => e.error).join(', ')}`)
      }
      
      // Wait before checking again
      await this.delay(1000)
    }
    
    throw new Error(`Job ${jobId} timed out after ${timeout}ms`)
  }
  
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private updateProgress(jobId: string, progress: BatchProgress): void {
    const job = this.activeJobs.get(jobId)
    if (job) {
      job.progress = progress
      this.activeJobs.set(jobId, job)
      
      // Notify progress callback if provided
      if (job.options.onProgress) {
        job.options.onProgress(progress)
      }
    }
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
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Utility methods for the task script
  static async executeTaskScript(githubToken: string, openaiApiKey?: string): Promise<any> {
    const batchAnalyzer = new BatchAnalyzer(githubToken, openaiApiKey)
    const result = await batchAnalyzer.analyzeTaskRepositories({
      includeAINarratives: true,
      maxConcurrent: 1,
      delayBetweenRequests: 2000
    })
    
    // Format similar to the original script
    return {
      projects: result.profiles.map(profile => ({
        name: profile.name,
        tagline: profile.tagline,
        analysis: profile.analysis,
        technicalSummary: profile.technicalSummary,
        githubUrl: profile.githubUrl
      })),
      summary: result.summary,
      generatedAt: new Date().toISOString()
    }
  }
}