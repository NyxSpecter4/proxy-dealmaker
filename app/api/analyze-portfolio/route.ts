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
      dependencies: Object.keys(packageJson.dependencies || {}).slice(0, 15),
      devDependencies: Object.keys(packageJson.devDependencies || {}).slice(0, 10)
    } : null,
    files: files.slice(0, 20),
    techStack,
    lastCommitDate,
    commitFrequency,
    recentCommits: commits.slice(0, 5).map((c: any) => ({
      message: c?.commit?.message?.split('\n')[0]?.slice(0, 80),
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
        content: `You are a startup advisor analyzing GitHub repos with REAL data. Give specific metrics-based analysis.

REPO DATA (with actual README, package.json, commits):
${JSON.stringify(repoDetails, null, 2)}

ANALYZE ALL REPOS. For each one, assess:
1. Is it a working project? (check files, package.json, README)
2. Is it deployed? (check homepage, vercel config)
3. Is it abandoned? (check lastCommitDate, commitFrequency)
4. What's the tech stack? (check techStack, dependencies)
5. How complex is it? (check file count, dependencies)

REAL INDUSTRY BENCHMARKS (2024):
- Idle games: D1 35-50%, D7 20%+, DAU/MAU 18%, CPI $4.83
- Shooter: $72B market, high competition
- SaaS: 3-7x ARR, <5% churn

Return JSON:
{
  "totalValue": 0,
  "portfolioSummary": "Honest overview of ALL repos based on actual code analysis",
  "topPick": "best repo based on actual completeness and potential",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 0,
    "optimisticValue": 5000,
    "stage": "Concept/Pre-MVP/MVP/Deployed",

    "codeAnalysis": {
      "completeness": "10-100% based on actual files",
      "techStack": "from actual package.json",
      "isDeployed": true/false,
      "lastActivity": "date and frequency",
      "codeQuality": "assessment based on files/structure"
    },

    "the90DayTest": {
      "buildThis": "specific next step based on ACTUAL code state",
      "example": "concrete example",
      "testWith": "100 users from Reddit, Discord",
      "costPerInstall": "$0 organic vs industry average",
      "specificMetrics": {
        "day1": { "metric": "D1 Retention", "target": ">35%", "critical": "If <20% kill it" }
      },
      "successDecision": {
        "strong": ">40% -> proceed",
        "weak": "<20% -> kill"
      },
      "timeline": {
        "week1_2": "specific task based on current code",
        "week3_4": "testing phase",
        "week5_8": "measure and decide"
      }
    },

    "marketContext": {
      "sector": "based on actual project type",
      "marketSize": "$XB",
      "competition": "realistic assessment"
    },

    "organicTestingChannels": [
      { "platform": "specific subreddit", "expectedReach": "X testers", "cost": "$0" }
    ],

    "pivotTriggers": {
      "ifXWorks": "specific pivot based on actual features"
    },

    "nextMilestones": {
      "after90Days": {
        "ifValidated": "specific next build based on code",
        "funding": "realistic funding path",
        "valuation": "how value increases"
      }
    },

    "brutalVerdict": "Based on ACTUAL code: [completeness]%, [deployed/not], [active/stale]. Worth $X because [specific reasons]."
  }]
}

CRITICAL:
1. Base analysis on ACTUAL repo data (README, files, commits)
2. Note if repo is incomplete, abandoned, or just started
3. Recommend specific next steps based on current code state
4. Be honest about deployment status and code completeness`
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
