import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function fetchRepoDetails(repoName: string) {
  const baseUrl = `https://api.github.com/repos/NyxSpecter4/${repoName}`
  const headers = { 'Accept': 'application/vnd.github.v3+json' }

  const [readmeRes, packageRes, contentsRes, commitsRes] = await Promise.all([
    fetch(`${baseUrl}/readme`, { headers }).catch(() => null),
    fetch(`${baseUrl}/contents/package.json`, { headers }).catch(() => null),
    fetch(`${baseUrl}/contents`, { headers }).catch(() => null),
    fetch(`${baseUrl}/commits?per_page=10`, { headers }).catch(() => null)
  ])

  let readme = ''
  if (readmeRes?.ok) {
    const readmeData = await readmeRes.json()
    if (readmeData.content) {
      readme = Buffer.from(readmeData.content, 'base64').toString('utf-8').slice(0, 2000)
    }
  }

  let packageJson: any = null
  if (packageRes?.ok) {
    const pkgData = await packageRes.json()
    if (pkgData.content) {
      try {
        packageJson = JSON.parse(Buffer.from(pkgData.content, 'base64').toString('utf-8'))
      } catch {}
    }
  }

  let files: string[] = []
  if (contentsRes?.ok) {
    const contents = await contentsRes.json()
    if (Array.isArray(contents)) {
      files = contents.map((f: any) => f.name)
    }
  }

  let commits: any[] = []
  let lastCommitDate = ''
  let daysSinceLastCommit = 0
  let commitFrequency = ''
  if (commitsRes?.ok) {
    commits = await commitsRes.json()
    if (Array.isArray(commits) && commits.length > 0) {
      lastCommitDate = commits[0]?.commit?.author?.date || ''
      daysSinceLastCommit = Math.floor((Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24))
      if (commits.length >= 2) {
        const first = new Date(commits[0]?.commit?.author?.date)
        const last = new Date(commits[commits.length - 1]?.commit?.author?.date)
        const daysDiff = Math.max(1, (first.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
        const commitsPerWeek = (commits.length / daysDiff) * 7
        commitFrequency = commitsPerWeek > 5 ? 'Very Active' : commitsPerWeek > 1 ? 'Active' : commitsPerWeek > 0.25 ? 'Occasional' : 'Stale'
      }
    }
  }

  const techStack: string[] = []
  const depVersions: Record<string, string> = {}
  if (packageJson?.dependencies) {
    const deps = packageJson.dependencies
    Object.entries(deps).forEach(([name, version]) => { depVersions[name] = version as string })
    if (deps.next) techStack.push(`Next.js (${deps.next})`)
    if (deps.react) techStack.push(`React (${deps.react})`)
    if (deps.openai) techStack.push(`OpenAI (${deps.openai})`)
    if (deps.stripe) techStack.push(`Stripe (${deps.stripe})`)
    if (deps['@supabase/supabase-js']) techStack.push(`Supabase (${deps['@supabase/supabase-js']})`)
    if (deps.three) techStack.push(`Three.js (${deps.three})`)
    if (deps.phaser) techStack.push(`Phaser (${deps.phaser})`)
    if (deps.ethers) techStack.push(`Ethers.js (${deps.ethers})`)
  }

  const hasVercel = files.includes('vercel.json')
  const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.') || f === '__tests__')
  const hasCI = files.includes('.github')

  return {
    readme: readme.slice(0, 2000),
    packageJson: packageJson ? {
      name: packageJson.name,
      version: packageJson.version,
      scripts: Object.keys(packageJson.scripts || {}),
      dependencies: Object.keys(packageJson.dependencies || {}),
      depVersions
    } : null,
    files,
    techStack,
    lastCommitDate,
    daysSinceLastCommit,
    commitFrequency,
    recentCommits: commits.slice(0, 5).map((c: any) => ({
      message: c?.commit?.message?.split('\n')[0]?.slice(0, 120),
      date: c?.commit?.author?.date,
      sha: c?.sha?.slice(0, 7)
    })),
    indicators: { hasVercel, testFileCount: testFiles.length, hasCI, hasReadme: readme.length > 100, totalFiles: files.length }
  }
}

export async function GET() {
  try {
    const githubRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100&sort=updated')
    const repos = await githubRes.json()
    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: 'GitHub API error', details: repos.message }, { status: 500 })
    }

    const filteredRepos = repos.filter((r: any) => r.name !== 'proxy-dealmaker').slice(0, 10)
    const repoDetails = await Promise.all(
      filteredRepos.map(async (r: any) => {
        const details = await fetchRepoDetails(r.name)
        return { name: r.name, description: r.description, language: r.language, stars: r.stargazers_count, homepage: r.homepage, ...details }
      })
    )

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `You are a venture analyst preparing an investment memo. Give institutional-quality analysis.

REPO DATA:
${JSON.stringify(repoDetails, null, 2)}

MANDATORY: No placeholders. Replace ALL "X", "Y", "estimated" with actual numbers.

Return JSON:
{
  "totalValue": 0,
  "portfolioSummary": "Investment-grade overview with specific findings",
  "topPick": "best repo name",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 0,
    "optimisticValue": 5000,
    "riskAdjustedValue": 250,
    "stage": "Concept/MVP/Production",

    "executiveSummary": "2-3 sentences from README + tech stack + last commit. Example: '[Tech] enables [capability] in [$XB market]. Last commit [date]: [message]. Missing: [gaps].'",

    "technicalDebt": {
      "score": "7/10",
      "breakdown": {
        "testing": "0/10 - 0 test files found",
        "deployment": "3/10 - vercel.json exists but not deployed",
        "documentation": "6/10 - README exists, no API docs",
        "codeQuality": "8/10 - TypeScript, clean structure",
        "dependencies": "7/10 - 15 deps, list outdated ones"
      },
      "technicalRisks": ["No tests = unknown bugs", "Not deployed = can't validate"],
      "costToFix": "$2k-$5k (80hrs @ $50/hr)"
    },

    "competitiveAnalysis": {
      "directCompetitors": [{ "name": "Real competitor", "metrics": "10k DAU, $500k ARR", "yourEdge": "AI (OpenAI vX) vs their static" }],
      "marketPosition": "Position in $XB market",
      "moatStrength": "Weak/Medium/Strong - reasoning"
    },

    "revenueProjections": {
      "year1": {
        "assumptions": ["10k users @ $4.83 CPI = $48k", "35% D1 = 3.5k active", "2% convert @ $9.99 = $700/mo"],
        "realistic": "-$99k (investment)",
        "upside": "$20k if viral"
      },
      "year2": {
        "assumptions": ["50k users, 40% D1, 3% convert"],
        "realistic": "$72k ARR"
      },
      "breakEven": "Month 18-24"
    },

    "goToMarketStrategy": {
      "phase1_organic": {
        "channels": [
          { "platform": "r/MMORPG (2.1M members)", "expectedCPI": "$0", "reach": "1000-5000 views", "conversion": "1-2%", "timeline": "Week 1-4" },
          { "platform": "Discord gaming servers", "expectedCPI": "$0", "reach": "5000-10000", "conversion": "2-3%", "timeline": "Week 2-8" }
        ],
        "target": "500 users, $0, 8 weeks"
      },
      "phase2_paid": {
        "channels": [{ "platform": "Facebook Gaming Ads", "expectedCPI": "$3-$6", "budget": "$5k", "reach": "833-1667 users" }],
        "target": "5k users, $20k, 6 months"
      }
    },

    "fundingRoadmap": {
      "bootstrap": { "milestone": "1k users, 30% D1", "valuation": "$0", "timeline": "Month 0-6" },
      "angel": { "milestone": "5k users, 35% D1, $1k MRR", "valuation": "$50k-$150k", "funding": "$25k-$50k @ 20-30%", "timeline": "Month 7-12" },
      "seed": { "milestone": "50k users, $10k MRR", "valuation": "$500k-$1.5M", "funding": "$150k-$500k", "timeline": "Month 13-24" }
    },

    "exitScenarios": {
      "acquihire": { "buyer": "Gaming studios", "value": "$100k-$300k", "probability": "15%" },
      "strategic": { "buyer": "Platforms wanting AI", "value": "$1M-$5M", "probability": "5%" },
      "shutdown": { "value": "$0", "probability": "75%" },
      "expectedValue": "$0x75% + $200kx15% + $3Mx5% = $180k EV"
    },

    "the90DayTest": {
      "buildThis": "SPECIFIC: Add 15 test files. Deploy to Vercel. Complete Stripe checkout (dep exists, no checkout/).",
      "weekByWeek": {
        "week1": "Write 15 tests for core functions. 60% coverage.",
        "week2": "Deploy + monitoring. Fix bugs.",
        "week3": "Complete Stripe. Test $1 transactions.",
        "week4": "Launch r/MMORPG. Goal: 100 signups.",
        "week5": "Track D1 daily. Target: >30%.",
        "week6": "A/B test AI vs static. Measure session delta.",
        "week7": "Analyze: D1 >35% AND session >6min = proceed.",
        "week8": "Decide: >35% = raise $25k. <25% = pivot/kill."
      },
      "specificMetrics": {
        "d1": "35% = STRONG. <20% = KILL.",
        "session": "6+ min = STRONG. <3min = weak loop.",
        "conversion": "2% free->paid = viable. <0.5% = broken.",
        "cac": "$0 organic. Paid <$5. >$10 = unsustainable.",
        "ltv": "2% @ $9.99 x 6mo = $60 LTV. Need CAC <$20."
      }
    },

    "riskAssessment": {
      "technicalRisk": "MEDIUM - 70% complete, 0 tests",
      "marketRisk": "HIGH - 90% games fail",
      "executionRisk": "HIGH - solo dev",
      "probabilityOfSuccess": {
        "1kUsers": "40%",
        "10kUsers": "15%",
        "profitability": "5%",
        "exit500k": "3%"
      }
    },

    "brutalVerdict": "[X]% complete ([files], missing [gaps]). Last commit [date]: '[message]' (sha). Worth $0 now. Risk-adjusted: $250 (5% x $5k). Recommendation: 90-day test. If D1 >35% with 1k users = $50k-$150k potential. If <25% = kill. EV of test: 5% x $1M = $50k vs 90 days ($11k) = 4.5x ROI."
  }]
}

FILL ALL NUMBERS:
- "35% D1" not ">X%"
- "$72B market" not "estimated"
- "100-300 users" not "X testers"
- "r/MMORPG (2.1M)" not just "r/MMORPG"`
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
