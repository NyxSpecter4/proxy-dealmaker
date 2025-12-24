import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function fetchRepoDetails(repoName: string) {
  const baseUrl = `https://api.github.com/repos/NyxSpecter4/${repoName}`
  const headers = { 'Accept': 'application/vnd.github.v3+json' }

  // Fetch in parallel
  const [readmeRes, packageRes, contentsRes, commitsRes] = await Promise.all([
    fetch(`${baseUrl}/readme`, { headers }).catch(() => null),
    fetch(`${baseUrl}/contents/package.json`, { headers }).catch(() => null),
    fetch(`${baseUrl}/contents`, { headers }).catch(() => null),
    fetch(`${baseUrl}/commits?per_page=10`, { headers }).catch(() => null)
  ])

  // Parse README
  let readme = ''
  if (readmeRes?.ok) {
    const readmeData = await readmeRes.json()
    if (readmeData.content) {
      readme = Buffer.from(readmeData.content, 'base64').toString('utf-8').slice(0, 2000)
    }
  }

  // Parse package.json
  let packageJson: any = null
  if (packageRes?.ok) {
    const pkgData = await packageRes.json()
    if (pkgData.content) {
      try {
        packageJson = JSON.parse(Buffer.from(pkgData.content, 'base64').toString('utf-8'))
      } catch {}
    }
  }

  // Parse file structure
  let files: string[] = []
  if (contentsRes?.ok) {
    const contents = await contentsRes.json()
    if (Array.isArray(contents)) {
      files = contents.map((f: any) => f.name)
    }
  }

  // Parse commits
  let commits: any[] = []
  let lastCommitDate = ''
  let commitFrequency = ''
  if (commitsRes?.ok) {
    commits = await commitsRes.json()
    if (Array.isArray(commits) && commits.length > 0) {
      lastCommitDate = commits[0]?.commit?.author?.date || ''

      // Calculate frequency
      if (commits.length >= 2) {
        const first = new Date(commits[0]?.commit?.author?.date)
        const last = new Date(commits[commits.length - 1]?.commit?.author?.date)
        const daysDiff = Math.max(1, (first.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
        const commitsPerWeek = (commits.length / daysDiff) * 7
        commitFrequency = commitsPerWeek > 5 ? 'Very Active' : commitsPerWeek > 1 ? 'Active' : commitsPerWeek > 0.25 ? 'Occasional' : 'Stale'
      }
    }
  }

  // Determine tech stack from package.json or files
  const techStack: string[] = []
  if (packageJson?.dependencies) {
    const deps = Object.keys(packageJson.dependencies)
    if (deps.includes('next')) techStack.push('Next.js')
    if (deps.includes('react')) techStack.push('React')
    if (deps.includes('vue')) techStack.push('Vue')
    if (deps.includes('express')) techStack.push('Express')
    if (deps.includes('openai')) techStack.push('OpenAI API')
    if (deps.includes('stripe')) techStack.push('Stripe')
    if (deps.includes('supabase') || deps.includes('@supabase/supabase-js')) techStack.push('Supabase')
    if (deps.includes('prisma') || deps.includes('@prisma/client')) techStack.push('Prisma')
    if (deps.includes('tailwindcss')) techStack.push('Tailwind')
    if (deps.includes('three')) techStack.push('Three.js')
    if (deps.includes('phaser')) techStack.push('Phaser')
    if (deps.includes('unity')) techStack.push('Unity')
    if (deps.includes('ethers')) techStack.push('Ethers.js (Crypto)')
    if (deps.includes('web3')) techStack.push('Web3.js')
    if (deps.includes('socket.io')) techStack.push('Socket.io')
    if (deps.includes('mongoose')) techStack.push('MongoDB')
    if (deps.includes('firebase')) techStack.push('Firebase')
  }

  // Check for config files
  const hasVercel = files.includes('vercel.json') || files.includes('.vercel')
  const hasDocker = files.includes('Dockerfile') || files.includes('docker-compose.yml')
  const hasTests = files.includes('__tests__') || files.includes('test') || files.includes('tests') || files.some(f => f.includes('.test.') || f.includes('.spec.'))
  const hasCI = files.includes('.github')

  return {
    readme: readme.slice(0, 1500),
    packageJson: packageJson ? {
      name: packageJson.name,
      version: packageJson.version,
      scripts: Object.keys(packageJson.scripts || {}),
      dependencies: Object.keys(packageJson.dependencies || {}).slice(0, 20),
      devDependencies: Object.keys(packageJson.devDependencies || {}).slice(0, 10)
    } : null,
    files: files.slice(0, 25),
    techStack,
    lastCommitDate,
    commitFrequency,
    recentCommits: commits.slice(0, 5).map((c: any) => ({
      message: c?.commit?.message?.split('\n')[0]?.slice(0, 100),
      date: c?.commit?.author?.date
    })),
    indicators: {
      hasVercel,
      hasDocker,
      hasTests,
      hasCI,
      hasReadme: readme.length > 100,
      hasPackageJson: !!packageJson
    }
  }
}

export async function GET() {
  try {
    const githubRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100&sort=updated')
    const repos = await githubRes.json()

    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: 'GitHub API error', details: repos.message }, { status: 500 })
    }

    // Filter and get basic info
    const filteredRepos = repos.filter((r: any) => r.name !== 'proxy-dealmaker').slice(0, 10)

    // Fetch detailed info for each repo in parallel
    const repoDetails = await Promise.all(
      filteredRepos.map(async (r: any) => {
        const details = await fetchRepoDetails(r.name)
        return {
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          size: r.size,
          topics: r.topics,
          created_at: r.created_at,
          updated_at: r.updated_at,
          homepage: r.homepage,
          has_pages: r.has_pages,
          ...details
        }
      })
    )

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `You are a startup analyst with ACTUAL CODE ACCESS. You have real data - USE IT.

REPO DATA (README, package.json, files, commits):
${JSON.stringify(repoDetails, null, 2)}

MANDATORY: Reference actual data in analysis. Don't be generic.

For each repo return:
{
  "totalValue": 0,
  "portfolioSummary": "Overview referencing ACTUAL findings from code",
  "topPick": "best repo based on actual completeness",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 0,
    "optimisticValue": 5000,
    "stage": "Concept/MVP/Production based on ACTUAL completeness",

    "codeAnalysis": {
      "completeness": "X% - EXPLAIN: 'Has Next.js setup, OpenAI integration, but missing tests'",
      "techStack": ["ACTUAL dependencies from package.json"],
      "isDeployed": "Yes (has vercel.json + homepage) / No (missing config) / Partial",
      "lastActivity": "YYYY-MM-DD - X days ago",
      "commitFrequency": "from data: Very Active/Active/Stale",
      "codeQuality": "Good (has tests, CI) / Basic (missing tests) / Poor (abandoned)",
      "keyFindings": [
        "SPECIFIC: 'Uses OpenAI API - AI features implemented'",
        "SPECIFIC: 'Has Stripe - payment exists'",
        "SPECIFIC: 'No tests - quality uncertain'",
        "SPECIFIC: 'Last commit 2 days ago added X feature'"
      ]
    },

    "actualDescription": "Based on README content: [summarize what README ACTUALLY says]",

    "the90DayTest": {
      "buildThis": "SPECIFIC based on what's MISSING: 'Add tests (0% exist)' or 'Complete Stripe checkout (integrated but incomplete)'",
      "example": "Based on deps: 'Has Three.js so add 3D viz' or 'Has Phaser so expand game'",
      "testWith": "100 users from [SPECIFIC community for THIS project]",
      "costPerInstall": "$0 organic first",

      "specificMetrics": {
        "session1": {
          "metric": "Session length",
          "target": "Games >6min / SaaS >3min / Content >8min",
          "measureHow": "Add Google Analytics or [tool for this stack]"
        },
        "day1": {
          "metric": "Day 1 Retention",
          "target": "Games 35-50% / SaaS 40-60%",
          "measureHow": "Email/analytics tracking",
          "critical": "Games <20% kill / SaaS <30% kill"
        }
      },

      "successDecision": {
        "strong": ">X% -> proceed (SPECIFIC to project type)",
        "moderate": "Y-X% -> iterate",
        "weak": "<Y% -> kill"
      },

      "timeline": {
        "week1_2": "SPECIFIC: 'Add tests' or 'Deploy to Vercel' or 'Complete payment flow'",
        "week3_4": "Get testers from [SPECIFIC subreddit for this project]",
        "week5_6": "Measure [SPECIFIC metrics for this type]",
        "week7_8": "Decide based on [SPECIFIC threshold]"
      }
    },

    "marketContext": {
      "sector": "SPECIFIC: Gaming/SaaS/Tool based on actual deps",
      "marketSize": "$XB for THIS specific niche",
      "advantage": "SPECIFIC: 'Three.js gives 3D edge' or 'OpenAI integration'",
      "challenge": "SPECIFIC: 'No tests' or 'Payment incomplete' or 'Abandoned 6 months'",
      "competition": "SPECIFIC competitors in this niche"
    },

    "organicTestingChannels": [
      { "platform": "r/[specific subreddit for THIS project]", "expectedReach": "X testers", "cost": "$0" }
    ],

    "pivotTriggers": {
      "ifFeatureXWorks": "SPECIFIC: 'If 3D viz loved but text ignored -> pure 3D tool'",
      "ifFeatureYFails": "SPECIFIC: 'If crypto confuses users -> remove ethers.js, standard payments'",
      "ifRetentionLow": "Salvage [SPECIFIC tech] for different product"
    },

    "nextMilestones": {
      "after90Days": {
        "ifValidated": "SPECIFIC: 'Add test coverage' or 'Scale Supabase backend'",
        "funding": "$X-$Y based on deployed status + traction",
        "valuation": "Deployed + users + revenue = $X / Just code = $0-500"
      }
    },

    "brutalVerdict": "ACTUAL: [X]% complete, [deployed/not], [Active/Stale since DATE]. Worth $Y because [SPECIFIC from code]. Next: [SPECIFIC action]."
  }]
}

RULES:
1. ALWAYS reference actual dependencies (OpenAI, Stripe, Three.js)
2. ALWAYS explain completeness % with reasons
3. ALWAYS use README content
4. ALWAYS mention deployment status
5. ALWAYS reference last commit date
6. Different metrics for different project types
7. If data missing say "No README" or "No deps"
8. USE THE DATA. Be specific. No generic BS.`
      }],
      response_format: { type: 'json_object' }
    })

    if (!completion.choices[0]?.message?.content) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    const analysis = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(analysis)

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze', details: error.message }, { status: 500 })
  }
}
