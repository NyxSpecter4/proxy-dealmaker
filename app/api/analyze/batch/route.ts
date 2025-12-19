import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { BatchAnalyzer } from '@/lib/batch-analyzer'
import { parseRepositoryUrls } from '@/lib/github-analyzer-utils'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { 
      repositoryUrls, 
      repositories, // Alternative: array of {owner, repo} objects
      options = {} 
    } = body

    if (!repositoryUrls && !repositories) {
      return NextResponse.json(
        { error: 'Either repositoryUrls or repositories array is required' },
        { status: 400 }
      )
    }

    // Parse repository URLs if provided
    let repoList: Array<{owner: string, repo: string}> = []
    
    if (repositoryUrls && Array.isArray(repositoryUrls)) {
      repoList = parseRepositoryUrls(repositoryUrls)
    } else if (repositories && Array.isArray(repositories)) {
      // Validate repository objects
      repoList = repositories.filter((repo: any) => 
        repo.owner && repo.repo && typeof repo.owner === 'string' && typeof repo.repo === 'string'
      )
    }

    if (repoList.length === 0) {
      return NextResponse.json(
        { error: 'No valid repositories provided' },
        { status: 400 }
      )
    }

    // Limit batch size for performance
    const maxBatchSize = options.maxBatchSize || 10
    if (repoList.length > maxBatchSize) {
      return NextResponse.json(
        { error: `Batch size exceeds maximum of ${maxBatchSize}. Please analyze fewer repositories at once.` },
        { status: 400 }
      )
    }

    // Get user's GitHub token
    const { data: githubToken } = await supabase
      .from('user_github_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub authentication required. Please connect your GitHub account.' },
        { status: 403 }
      )
    }

    // Create batch analysis record in repository_analyses table
    let batchRecord: any = null
    try {
      // Create a record for each repository
      for (const repo of repoList) {
        const { data, error } = await supabase
          .from('repository_analyses')
          .insert({
            user_id: user.id,
            repo_url: `https://github.com/${repo.owner}/${repo.repo}`,
            repo_owner: repo.owner,
            repo_name: repo.repo,
            analysis_status: 'processing',
            created_at: new Date().toISOString(),
          })
          .select('id')
          .single()
        
        if (!error && data) {
          // Use the first record as batch record
          if (!batchRecord) {
            batchRecord = { id: data.id, repo_owner: repo.owner, repo_name: repo.repo }
          }
        }
      }
    } catch (error) {
      console.error('Failed to create analysis records:', error)
      // Continue without database record
    }

    // Initialize batch analyzer
    const batchAnalyzer = new BatchAnalyzer(
      githubToken.access_token,
      process.env.OPENAI_API_KEY
    )

    // Start batch analysis asynchronously
    const batchOptions = {
      maxConcurrent: options.maxConcurrent || 1,
      delayBetweenRequests: options.delayBetweenRequests || 2000,
      includeAINarratives: options.includeAINarratives !== false, // Default true
      saveToDatabase: options.saveToDatabase !== false, // Default true
      userId: user.id,
      onProgress: async (progress: any) => {
        // Update progress in database if record exists
        // Note: In a real implementation, we would track progress per repository
        // For now, we'll just log progress
        console.log(`Batch progress: ${progress.completed}/${progress.total} - ${progress.currentRepository || ''}`)
      }
    }

    // Start analysis in background
    const analysisPromise = (async () => {
      try {
        const jobId = await batchAnalyzer.createBatchJob(repoList, batchOptions)
        const results = await batchAnalyzer.waitForJobCompletion(jobId)
        
        // Save each profile to repository_analyses table
        for (const profile of results.profiles) {
          try {
            // Import ProjectProfileAnalyzer to use saveToRepositoryAnalyses
            const { ProjectProfileAnalyzer } = await import('@/lib/project-profile-analyzer')
            const analyzer = new ProjectProfileAnalyzer(githubToken.access_token)
            
            // Generate pitch for the profile
            const pitchEngine = new (await import('@/lib/pitch-engine')).PitchEngine(profile)
            const pitchData = pitchEngine.generatePitchData()
            
            // Save to repository_analyses
            await analyzer.saveToRepositoryAnalyses(profile, user.id, pitchData, options)
          } catch (saveError) {
            console.error(`Failed to save profile for ${profile.name}:`, saveError)
          }
        }
        
        return results
      } catch (error) {
        console.error('Batch analysis failed:', error)
        
        // Update analysis records status to failed
        for (const repo of repoList) {
          try {
            await supabase
              .from('repository_analyses')
              .update({
                analysis_status: 'failed',
                error_message: (error as Error).message,
                analyzed_at: new Date().toISOString(),
              })
              .eq('user_id', user.id)
              .eq('repo_owner', repo.owner)
              .eq('repo_name', repo.repo)
              .eq('analysis_status', 'processing')
          } catch (updateError) {
            console.error('Failed to update analysis status:', updateError)
          }
        }
        
        throw error
      }
    })()

    // For now, we'll wait for completion (in production, this should be a background job)
    // But we'll return immediately with a job ID for better UX
    const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Start analysis in background without blocking response
    analysisPromise.catch(error => {
      console.error('Background batch analysis failed:', error)
    })

    return NextResponse.json({
      jobId,
      status: 'processing',
      repositoryCount: repoList.length,
      estimatedTime: repoList.length * 10, // Rough estimate in seconds
      message: 'Batch analysis started. Use GET endpoint with jobId to check progress.',
      repositories: repoList.map(repo => `${repo.owner}/${repo.repo}`),
      createdAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Batch analysis request error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('repository_analyses')
      .select('*')
      .eq('user_id', user.id)

    if (analysisId) {
      query = query.eq('id', analysisId)
    } else if (status) {
      query = query.eq('analysis_status', status)
    }
    
    query = query.order('analyzed_at', { ascending: false }).limit(limit)

    const { data: analyses, error } = await query

    if (error) {
      console.error('Failed to fetch analyses:', error)
      // Table might not exist yet, try github_analyses as fallback
      const { data: fallbackAnalyses, error: fallbackError } = await supabase
        .from('github_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (fallbackError) {
        return NextResponse.json({
          analyses: [],
          message: 'No analyses found'
        })
      }
      
      return NextResponse.json({
        analyses: fallbackAnalyses.map((analysis: any) => ({
          id: analysis.id,
          repo_url: analysis.repository_url,
          repo_owner: analysis.repository_owner,
          repo_name: analysis.repository_name,
          analysis_status: analysis.analysis_status,
          metrics: analysis.metrics,
          valuation_insights: analysis.valuation_insights,
          recommendations: analysis.recommendations,
          analyzed_at: analysis.completed_at || analysis.created_at,
          error_message: analysis.error_message,
        }))
      })
    }

    return NextResponse.json({
      analyses: analyses.map((analysis: any) => ({
        id: analysis.id,
        repo_url: analysis.repo_url,
        repo_owner: analysis.repo_owner,
        repo_name: analysis.repo_name,
        repo_description: analysis.repo_description,
        analysis_status: analysis.analysis_status,
        analyzed_at: analysis.analyzed_at,
        total_lines_of_code: analysis.total_lines_of_code,
        primary_language: analysis.primary_language,
        file_count: analysis.file_count,
        stars: analysis.stars,
        forks: analysis.forks,
        pitch_data: analysis.pitch_data,
        ai_thesis: analysis.ai_thesis,
        metrics: analysis.metrics,
        valuation_insights: analysis.valuation_insights,
        recommendations: analysis.recommendations,
        error_message: analysis.error_message,
      }))
    })

  } catch (error) {
    console.error('Fetch analyses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Special endpoint for analyzing the three repositories from the task
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's GitHub token
    const { data: githubToken } = await supabase
      .from('user_github_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub authentication required. Please connect your GitHub account.' },
        { status: 403 }
      )
    }

    // Parse request body for custom options
    const body = await request.json()
    const options = body.options || {}

    // Initialize batch analyzer
    const batchAnalyzer = new BatchAnalyzer(
      githubToken.access_token,
      process.env.OPENAI_API_KEY
    )

    // Analyze the three specific repositories from the task
    const results = await batchAnalyzer.analyzeTaskRepositories({
      maxConcurrent: 1,
      delayBetweenRequests: 2000,
      includeAINarratives: true,
      saveToDatabase: true,
      userId: user.id,
      ...options
    })

    // Create a summary record
    const { data: taskAnalysisRecord } = await supabase
      .from('task_analyses')
      .insert({
        user_id: user.id,
        task_type: 'three_repositories',
        repositories: [
          { owner: 'NyxSpecter4', repo: 'bountywarz' },
          { owner: 'NyxSpecter4', repo: 'RWS-CC' },
          { owner: 'NyxSpecter4', repo: 'camel-racing' }
        ],
        results,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
      .catch(() => ({ data: null })) // Ignore if table doesn't exist

    return NextResponse.json({
      status: 'completed',
      task: 'three_repositories_analysis',
      results: {
        profiles: results.profiles.map(profile => ({
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
        summary: results.summary
      },
      recordId: taskAnalysisRecord?.id,
      generatedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Task analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed: ' + (error as Error).message },
      { status: 500 }
    )
  }
}