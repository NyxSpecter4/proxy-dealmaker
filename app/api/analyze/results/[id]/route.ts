import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id: analysisId } = await params

    // Fetch analysis
    const { data: analysis, error } = await supabase
      .from('github_analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        )
      }
      
      console.error('Failed to fetch analysis:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analysis' },
        { status: 500 }
      )
    }

    // Format response
    const response = {
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
      rawData: analysis.raw_data,
      createdAt: analysis.created_at,
      completedAt: analysis.completed_at,
      error: analysis.error_message,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Fetch analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove an analysis
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id: analysisId } = await params

    // Delete analysis
    const { error } = await supabase
      .from('github_analyses')
      .delete()
      .eq('id', analysisId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to delete analysis:', error)
      return NextResponse.json(
        { error: 'Failed to delete analysis' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully',
    })

  } catch (error) {
    console.error('Delete analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}