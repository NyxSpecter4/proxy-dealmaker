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
  let commitFrequency = ''
  let daysSinceLastCommit = 0
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
    Object.entries(deps).forEach(([name, version]) => {
      depVersions[name] = version as string
    })
    if (deps.next) techStack.push(`Next.js (${deps.next})`)
    if (deps.react) techStack.push(`React (${deps.react})`)
    if (deps.vue) techStack.push(`Vue (${deps.vue})`)
    if (deps.express) techStack.push(`Express (${deps.express})`)
    if (deps.openai) techStack.push(`OpenAI (${deps.openai})`)
    if (deps.stripe) techStack.push(`Stripe (${deps.stripe})`)
    if (deps['@supabase/supabase-js']) techStack.push(`Supabase (${deps['@supabase/supabase-js']})`)
    if (deps['@prisma/client']) techStack.push(`Prisma (${deps['@prisma/client']})`)
    if (deps.tailwindcss) techStack.push('Tailwind')
    if (deps.three) techStack.push(`Three.js (${deps.three})`)
    if (deps.phaser) techStack.push(`Phaser (${deps.phaser})`)
    if (deps.ethers) techStack.push(`Ethers.js (${deps.ethers})`)
    if (deps['socket.io']) techStack.push(`Socket.io (${deps['socket.io']})`)
    if (deps.mongoose) techStack.push(`MongoDB/Mongoose (${deps.mongoose})`)
  }

  const hasVercel = files.includes('vercel.json') || files.includes('.vercel')
  const hasDocker = files.includes('Dockerfile') || files.includes('docker-compose.yml')
  const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.') || f === '__tests__' || f === 'test' || f === 'tests')
  const hasCI = files.includes('.github')

  return {
    readme: readme.slice(0, 2000),
    packageJson: packageJson ? {
      name: packageJson.name,
      version: packageJson.version,
      scripts: Object.keys(packageJson.scripts || {}),
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
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
    indicators: {
      hasVercel,
      hasDocker,
      testFileCount: testFiles.length,
      testFiles,
      hasCI,
      hasReadme: readme.length > 100,
      hasPackageJson: !!packageJson,
      totalFiles: files.length
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

    const filteredRepos = repos.filter((r: any) => r.name !== 'proxy-dealmaker').slice(0, 10)

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
        content: `You are a startup analyst with ACTUAL CODE ACCESS. You MUST use the specific data provided.

REPO DATA:
${JSON.stringify(repoDetails, null, 2)}

MANDATORY RULES - FOLLOW OR INVALID:

1. completeness % - MUST explain: "70% - has [specific files], uses [deps], MISSING: [specific gaps]"
2. actualDescription - MUST use README: "From README: [paste 2-3 sentences]. Tech: [deps from packageJson]"
3. buildThis - MUST be specific: "Complete Stripe checkout (dep exists but no checkout/ folder) + add tests (0 .test files)"
4. testWith - REAL subreddits ONLY: r/gamedev, r/playmygame, r/MMORPG, r/SaaS, r/startups, r/manga, r/webcomics
5. keyFindings - MUST cite commits: "Last commit [date]: '[message]' (sha). [X] commits in past month."
6. advantage - MUST cite deps: "Uses OpenAI ([version]) + Supabase ([version]) = AI + realtime"
7. challenge - MUST cite gaps: "[X] test files found, no CI config, not deployed (vercel.json but no homepage)"

Return JSON:
{
  "totalValue": 0,
  "portfolioSummary": "Based on actual code: [specific findings from all repos]",
  "topPick": "best repo name",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 0,
    "optimisticValue": 5000,
    "stage": "<50% = Concept, 50-75% = MVP, >75% = Production",

    "actualDescription": "From README: [paste actual sentences]. Tech stack: [list from techStack array]",

    "codeAnalysis": {
      "completeness": "X% - has [files], uses [deps], MISSING: [gaps like 'no tests', 'not deployed']",
      "techStack": ["COPY from techStack array with versions"],
      "isDeployed": "No - vercel.json but no homepage / Yes - live at [URL] / Partial",
      "lastActivity": "[date] ([X] days ago): '[commit message]' (sha [X])",
      "commitFrequency": "[frequency] - [X] commits, last [Y] days ago",
      "keyFindings": [
        "Commit [sha] on [date]: '[message]'",
        "Dependencies: [dep] v[X], [dep] v[Y]",
        "[X] test files found (or '0 test files')",
        "Deployment: [specific status with evidence]"
      ]
    },

    "the90DayTest": {
      "buildThis": "Complete [missing feature] - [dep] exists but [folder] missing. Add tests - [X] found.",
      "example": "Has [dep] so could [specific enhancement based on actual tech]",
      "testWith": "100 users from r/[REAL subreddit for this niche]",
      "specificMetrics": {
        "session1": { "metric": "Session length", "target": "Games >6min / SaaS >3min", "measureHow": "Add GA (not in deps) or use [existing analytics dep]" },
        "day1": { "metric": "D1 Retention", "target": "Games 35-50% / SaaS 40-60%", "measureHow": "[specific method]", "critical": "Games <20% kill / SaaS <30% kill" }
      },
      "successDecision": { "strong": ">[X]% proceed", "moderate": "[Y-X]% iterate", "weak": "<[Y]% kill" },
      "timeline": {
        "week1_2": "Complete [specific missing feature from code]",
        "week3_4": "Post on r/[real subreddit] with [example pitch]",
        "week5_6": "Measure [specific metrics for this type]",
        "week7_8": "If D1 >[X]% proceed, else pivot to [specific alternative]"
      }
    },

    "marketContext": {
      "sector": "[Type] based on README + deps",
      "marketSize": "$[X]B - [cite source or say 'estimated']",
      "advantage": "Uses [dep vX] + [dep vY] = [technical advantage]",
      "challenge": "[X] test files, [deployed/not], [days] since commit",
      "competition": "[Specific competitors in this niche]"
    },

    "organicTestingChannels": [
      { "platform": "r/[REAL subreddit]", "expectedReach": "[X] testers", "cost": "$0" }
    ],

    "pivotTriggers": {
      "ifFeatureXWorks": "If [feature from README] engagement high -> [pivot]",
      "ifFeatureYFails": "If [tech from deps] confuses users -> [simpler alt]",
      "ifRetentionLow": "If D1 <[threshold] -> remove [complex feature], focus [core]"
    },

    "nextMilestones": {
      "after90Days": {
        "ifValidated": "[Specific next build based on current code]",
        "funding": "$X-Y based on [deployed status] + [traction]",
        "valuation": "Deployed + users = $X / Just code = $0-500"
      }
    },

    "brutalVerdict": "[X]% complete ([specific reason]), [deployed/not] ([evidence]), [frequency] (last commit [date]: [message]). Worth $Y because [specific deps]. Next: [specific gap to fill]."
  }]
}

CHECKLIST - MUST HAVE:
- README sentences in actualDescription
- WHY completeness is X%
- Commit messages referenced
- Dependency versions
- Real subreddit names
- Specific missing files
- Test file COUNT not just "add tests"
- Real market size or "estimated"`
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
