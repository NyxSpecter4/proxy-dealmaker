import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const username = 'NyxSpecter4';
    
    // Try to use GitHub token if available
    const githubToken = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MakoThoth/1.0.0'
    };
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    // Fetch repositories from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`, await response.text());
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Filter and format repositories
    const formattedRepos = repos
      .filter((repo: any) => 
        !repo.private && 
        !repo.archived && 
        repo.name !== 'proxy-dealmaker'
      )
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        html_url: repo.html_url,
        private: repo.private,
        archived: repo.archived,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        size: repo.size,
        default_branch: repo.default_branch
      }));

    console.log(`Fetched ${formattedRepos.length} public repositories for ${username}`);
    
    return NextResponse.json({
      success: true,
      repositories: formattedRepos,
      count: formattedRepos.length,
      source: 'github-api'
    });

  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    
    // Return empty array instead of sample data
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch GitHub repositories',
      repositories: [],
      source: 'error'
    }, { status: 500 });
  }
}