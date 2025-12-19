console.log("🎯 FINAL STEP: Analyzing Private bountywarz Repository");
console.log("=".repeat(60));

const { Octokit } = require("@octokit/rest");
const { createClient } = require('@supabase/supabase-js');

// Use your token with 'repo' scope
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN_NEW
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeBountywarz() {
  try {
    console.log("1. Testing token access to private repo...");
    
    // Test if token can access the private repo
    const { data: repo } = await octokit.repos.get({
      owner: 'NyxSpecter4',
      repo: 'bountywarz'
    });
    
    console.log(`✅ Token has access to private 'bountywarz'`);
    console.log(`   📁 Visibility: ${repo.private ? 'Private' : 'Public'}`);
    console.log(`   📅 Created: ${repo.created_at}`);
    console.log(`   📝 Description: ${repo.description || 'None'}`);
    
    console.log("\n2. Analyzing codebase...");
    const { data: languages } = await octokit.repos.listLanguages({
      owner: 'NyxSpecter4',
      repo: 'bountywarz'
    });
    
    const totalLOC = Object.values(languages).reduce((a, b) => a + b, 0);
    const primaryLang = Object.keys(languages)[0] || 'Unknown';
    const langBreakdown = Object.entries(languages)
      .map(([lang, count]) => `${lang}: ${count.toLocaleString()} LOC`)
      .join(', ');
    
    console.log(`✅ Code analysis complete:`);
    console.log(`   📏 Total: ${totalLOC.toLocaleString()} lines of code`);
    console.log(`   ⚙️  Primary: ${primaryLang}`);
    console.log(`   📊 Breakdown: ${langBreakdown}`);
    
    console.log("\n3. Saving to database...");
    const analysis = {
      repo_url: repo.html_url,
      metrics: {
        total_lines_of_code: totalLOC,
        primary_language: primaryLang,
        language_breakdown: languages,
        is_private: true,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        size_kb: repo.size,
        created_at: repo.created_at,
        updated_at: repo.updated_at
      },
      ai_thesis: `Private ${primaryLang} competition platform - ${repo.description || 'Bounty-based challenge system'}`,
      analyzed_at: new Date().toISOString(),
      pitch_data: {
        hook: `A proprietary ${primaryLang} competition platform for engagement and rewards.`,
        problem: 'Traditional reward systems lack gamification and scalable challenge mechanics.',
        solution: 'Automated bounty system with competition dynamics and community engagement.',
        technical_edge: `Built with ${primaryLang}, featuring scalable challenge architecture.`,
        acquisition_case: 'Strategic addition for gaming, community, or crypto platforms.',
        ask: 'Request detailed technical briefing'
      }
    };
    
    const { error } = await supabase
      .from('repository_analyses')
      .upsert(
        { repo_url: analysis.repo_url, ...analysis },
        { onConflict: 'repo_url' }
      );
    
    if (error) throw error;
    
    console.log("✅ Saved to database!");
    console.log("\n4. Portfolio summary:");
    
    // Get all 3 projects for comparison
    const { data: allProjects } = await supabase
      .from('repository_analyses')
      .select('repo_url, metrics->total_lines_of_code, metrics->primary_language, metrics->is_private')
      .order('analyzed_at', { ascending: false })
      .limit(3);
    
    console.log("=".repeat(60));
    console.log("📊 SPECTER9LABS COMPLETE PORTFOLIO");
    console.log("=".repeat(60));
    
    allProjects?.forEach((p, i) => {
      const name = p.repo_url.split('/').pop();
      const loc = p.metrics?.total_lines_of_code || 0;
      const lang = p.metrics?.primary_language || 'Unknown';
      const isPrivate = p.metrics?.is_private ? '🔒' : '🔓';
      console.log(`${i+1}. ${name} ${isPrivate}`);
      console.log(`   ${loc.toLocaleString().padStart(8)} LOC | ${lang}`);
    });
    
    const totalPortfolioLOC = allProjects?.reduce((sum, p) => 
      sum + (p.metrics?.total_lines_of_code || 0), 0) || 0;
    
    console.log("=".repeat(60));
    console.log(`🏆 TOTAL PORTFOLIO: ${totalPortfolioLOC.toLocaleString()} lines of code`);
    console.log(`📈 ${allProjects?.length || 0} projects ready for investor showcase`);
    console.log("=".repeat(60));
    
    console.log("\n🎉 SPECTER9LABS IS LIVE!");
    console.log("Visit: https://proxy-dealmaker.vercel.app/showroom");
    
  } catch (error) {
    console.log(`❌ Analysis failed: ${error.message}`);
    
    if (error.status === 404) {
      console.log("\n🔧 TOKEN SETUP REQUIRED:");
      console.log("1. Go to: https://github.com/settings/tokens/new");
      console.log("2. Create token named 'Specter9Labs-Analyzer'");
      console.log("3. Select scope: ✓ repo (Full control of private repositories)");
      console.log("4. Generate and copy token");
      console.log("5. Run: export GITHUB_TOKEN_NEW='your_token_here'");
      console.log("6. Re-run this script");
    } else if (error.status === 403) {
      console.log("\n⚠️  Token lacks 'repo' scope for private repository access");
    }
  }
}

// Run it
analyzeBountywarz();
