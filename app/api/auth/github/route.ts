import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // First step: Redirect user to GitHub for authorization
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
    githubAuthUrl.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!)
    githubAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/github`)
    githubAuthUrl.searchParams.set('scope', 'repo,read:user,read:org')
    githubAuthUrl.searchParams.set('state', crypto.randomUUID())
    
    return NextResponse.redirect(githubAuthUrl.toString())
  }

  // Second step: Exchange code for access token
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/github`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error)
    }

    const accessToken = tokenData.access_token

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const userData = await userResponse.json()

    // Store or update user in Supabase
    const { data: { user }, error: supabaseError } = await supabase.auth.getUser()
    
    if (supabaseError || !user) {
      // User not authenticated with Supabase, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Store GitHub token in Supabase (encrypted or in a separate table)
    const { error: updateError } = await supabase
      .from('user_github_tokens')
      .upsert({
        user_id: user.id,
        github_user_id: userData.id,
        github_login: userData.login,
        access_token: accessToken, // In production, encrypt this!
        scope: tokenData.scope,
        token_type: tokenData.token_type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (updateError) {
      console.error('Failed to store GitHub token:', updateError)
      // Continue anyway - the user can still use the app
    }

    // Redirect to dashboard or repository analyzer
    return NextResponse.redirect(new URL('/dashboard', request.url))

  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent((error as Error).message)}`, request.url)
    )
  }
}