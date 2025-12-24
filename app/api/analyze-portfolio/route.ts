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

    // Override bountywarz with FULL researched investor data
    const projects = analysis.projects || [];
    const bountywarzIndex = projects.findIndex((p: any) => p.name === 'bountywarz');
    if (bountywarzIndex !== -1) {
      projects[bountywarzIndex] = {
        ...projects[bountywarzIndex],
        ...{
                "name": "bountywarz",
                "realisticValue": 0,
                "optimisticValue": 25000,
                "riskAdjustedValue": 1250,
                "stage": "Alpha",
                "executiveSummary": "MMORPG wrapper for cybersecurity education with AI coach 'CORTEX'. 815+ planets teaching real pentesting across 144 galactic sectors mapped to real companies (Tesla, Google, AWS). Supabase + OpenAI + Gemini. Deployed at https://bountywarz.vercel.app but 0 users, 0 stars. Core product (CORTEX AI) not built yet.",
                "technicalDebt": {
                        "score": "4/10",
                        "breakdown": {
                                "testing": "0/10 - 0 test files across 165 files",
                                "deployment": "7/10 - Live at bountywarz.vercel.app, working",
                                "documentation": "8/10 - Extensive MASTER_DOC_V5.md",
                                "codeQuality": "3/10 - 291KB monolithic HTML file, no TypeScript, no modules",
                                "dependencies": "8/10 - Current: Supabase ^2.81.0, OpenAI ^6.9.1, Gemini ^0.24.1"
                        },
                        "technicalRisks": [
                                "Single 291KB HTML file = unmaintainable",
                                "0 tests = unknown bug count",
                                "No TypeScript = silent failures",
                                "Performance: 978k bug collision calcs/sec"
                        ],
                        "costToFix": "$15k-$25k (300-500 hours @ $50/hr)"
                },
                "competitiveAnalysis": {
                        "directCompetitors": [
                                {
                                        "name": "TryHackMe",
                                        "metrics": "1.5M+ users, $3.8M Series A",
                                        "advantage": "Established brand, 2-year head start",
                                        "yourEdge": "MMORPG gamification + CORTEX AI (not built)"
                                },
                                {
                                        "name": "HackTheBox",
                                        "metrics": "1.8M+ users, $10.6M Series A",
                                        "advantage": "Largest CTF community",
                                        "yourEdge": "Play-to-earn crypto + narrative"
                                },
                                {
                                        "name": "Immersive Labs",
                                        "metrics": "$189M total funding",
                                        "advantage": "B2B contracts",
                                        "yourEdge": "Consumer-focused, gamified"
                                }
                        ],
                        "marketPosition": "Late entrant in $15.3B cybersecurity education market (14.3% CAGR)",
                        "moatStrength": "WEAK - Core differentiator (CORTEX AI) not built"
                },
                "revenueProjections": {
                        "year1": {
                                "scenario": "Complete CORTEX MVP, launch to 1k users",
                                "assumptions": [
                                        "Finish 122 template sectors",
                                        "Build CORTEX AI (0% complete)",
                                        "1k organic users",
                                        "30% D1 retention"
                                ],
                                "realistic": "-$60k (opportunity cost)",
                                "upside": "$5k sponsorships"
                        },
                        "year2": {
                                "scenario": "Prove CORTEX creates employable talent",
                                "assumptions": [
                                        "10k users",
                                        "100 job placements",
                                        "$10k MRR"
                                ],
                                "realistic": "$120k ARR"
                        },
                        "breakEven": "Month 18-24 IF premium model works"
                },
                "goToMarketStrategy": {
                        "phase1_organic": {
                                "channels": [
                                        {
                                                "platform": "r/cybersecurity (1.2M)",
                                                "expectedCPI": "$0",
                                                "reach": "5k-10k views",
                                                "conversion": "1-2%",
                                                "timeline": "Week 1-2"
                                        },
                                        {
                                                "platform": "r/netsec (520k)",
                                                "expectedCPI": "$0",
                                                "reach": "2k-5k views",
                                                "conversion": "2-3%",
                                                "timeline": "Week 2-3"
                                        },
                                        {
                                                "platform": "HackerNews Show HN",
                                                "expectedCPI": "$0",
                                                "reach": "10k-50k views",
                                                "conversion": "0.5-1%",
                                                "timeline": "Week 3-4"
                                        }
                                ],
                                "target": "300-1000 users, $0 spent, 8 weeks"
                        },
                        "phase2_paid": {
                                "channels": [
                                        {
                                                "platform": "LinkedIn Ads",
                                                "expectedCPI": "$5-$10",
                                                "budget": "$5k test",
                                                "reach": "500-1000 users",
                                                "conversion": "40%",
                                                "timeline": "Month 4-6"
                                        }
                                ],
                                "target": "3k users, $10k spent, 6 months"
                        }
                },
                "fundingRoadmap": {
                        "bootstrap": {
                                "milestone": "CORTEX MVP, 1k users, 30% D1",
                                "valuation": "$0",
                                "timeline": "Month 0-6"
                        },
                        "angel": {
                                "milestone": "10 users land jobs, 3k users",
                                "valuation": "$100k-$300k",
                                "funding": "$50k-$100k @ 20-40%",
                                "timeline": "Month 7-18"
                        },
                        "seed": {
                                "milestone": "10k users, 100 placements, $120k ARR",
                                "valuation": "$1M-$3M",
                                "funding": "$300k-$750k",
                                "timeline": "Month 19-30"
                        }
                },
                "exitScenarios": {
                        "acquihire": {
                                "buyer": "TryHackMe/HackTheBox",
                                "value": "$200k-$500k",
                                "probability": "10%",
                                "timeline": "18-24 months"
                        },
                        "strategic": {
                                "buyer": "Coursera/Udemy/LinkedIn Learning",
                                "value": "$2M-$10M if proven",
                                "probability": "3%",
                                "timeline": "30-36 months"
                        },
                        "shutdown": {
                                "value": "$0",
                                "probability": "87%",
                                "timeline": "6-24 months"
                        },
                        "expectedValue": "$0x87% + $350kx10% + $6Mx3% = $215k EV"
                },
                "riskAssessment": {
                        "technicalRisk": "VERY HIGH - 291KB monolith, 0 tests, CORTEX not built",
                        "marketRisk": "HIGH - 90% of games fail, competing with $189M funded Immersive Labs",
                        "executionRisk": "VERY HIGH - Solo dev, 122/144 sectors incomplete",
                        "competitiveRisk": "HIGH - TryHackMe/HackTheBox have 1.5M+ users, 2+ year head start",
                        "probabilityOfSuccess": {
                                "reaching1kUsers": "30%",
                                "reaching10kUsers": "10%",
                                "profitability": "3%",
                                "exit500k": "2%"
                        }
                },
                "the90DayTest": {
                        "buildThis": "1. Modularize 291KB hunt.html. 2. Add 20 core tests. 3. Build CORTEX MVP. 4. Complete 50 more sectors. 5. Fix spawn bugs.",
                        "example": "Has Supabase + OpenAI + Gemini already integrated. Expand CORTEX to analyze player performance across all 815 planets and suggest personalized learning paths.",
                        "testWith": "100 users from r/cybersecurity (1.2M members), r/netsec (520k), HackerNews Show HN",
                        "costPerInstall": "$0 organic (Reddit/HN) vs $5-$10 paid LinkedIn later",
                        "weekByWeek": {
                                "week1_2": "Refactor hunt.html into 5 modules (<50KB each). Set up Jest testing framework.",
                                "week3_4": "Write 20 tests for core functions (flag capture, CTF success, crypto rewards, spawn). Build CORTEX v0.1.",
                                "week5_6": "Content sprint: Complete 25 sectors. CORTEX tracks CTF success rates, identifies weak skills.",
                                "week7_8": "Launch on Reddit/HN. Measure D1 retention daily. Decide: angel ($50k-$100k) or pivot."
                        },
                        "specificMetrics": {
                                "d1": {
                                        "metric": "Day 1 Retention",
                                        "target": "30% D1 (TryHackMe ~40%, <20% = KILL)",
                                        "measureHow": "Supabase auth logs - count users who return within 24hrs",
                                        "critical": "If <20% D1 after 100 users, pivot or kill MMORPG wrapper"
                                },
                                "session": {
                                        "metric": "Session Length",
                                        "target": "5+ min average (learning takes time, not casual)",
                                        "measureHow": "Add timer tracking in hunt.html, log to Supabase"
                                },
                                "cortex": {
                                        "metric": "CORTEX Usefulness",
                                        "target": "10+ users say 'CORTEX helped me learn'",
                                        "measureHow": "In-game survey after completing 3 CTF missions"
                                },
                                "completion": {
                                        "metric": "CTF Completion Rate",
                                        "target": "20% complete 1 full mission",
                                        "measureHow": "Track via Supabase player_missions table"
                                },
                                "jobPlacement": {
                                        "metric": "Job Placement",
                                        "target": "1+ user lands cybersecurity job",
                                        "measureHow": "Follow-up survey at 90 days, LinkedIn tracking"
                                }
                        }
                },
                "brutalVerdict": "60% complete prototype (165 files, 815 planets, 22/144 sectors done). Main game is unmaintainable 291KB HTML monolith with 0 tests. Core product CORTEX AI is 0% built. Deployed at https://bountywarz.vercel.app but has 0 users, 0 stars, 0 revenue. Competing against TryHackMe (1.5M users, $3.8M) and HackTheBox (1.8M, $10.6M). Current value: $0. Risk-adjusted EV: $1,250 (5% x $25k). Recommendation: Complete CORTEX MVP + launch organically. If 30% D1 + users report CORTEX helps -> pursue $50k-$100k angel. If <20% D1 -> kill MMORPG wrapper, pivot to pure CTF."
        }
      };
    }
    // Recalculate total
    const newTotal = projects.reduce((sum: number, p: any) => sum + (p.riskAdjustedValue || 0), 0);
    analysis.totalValue = newTotal;
    analysis.projects = projects;

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze', details: error.message }, { status: 500 })
  }
}
