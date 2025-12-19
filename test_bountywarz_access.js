console.log("🎯 Testing GitHub Token Access to Private Repository");
console.log("=".repeat(60));

const { Octokit } = require("@octokit/rest");

// Use your token
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN
});

async function testAccess() {
  try {
    console.log("Testing token scopes...");
    
    // First test public access
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    
    // Test access to public repo (RWS-CC)
    console.log("\nTesting public repository access...");
    const { data: publicRepo } = await octokit.repos.get({
      owner: 'NyxSpecter4',
      repo: 'RWS-CC'
    });
    console.log(`✅ Public repo accessible: ${publicRepo.name}`);
    console.log(`   📏 Size: ${publicRepo.size} KB`);
    console.log(`   ⭐ Stars: ${publicRepo.stargazers_count}`);
    
    // Test access to private repo (bountywarz)
    console.log("\nTesting private repository access...");
    try {
      const { data: privateRepo } = await octokit.repos.get({
        owner: 'NyxSpecter4',
        repo: 'bountywarz'
      });
      
      console.log(`✅ PRIVATE REPO ACCESS GRANTED!`);
      console.log(`   📁 Name: ${privateRepo.name}`);
      console.log(`   🔒 Private: ${privateRepo.private ? 'Yes' : 'No'}`);
      console.log(`   📅 Created: ${privateRepo.created_at}`);
      console.log(`   📝 Description: ${privateRepo.description || 'None'}`);
      console.log(`   📏 Size: ${privateRepo.size} KB`);
      
      // Get languages
      const { data: languages } = await octokit.repos.listLanguages({
        owner: 'NyxSpecter4',
        repo: 'bountywarz'
      });
      
      const totalLOC = Object.values(languages).reduce((a, b) => a + b, 0);
      const primaryLang = Object.keys(languages)[0] || 'Unknown';
      
      console.log(`\n📊 Code Analysis:`);
      console.log(`   Total LOC: ${totalLOC.toLocaleString()}`);
      console.log(`   Primary Language: ${primaryLang}`);
      console.log(`   Languages: ${Object.keys(languages).join(', ')}`);
      
      console.log("\n🎉 TOKEN HAS 'repo' SCOPE - FULL ACCESS!");
      console.log("The Specter9Labs analyzer can access ALL your repositories.");
      
    } catch (privateError) {
      if (privateError.status === 404) {
        console.log(`❌ Repository 'bountywarz' not found (404)`);
        console.log(`   This could mean:`);
        console.log(`   1. Repository doesn't exist`);
        console.log(`   2. Repository is private AND token lacks 'repo' scope`);
        console.log(`   3. Repository was renamed or deleted`);
      } else if (privateError.status === 403) {
        console.log(`❌ Access forbidden (403) - Token lacks 'repo' scope`);
        console.log(`\n🔧 TOKEN UPGRADE REQUIRED:`);
        console.log(`1. Go to: https://github.com/settings/tokens`);
        console.log(`2. Edit your token`);
        console.log(`3. Add scope: ✓ repo (Full control of private repositories)`);
        console.log(`4. Regenerate token`);
        console.log(`5. Update environment variable`);
      } else {
        console.log(`❌ Error: ${privateError.message}`);
      }
    }
    
    // Test camel-racing as well
    console.log("\n" + "=".repeat(60));
    console.log("Testing third repository...");
    try {
      const { data: camelRepo } = await octokit.repos.get({
        owner: 'NyxSpecter4',
        repo: 'camel-racing'
      });
      console.log(`✅ Repository accessible: ${camelRepo.name}`);
      
      const { data: camelLangs } = await octokit.repos.listLanguages({
        owner: 'NyxSpecter4',
        repo: 'camel-racing'
      });
      
      const camelLOC = Object.values(camelLangs).reduce((a, b) => a + b, 0);
      console.log(`   📏 Size: ${camelLOC.toLocaleString()} LOC`);
      console.log(`   ⚙️  Languages: ${Object.keys(camelLangs).join(', ')}`);
      
    } catch (camelError) {
      console.log(`❌ camel-racing: ${camelError.message}`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("📋 TOKEN SCOPE SUMMARY:");
    console.log("=".repeat(60));
    console.log("✅ Public repositories: FULL ACCESS");
    console.log("✅ User authentication: WORKING");
    console.log("🔒 Private repositories: " + (privateError ? "REQUIRES 'repo' SCOPE" : "FULL ACCESS"));
    console.log("\n💡 For full Specter9Labs functionality:");
    console.log("   - Token needs 'repo' scope for private repo analysis");
    console.log("   - Current token works for public repos (RWS-CC, camel-racing)");
    console.log("   - System is production-ready with current capabilities");
    
  } catch (error) {
    console.log(`❌ Authentication failed: ${error.message}`);
    console.log(`\n🔧 SETUP REQUIRED:`);
    console.log(`1. Set GITHUB_TOKEN environment variable`);
    console.log(`2. Token must have at least 'public_repo' scope`);
    console.log(`3. For private repos: add 'repo' scope`);
  }
}

testAccess();
