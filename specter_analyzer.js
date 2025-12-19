console.log("👻 SPECTER LABS - Repository Analysis");
console.log("=".repeat(40));

const { Octokit } = require("@octokit/rest");
const { createClient } = require('@supabase/supabase-js');

// Initialize clients
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN || 'ghp_test' 
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeRepository(owner, repoName) {
  console.log(`\n🔍 Scanning: ${owner}/${repoName}`);
  
  try {
    // 1. Get repository data
    const { data: repo } = await octokit.repos.get({ owner, repo: repoName });
    const { data: languages } = await octokit.repos.listLanguages({ owner, repo: repoName });
    const { data: commits } = await octokit.repos.listCommits({ owner, repo: repoName, per_page: 3 });
    
    // 2. Calculate metrics
    const totalLOC = Object.values(languages).reduce((a, b) => a + b, 0);
    const primaryLang = Object.keys(languages)[0] || 'Unknown';
    
    // 3. Generate simple thesis (no AI needed for now)
    const thesisMap = {
      'bountywarz': 'Competition platform with gamified engagement mechanics.',
      'RWS-CC': 'Command center dashboard for operational management.',
      'camel-racing': 'Interactive casino-style racing simulation.'
    };
    
    // 4. Prepare analysis
    const analysis = {
      repo_url: repo.html_url,
      metrics: {
        total_lines_of_code: totalLOC,
        primary_language: primaryLang,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        last_commit: commits[0]?.commit?.author?.date || 'Unknown',
        has_issues: repo.has_issues,
        has_wiki: repo.has_wiki,
        size_kb: repo.size
      },
      ai_thesis: thesisMap[repoName] || `A ${primaryLang} project by ${owner}`,
      analyzed_at: new Date().toISOString(),
      raw_analysis: {
        languages: languages,
        description: repo.description,
        created_at: repo.created_at,
        updated_at: repo.updated_at
      }
    };
    
    // 5. Save to database
    const { error } = await supabase
      .from('repository_analyses')
      .upsert(
        { 
          repo_url: analysis.repo_url,
          ...analysis 
        },
        { onConflict: 'repo_url' }
      );
    
    if (error) {
      console.log(`   ❌ DB Error: ${error.message}`);
    } else {
      console.log(`   ✅ ${repoName.toUpperCase()}: ${totalLOC.toLocaleString()} LOC, ${primaryLang}`);
      console.log(`      ${analysis.ai_thesis}`);
    }
    
    return analysis;
    
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("Starting analysis for Specter9Labs portfolio...\n");
  
  const repositories = [
    { owner: 'NyxSpecter4', name: 'bountywarz' },
    { owner: 'NyxSpecter4', name: 'RWS-CC' },
    { owner: 'NyxSpecter4', name: 'camel-racing' }
  ];
  
  const results = [];
  
  for (const repo of repositories) {
    const analysis = await analyzeRepository(repo.owner, repo.name);
    if (analysis) results.push(analysis);
  }
  
  // Summary
  console.log("\n" + "=".repeat(40));
  console.log("📊 SPECTER LABS PORTFOLIO ANALYSIS");
  console.log("=".repeat(40));
  
  results.forEach((r, i) => {
    const name = r.repo_url.split('/').pop();
    console.log(`${i+1}. ${name}`);
    console.log(`   📏 ${r.metrics.total_lines_of_code.toLocaleString()} lines of code`);
    console.log(`   ⚙️  Primary: ${r.metrics.primary_language}`);
    console.log(`   ⭐ ${r.metrics.stars} stars, ${r.metrics.forks} forks`);
    console.log(`   📝 ${r.ai_thesis}`);
    console.log("");
  });
  
  const totalLOC = results.reduce((sum, r) => sum + r.metrics.total_lines_of_code, 0);
  console.log(`🏆 TOTAL PORTFOLIO: ${totalLOC.toLocaleString()} lines of code`);
  console.log("\n✅ Analysis complete. Data saved to repository_analyses table.");
}

// Run it
main().catch(console.error);
