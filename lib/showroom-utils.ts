import { supabase } from './supabase-client'

export interface ShowroomAnalysis {
  id: string
  repo_url: string
  repo_name: string
  repo_description: string | null
  analyzed_at: string
  total_lines_of_code: number | null
  primary_language: string | null
  file_count: number | null
  stars: number | null
  forks: number | null
  pitch_data: any | null
  ai_thesis: string | null
  metrics: any | null
}

export async function getShowroomAnalyses(userId: string, limit: number = 3): Promise<ShowroomAnalysis[]> {
  try {
    const { data, error } = await supabase
      .from('repository_analyses')
      .select(`
        id,
        repo_url,
        repo_name,
        repo_description,
        analyzed_at,
        total_lines_of_code,
        primary_language,
        file_count,
        stars,
        forks,
        pitch_data,
        ai_thesis,
        metrics
      `)
      .eq('user_id', userId)
      .eq('analysis_status', 'completed')
      .order('analyzed_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching showroom analyses:', error)
      
      // Fallback to github_analyses table if repository_analyses doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('github_analyses')
        .select(`
          id,
          repository_url,
          repository_name,
          metrics,
          valuation_insights,
          recommendations,
          created_at
        `)
        .eq('user_id', userId)
        .eq('analysis_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (fallbackError) {
        console.error('Error fetching fallback analyses:', fallbackError)
        return []
      }
      
      // Transform github_analyses data to ShowroomAnalysis format
      return fallbackData.map((analysis: any) => ({
        id: analysis.id,
        repo_url: analysis.repository_url,
        repo_name: analysis.repository_name,
        repo_description: null,
        analyzed_at: analysis.created_at,
        total_lines_of_code: analysis.metrics?.codeHealth?.dependencyCount || 0,
        primary_language: 'Unknown',
        file_count: 0,
        stars: analysis.metrics?.community?.stars || 0,
        forks: analysis.metrics?.community?.forks || 0,
        pitch_data: null,
        ai_thesis: analysis.valuation_insights?.valuationMethodology?.[0] || null,
        metrics: analysis.metrics
      }))
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching showroom analyses:', error)
    return []
  }
}

export function formatTimeSince(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  const weeks = Math.floor(diffDays / 7)
  if (weeks < 4) return `${weeks}w ago`
  
  const months = Math.floor(diffDays / 30)
  if (months < 12) return `${months}mo ago`
  
  const years = Math.floor(diffDays / 365)
  return `${years}y ago`
}

export function extractRepoNameFromUrl(repoUrl: string): string {
  const match = repoUrl.match(/github\.com\/[^\/]+\/([^\/]+)/)
  return match ? match[1] : repoUrl.split('/').pop() || 'Unknown'
}

export function getPitchHook(pitchData: any): string {
  if (!pitchData) return 'No pitch data available'
  
  if (typeof pitchData === 'string') {
    // Try to extract hook from pitch script
    const hookMatch = pitchData.match(/"(.*?)"/)
    return hookMatch ? hookMatch[1] : pitchData.substring(0, 100) + '...'
  }
  
  if (pitchData.hook) {
    return pitchData.hook
  }
  
  if (pitchData.script) {
    const hookMatch = pitchData.script.match(/"(.*?)"/)
    return hookMatch ? hookMatch[1] : pitchData.script.substring(0, 100) + '...'
  }
  
  return 'Investment opportunity identified'
}

export async function analyzeAndSaveToShowroom(
  githubToken: string,
  repositoryUrl: string,
  userId: string,
  options: any = {}
): Promise<{
  analysisId: string
  profile: any
  pitch: any
}> {
  // Import dynamically to avoid circular dependencies
  const { ProjectProfileAnalyzer } = await import('./project-profile-analyzer')
  
  const analyzer = new ProjectProfileAnalyzer(githubToken)
  
  // Parse repository URL
  const repoMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!repoMatch) {
    throw new Error('Invalid GitHub repository URL')
  }
  
  const [, owner, repo] = repoMatch
  
  // Analyze repository with pitch generation
  const result = await analyzer.analyzeRepositoryWithPitch(owner, repo, userId, options)
  
  if (!result.analysisId) {
    throw new Error('Failed to save analysis to database')
  }
  
  return {
    analysisId: result.analysisId,
    profile: result.profile,
    pitch: result.pitch
  }
}

export async function batchAnalyzeForShowroom(
  githubToken: string,
  repositoryUrls: string[],
  userId: string,
  options: any = {}
): Promise<Array<{
  analysisId: string
  repoName: string
  success: boolean
  error?: string
}>> {
  const results = []
  
  for (const repoUrl of repositoryUrls) {
    try {
      const result = await analyzeAndSaveToShowroom(githubToken, repoUrl, userId, options)
      results.push({
        analysisId: result.analysisId,
        repoName: extractRepoNameFromUrl(repoUrl),
        success: true
      })
    } catch (error) {
      results.push({
        analysisId: '',
        repoName: extractRepoNameFromUrl(repoUrl),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return results
}