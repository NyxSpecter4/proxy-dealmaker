// ROO_ENV_CHECK.js
// CHECKING ALL SETUP FOR ROO CODESPACES

const fs = require('fs');
const path = require('path');

console.log('🔍 ROO CODESPACES ENVIRONMENT DIAGNOSTIC 🔍\n');

// 1. Check for existing env files
const envFiles = [
  '.env.local',
  '.env',
  '.env.development',
  '.env.production'
];

console.log('📁 ENVIRONMENT FILES:');
envFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '📭'} ${file}`);
  
  if (exists) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      console.log(`     Contains ${lines.length} variables`);
      
      // Check for specific vars (without exposing values)
      const vars = lines.map(line => line.split('=')[0]);
      if (vars.includes('OPENAI_API_KEY')) console.log('     ✅ OPENAI_API_KEY found');
      if (vars.includes('SUPABASE_URL')) console.log('     ✅ SUPABASE_URL found');
      if (vars.includes('SUPABASE_ANON_KEY')) console.log('     ✅ SUPABASE_ANON_KEY found');
      if (vars.includes('GITHUB_TOKEN')) console.log('     ✅ GITHUB_TOKEN found');
    } catch (e) {
      console.log(`     ❌ Error reading: ${e.message}`);
    }
  }
});

// 2. Check Vercel environment (via API if possible)
console.log('\n🚀 VERCEL ENVIRONMENT STATUS:');
console.log('   To check Vercel env vars, visit:');
console.log('   https://vercel.com/nyxspecter4/proxy-dealmaker/settings/environment-variables');
console.log('\n   Expected variables for AI Co-Founder:');
console.log('   • OPENAI_API_KEY');
console.log('   • OPENAI_ORG_ID (optional)');
console.log('   • SUPABASE_URL');
console.log('   • SUPABASE_ANON_KEY');
console.log('   • SUPABASE_SERVICE_ROLE_KEY');
console.log('   • GITHUB_TOKEN (for Codespaces automation)');

// 3. Check current Codespaces environment
console.log('\n💻 CODESPACES ENVIRONMENT:');
const codespacesVars = [
  'CODESPACE_NAME',
  'GITHUB_TOKEN',
  'GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN'
];

codespacesVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`   ${value ? '✅' : '❌'} ${varName}: ${value ? 'SET' : 'NOT SET'}`);
});

// 4. Check if we're actually IN Codespaces
const inCodespaces = process.env.CODESPACES === 'true' || process.env.CODESPACE_NAME;
console.log(`\n📍 LOCATION: ${inCodespaces ? '🚀 INSIDE GITHUB CODESPACES' : '🖥️ LOCAL MACHINE'}`);

// 5. ROO Extension Specific Check
console.log('\n🤖 ROO EXTENSION STATUS:');
console.log('   ROO is GitHub\'s AI assistant for Codespaces');
console.log('   It should appear in the VS Code sidebar');
console.log('   If not visible:');
console.log('   1. Open Extensions panel (Ctrl+Shift+X)');
console.log('   2. Search "GitHub Codespaces"');
console.log('   3. Ensure ROO chat is enabled');

// 6. Generate env template if missing
if (!envFiles.some(f => fs.existsSync(f))) {
  console.log('\n📝 GENERATING .env.local TEMPLATE:');
  const template = `# ROO AI CO-FOUNDER ENVIRONMENT
# Add to Vercel: https://vercel.com/nyxspecter4/proxy-dealmaker/settings/environment-variables

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your-key-here
OPENAI_ORG_ID=org-your-org-id

# Supabase (Database & Auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ-your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ-your-service-key

# GitHub (For Codespaces/automation)
GITHUB_TOKEN=ghp-your-token

# Next.js
NEXT_PUBLIC_APP_URL=https://proxy-dealmaker.vercel.app

# Optional: Stripe for payments
# STRIPE_SECRET_KEY=sk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
`;
  
  fs.writeFileSync('.env.local.template', template);
  console.log('   ✅ Created .env.local.template');
  console.log('   Fill with your actual values and rename to .env.local');
}

console.log('\n🎯 IMMEDIATE ACTIONS:');
console.log('1. Check Vercel env vars at the link above');
console.log('2. If missing, add: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY');
console.log('3. Test AI functionality at: https://proxy-dealmaker.vercel.app');
console.log('4. ROO (Codespaces) should be in VS Code sidebar → chat icon');

console.log('\n🔧 QUICK ROO TEST IN CODESPACES:');
console.log('   In VS Code, open ROO chat (chat icon in sidebar)');
console.log('   Ask: "What environment variables are set in this codespace?"');
console.log('   ROO can help debug and suggest fixes!');