const { Octokit } = require("@octokit/rest");
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeRepo(owner, repo) {
  console.log(`\n🔍 Analyzing ${owner}/${repo}...`);
  
  try {
    // Get basic repo info
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const { data: languages } = await octokit.repos.listLanguages({ owner, repo });
    
    // Get recent commits
    const { data: commits } = await octokit.repos.listCommits({ 
      owner, 
      repo, 
      per_page: 5 
    });
    
    // Calculate primary language
    const primaryLanguage = Object.keys(languages).reduce((a, b) => 
      languages[a] > languages[b] ? a : b
    );
    
    // Create analysis
    const analysis = {
      repo_url: `https://github.com/${owner}/${repo}`,
      metrics: {
        total_lines_of_code: Object.values(languages).reduce((a, b) => a + b, 0),
        primary_language: primaryLanguage,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        last_commit: commits[0]?.commit.author.date || 'Unknown',
        size_kb: repoData.size
      },
      ai_thesis: `Professional analysis pending - ${repoData.description || 'No description'}`,
      analyzed_at: new Date().toISOString()
    };
    
    // Save to database
    const { error } = await supabase
      .from('repository_analyses')
      .insert([analysis]);
    
    if (error) throw error;
    
    console.log(`✅ ${repo}: ${analysis.metrics.total_lines_of_code} LOC, ${primaryLanguage}`);
    return analysis;
    
  } catch (error) {
    console.log(`❌ Failed to analyze ${repo}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting REAL analysis of your 3 repositories...");
  
  const repos = [
    { owner: 'NyxSpecter4', repo: 'bountywarz' },
    { owner: 'NyxSpecter4', repo: 'RWS-CC' },
    { owner: 'NyxSpecter4', repo: 'camel-racing' }
  ];
  
  for (const { owner, repo } of repos) {
    await analyzeRepo(owner, repo);
  }
  
  console.log("\n📊 Analysis complete! Check your database:");
  console.log("SELECT * FROM repository_analyses ORDER BY analyzed_at DESC;");
}

main().catch(console.error);
