import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { GitHubClient, parseGitHubUrl } from '@/lib/github-client'
import { RepositoryAnalyzer } from '@/lib/analyzer'

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
    const { repositoryUrl, options = {} } = body

    if (!repositoryUrl) {
      return NextResponse.json(
        { error: 'repositoryUrl is required' },
        { status: 400 }
      )
    }

    // Parse GitHub URL
    const repoInfo = parseGitHubUrl(repositoryUrl)
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      )
    }

    const { owner, repo } = repoInfo

    // Check for existing analysis
    const { data: existingAnalysis } = await supabase
      .from('github_analyses')
      .select('*')
      .eq('user_id', user.id)
      .eq('repository_owner', owner)
      .eq('repository_name', repo)
      .single()

    if (existingAnalysis && existingAnalysis.analysis_status === 'completed') {
      // Return existing analysis if it's less than 24 hours old
      const analysisAge = Date.now() - new Date(existingAnalysis.created_at).getTime()
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (analysisAge < maxAge && !options.forceRefresh) {
        return NextResponse.json({
          analysisId: existingAnalysis.id,
          status: 'completed',
          repository: {
            owner,
            name: repo,
            url: repositoryUrl,
          },
          metrics: existingAnalysis.metrics,
          valuation: existingAnalysis.valuation_insights,
          recommendations: existingAnalysis.recommendations,
          cached: true,
          generatedAt: existingAnalysis.created_at,
        })
      }
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

    // Create analysis record
    const { data: analysisRecord, error: insertError } = await supabase
      .from('github_analyses')
      .insert({
        user_id: user.id,
        repository_owner: owner,
        repository_name: repo,
        repository_url: repositoryUrl,
        analysis_status: 'processing',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create analysis record:', insertError)
      return NextResponse.json(
        { error: 'Failed to start analysis' },
        { status: 500 }
      )
    }

    // For now, run analysis synchronously
    // In production, this should be moved to a background job queue
    try {
      // Initialize GitHub client
      const githubClient = new GitHubClient(githubToken.access_token)
      
      // Fetch repository metrics
      const metrics = await githubClient.getRepositoryMetrics(owner, repo)
      
      // Run analysis
      const analysis = await RepositoryAnalyzer.analyzeRepository(metrics)
      
      // Update analysis record
      const { error: updateError } = await supabase
        .from('github_analyses')
        .update({
          analysis_status: 'completed',
          metrics: analysis.metrics,
          valuation_insights: analysis.valuation,
          recommendations: analysis.recommendations,
          raw_data: metrics,
          completed_at: new Date().toISOString(),
        })
        .eq('id', analysisRecord.id)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Failed to update analysis record:', updateError)
        throw new Error('Failed to save analysis results')
      }

      return NextResponse.json({
        analysisId: analysisRecord.id,
        status: 'completed',
        repository: {
          owner,
          name: repo,
          url: repositoryUrl,
        },
        metrics: analysis.metrics,
        valuation: analysis.valuation,
        recommendations: analysis.recommendations,
        generatedAt: new Date().toISOString(),
      })

    } catch (error) {
      console.error('Analysis processing error:', error)
      
      // Mark as failed
      await supabase
        .from('github_analyses')
        .update({
          analysis_status: 'failed',
          error_message: (error as Error).message,
        })
        .eq('id', analysisRecord.id)
        .eq('user_id', user.id)

      return NextResponse.json(
        { error: 'Analysis failed: ' + (error as Error).message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Analysis request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


// GET endpoint to retrieve analysis results
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
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')

    let query = supabase
      .from('github_analyses')
      .select('*')
      .eq('user_id', user.id)

    if (analysisId) {
      query = query.eq('id', analysisId)
    } else if (owner && repo) {
      query = query.eq('repository_owner', owner).eq('repository_name', repo)
    } else {
      // Return all analyses for user
      query = query.order('created_at', { ascending: false }).limit(20)
    }

    const { data: analyses, error } = await query

    if (error) {
      console.error('Failed to fetch analyses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analyses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      analyses: analyses.map((analysis: any) => ({
        id: analysis.id,
        repository: {
          owner: analysis.repository_owner,
          name: analysis.repository_name,
          url: analysis.repository_url,
        },
        status: analysis.analysis_status,
        metrics: analysis.metrics,
        valuation: analysis.valuation_insights,
        recommendations: analysis.recommendations,
        createdAt: analysis.created_at,
        completedAt: analysis.completed_at,
        error: analysis.error_message,
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
