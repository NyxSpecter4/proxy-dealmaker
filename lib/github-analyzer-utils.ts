import { ProjectProfileAnalyzer, ProjectProfile, BatchAnalysisResult } from './project-profile-analyzer'

/**
 * Utility functions for analyzing GitHub repositories as shown in the task script
 */

/**
 * Analyzes the three specific repositories mentioned in the task
 * @param githubToken GitHub API token
 * @returns Analysis results for bountywarz, RWS-CC, and camel-racing
 */
export async function analyzeTaskRepositories(githubToken: string): Promise<BatchAnalysisResult> {
  const analyzer = new ProjectProfileAnalyzer(githubToken)
  
  const repositories = [
    { owner: 'NyxSpecter4', repo: 'bountywarz' },
    { owner: 'NyxSpecter4', repo: 'RWS-CC' },
    { owner: 'NyxSpecter4', repo: 'camel-racing' }
  ]
  
  return analyzer.analyzeMultipleRepositories(repositories)
}

/**
 * Executes the exact analysis from the task script
 * This mimics the original JavaScript function structure
 */
export async function executeTaskScriptAnalysis(githubToken: string) {
  const analyzer = new ProjectProfileAnalyzer(githubToken)
  
  // Analyze each repository
  const projects = await Promise.all([
    analyzer.analyzeRepository('NyxSpecter4', 'bountywarz'),
    analyzer.analyzeRepository('NyxSpecter4', 'RWS-CC'),
    analyzer.analyzeRepository('NyxSpecter4', 'camel-racing')
  ])
  
  // Generate summary similar to the original script
  const summary = {
    totalProjects: projects.length,
    totalLinesOfCode: projects.reduce((sum, p) => sum + p.technicalSummary.totalLinesOfCode, 0),
    totalStars: projects.reduce((sum, p) => sum + p.technicalSummary.stars, 0),
    totalForks: projects.reduce((sum, p) => sum + p.technicalSummary.forks, 0),
    totalContributors: projects.reduce((sum, p) => sum + p.technicalSummary.contributors, 0),
    averageActivityScore: projects.reduce((sum, p) => sum + p.metrics.activity.score, 0) / projects.length,
    averageCommunityScore: projects.reduce((sum, p) => sum + p.metrics.community.score, 0) / projects.length,
    totalEstimatedValue: projects.reduce((sum, p) => sum + p.valuation.estimatedValue.medium, 0)
  }
  
  return {
    projects,
    summary,
    generatedAt: new Date().toISOString()
  }
}

/**
 * Generates a comprehensive report in the format expected by the task
 */
export async function generateProjectProfileReport(githubToken: string) {
  const result = await executeTaskScriptAnalysis(githubToken)
  
  const report = {
    metadata: {
      generatedAt: result.generatedAt,
      analyzerVersion: '1.0.0',
      repositoriesAnalyzed: result.projects.length
    },
    projects: result.projects.map(profile => ({
      name: profile.name,
      tagline: profile.tagline,
      analysis: profile.analysis,
      technicalSummary: profile.technicalSummary,
      metrics: {
        activity: profile.metrics.activity.score,
        community: profile.metrics.community.score,
        codeHealth: profile.metrics.codeHealth.score,
        businessPotential: profile.metrics.businessPotential.score
      },
      valuation: profile.valuation.estimatedValue,
      githubUrl: profile.githubUrl
    })),
    comparativeAnalysis: {
      highestRatedProject: result.projects.reduce((prev, current) => 
        (prev.metrics.activity.score + prev.metrics.community.score) > 
        (current.metrics.activity.score + current.metrics.community.score) ? prev : current
      ).name,
      mostValuableProject: result.projects.reduce((prev, current) => 
        prev.valuation.estimatedValue.medium > current.valuation.estimatedValue.medium ? prev : current
      ).name,
      mostActiveProject: result.projects.reduce((prev, current) => 
        prev.metrics.activity.score > current.metrics.activity.score ? prev : current
      ).name
    },
    investmentRecommendations: result.projects.map(profile => ({
      project: profile.name,
      recommendation: profile.recommendations.acquisition.recommended ? 'Consider for acquisition' :
                     profile.recommendations.investment.recommended ? 'Consider for investment' :
                     profile.recommendations.partnership.recommended ? 'Consider for partnership' : 'Monitor',
      confidence: Math.max(
        profile.recommendations.acquisition.confidence,
        profile.recommendations.investment.confidence,
        profile.recommendations.partnership.confidence
      ),
      suggestedAction: profile.recommendations.nextSteps[0] || 'Conduct further analysis'
    })),
    summary: result.summary
  }
  
  return report
}

/**
 * Exports analysis results to JSON format for easy sharing
 */
export function exportToJson(analysisResult: any, filename: string = 'github-analysis-report.json') {
  const jsonContent = JSON.stringify(analysisResult, null, 2)
  
  // In a browser environment, this would trigger a download
  // In Node.js, we would write to a file
  return {
    filename,
    content: jsonContent,
    size: jsonContent.length,
    type: 'application/json'
  }
}

/**
 * Validates GitHub repository URLs and extracts owner/repo
 */
export function parseRepositoryUrls(urls: string[]): Array<{owner: string, repo: string}> {
  const results: Array<{owner: string, repo: string}> = []
  
  for (const url of urls) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?$/)
    if (match) {
      results.push({
        owner: match[1],
        repo: match[2].replace(/\.git$/, '')
      })
    }
  }
  
  return results
}

/**
 * Batch analysis with progress reporting
 */
export async function analyzeRepositoryBatch(
  githubToken: string,
  repositories: Array<{owner: string, repo: string}>,
  onProgress?: (completed: number, total: number, currentRepo: string) => void
): Promise<BatchAnalysisResult> {
  const analyzer = new ProjectProfileAnalyzer(githubToken)
  const profiles: ProjectProfile[] = []
  
  for (let i = 0; i < repositories.length; i++) {
    const repo = repositories[i]
    
    if (onProgress) {
      onProgress(i, repositories.length, `${repo.owner}/${repo.repo}`)
    }
    
    try {
      const profile = await analyzer.analyzeRepository(repo.owner, repo.repo)
      profiles.push(profile)
    } catch (error) {
      console.error(`Failed to analyze ${repo.owner}/${repo.repo}:`, error)
      // Continue with next repository
    }
  }
  
  if (onProgress) {
    onProgress(repositories.length, repositories.length, 'Complete')
  }
  
  // Generate summary
  const summary = {
    totalRepositories: profiles.length,
    totalEstimatedValue: profiles.reduce((sum, p) => sum + p.valuation.estimatedValue.medium, 0),
    averageActivityScore: profiles.reduce((sum, p) => sum + p.metrics.activity.score, 0) / profiles.length,
    averageCommunityScore: profiles.reduce((sum, p) => sum + p.metrics.community.score, 0) / profiles.length,
    topPerformer: profiles.length > 0 ? 
      profiles.reduce((prev, current) => 
        (prev.metrics.activity.score + prev.metrics.community.score) > 
        (current.metrics.activity.score + current.metrics.community.score) ? prev : current
      ).name : '',
    highestValue: profiles.length > 0 ? 
      Math.max(...profiles.map(p => p.valuation.estimatedValue.medium)) : 0
  }
  
  return {
    profiles,
    summary
  }
}