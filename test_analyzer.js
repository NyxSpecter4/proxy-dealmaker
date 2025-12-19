const { execSync } = require('child_process');
const fs = require('fs');

console.log("🧪 Testing repository analyzer...");

// Check if we can even access GitHub
try {
  const test = execSync('curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user').toString();
  console.log("✅ GitHub API accessible");
} catch (e) {
  console.log("❌ GitHub API failed:", e.message);
}

// Check Supabase connection
try {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log("✅ Supabase client created");
  
  // Try a simple query
  const { data, error } = await supabase.from('repository_analyses').select('count');
  console.log("✅ Database accessible");
} catch (e) {
  console.log("❌ Database error:", e.message);
}
