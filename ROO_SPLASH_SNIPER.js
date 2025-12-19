// ROO_SPLASH_SNIPER.js
// DIRECT HIT ON CURRENT DEPLOYED CODE

// 1. FETCH ACTUAL DEPLOYED PAGE
const fetchCurrentSplash = async () => {
    console.log('🎯 SNIPING DEPLOYED SPLASH PAGE...\n');
    
    const urls = [
        'https://proxy-dealmaker.vercel.app',
        'https://proxy-dealmaker.vercel.app/_next/static/chunks/pages/index.js',
        'https://proxy-dealmaker.vercel.app/_next/static/chunks/main.js',
        'https://proxy-dealmaker.vercel.app/package.json' // Sometimes exposed
    ];
    
    for (const url of urls) {
        console.log(`🔍 CHECKING: ${url}`);
        try {
            const response = await fetch(url);
            const text = await response.text();
            const preview = text.substring(0, 300).replace(/\n/g, ' ');
            
            console.log(`✅ STATUS: ${response.status}`);
            console.log(`📄 PREVIEW: ${preview}...\n`);
            
            // DETECT CREATE-NEXT-APP TEMPLATE
            if (text.includes('Create Next App') || text.includes('Welcome to Next.js')) {
                console.log('⚠️  ⚠️  ⚠️  CREATE-NEXT-APP TEMPLATE DETECTED!');
                console.log('   This is the default template, NOT your app!\n');
            }
            
            if (text.includes('AI Co-Founder') || text.includes('proxy-dealmaker')) {
                console.log('✅  YOUR ACTUAL APP DETECTED!\n');
            }
            
        } catch (error) {
            console.log(`❌ FAILED: ${error.message}\n`);
        }
    }
};

// 2. CHECK WHAT VERCEL SEES IN REPO
const checkRepoState = () => {
    console.log('🔗 CHECKING GIT STATE VS DEPLOYMENT:\n');
    
    // Current commit
    const execSync = require('child_process').execSync;
    try {
        const currentCommit = execSync('git log --oneline -1').toString().trim();
        const branch = execSync('git branch --show-current').toString().trim();
        
        console.log(`📍 LOCAL BRANCH: ${branch}`);
        console.log(`📍 LATEST COMMIT: ${currentCommit}`);
        console.log(`📍 DEPLOYMENT URL: proxy-dealmaker.vercel.app`);
        
        // Check if this matches Vercel deployment
        console.log('\n🔄 COMPARE WITH VERCEL:');
        console.log('1. Go to: https://vercel.com/nyxspecter4/proxy-dealmaker');
        console.log('2. Click "Deployments" tab');
        console.log('3. Find latest deployment');
        console.log('4. Check commit hash matches:', currentCommit.split(' ')[0]);
        
    } catch (e) {
        console.log('❌ Git check failed:', e.message);
    }
};

// 3. FORCE DEPLOYMENT WITH VISIBLE CHANGE
const deployNuclearTest = () => {
    console.log('\n💥 NUCLEAR DEPLOYMENT TEST - FORCE VISIBLE CHANGE:\n');
    
    const fs = require('fs');
    const testFilePath = 'public/ROO_NUCLEAR_TEST.html';
    
    const nuclearHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>🔥 ROO NUCLEAR TEST - PROXY-DEALMAKER</title>
    <style>
        body { 
            background: black; 
            color: red; 
            font-family: monospace;
            padding: 50px;
        }
        h1 { color: #ff0000; text-shadow: 0 0 20px red; }
        .timestamp { color: #00ff00; }
    </style>
</head>
<body>
    <h1>🔥 ROO NUCLEAR DEPLOYMENT TEST 🔥</h1>
    <h2>If you see this, deployment WORKS but app is wrong</h2>
    <p>Project: proxy-dealmaker</p>
    <p>Time: <span class="timestamp">${new Date().toISOString()}</span></p>
    <p>Commit: ${require('child_process').execSync('git rev-parse --short HEAD').toString().trim()}</p>
    <p><strong>DIAGNOSIS:</strong> Vercel is deploying SOMETHING, but not your actual app.</p>
</body>
</html>`;
    
    fs.writeFileSync(testFilePath, nuclearHTML);
    console.log(`✅ Created: ${testFilePath}`);
    console.log(`🌐 Access at: https://proxy-dealmaker.vercel.app/ROO_NUCLEAR_TEST.html`);
    console.log('\n🚀 COMMANDS TO DEPLOY:');
    console.log('git add .');
    console.log('git commit -m "ROO NUCLEAR TEST"');
    console.log('git push origin main');
};

// 4. CHECK NEXT.JS ACTUAL ROUTES
const checkNextJSStructure = () => {
    console.log('\n📁 CHECKING NEXT.JS ACTUAL STRUCTURE:\n');
    
    const fs = require('fs');
    const paths = {
        'app/page.tsx': 'Next.js 13+ App Router',
        'app/page.js': 'Next.js 13+ App Router (JS)',
        'pages/index.tsx': 'Pages Router',
        'pages/index.js': 'Pages Router (JS)',
        'src/app/page.tsx': 'Src directory App Router',
        'src/pages/index.tsx': 'Src directory Pages Router'
    };
    
    for (const [path, description] of Object.entries(paths)) {
        if (fs.existsSync(path)) {
            const content = fs.readFileSync(path, 'utf8').substring(0, 200);
            console.log(`✅ FOUND: ${path}`);
            console.log(`   Type: ${description}`);
            console.log(`   Preview: ${content.replace(/\n/g, ' ')}...\n`);
            return path; // Found the main route
        }
    }
    
    console.log('❌ NO NEXT.JS ROUTE FOUND! That explains everything.');
    console.log('   Vercel is serving default template because you have no route file.');
};

// RUN ALL CHECKS
(async () => {
    console.log('='.repeat(60));
    console.log('🔥 ROO SPLASH PAGE SNIPER DIAGNOSTIC 🔥');
    console.log('='.repeat(60));
    
    checkNextJSStructure();
    await fetchCurrentSplash();
    checkRepoState();
    deployNuclearTest();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 IMMEDIATE ACTION REQUIRED:');
    console.log('1. Run: node ROO_SPLASH_SNIPER.js');
    console.log('2. Check: https://proxy-dealmaker.vercel.app/ROO_NUCLEAR_TEST.html');
    console.log('3. If test page works → Your app files are missing/wrong');
    console.log('4. If test page fails → Vercel not deploying at all');
    console.log('='.repeat(60));
})();