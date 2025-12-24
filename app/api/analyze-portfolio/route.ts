import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET() {
  try {
    const githubRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100&sort=updated')
    const repos = await githubRes.json()

    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: 'GitHub API error', details: repos.message }, { status: 500 })
    }

    const repoList = repos
      .filter((r: any) => r.name !== 'proxy-dealmaker')
      .slice(0, 10)
      .map((r: any) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        size: r.size,
        topics: r.topics,
        updated_at: r.updated_at
      }))

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `You are a startup advisor with access to 2024 industry benchmark data. Give specific, data-backed metrics.

${JSON.stringify(repoList, null, 2)}

REAL INDUSTRY BENCHMARKS (2024):
IDLE GAMES: DAU/MAU 18%, Avg Sessions 5.3/day, Session 6-8min, D1 Retention 35-50%, D7 20%+, D30 10%+, CPI $4.83, ARPDAU 9x higher than hyper-casual
SHOOTER GAMES: $72B market, high CPI, competitive
SAAS B2B: 3-7x ARR multiple, CAC payback <12mo, churn <5%/mo

Return JSON:
{
  "totalValue": 0,
  "portfolioSummary": "Which project to focus on and why",
  "topPick": "best project name",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 0,
    "optimisticValue": 10000,
    "stage": "Concept/Pre-MVP/MVP/Traction",

    "the90DayTest": {
      "buildThis": "5-min vertical slice of core mechanic (NOT full product)",
      "example": "Single level/workflow testing core loop",
      "testWith": "100 users from Reddit, Discord, ProductHunt",
      "costPerInstall": "$0 organic vs $X industry average",

      "specificMetrics": {
        "session1": {
          "metric": "Session length",
          "target": ">X minutes (industry: Ymin)",
          "measureHow": "Analytics or timer tracking"
        },
        "day1": {
          "metric": "Day 1 Retention",
          "target": "X%+ (industry: Y% for this sector)",
          "measureHow": "Track return users",
          "critical": "KEY METRIC - if <X% kill it"
        },
        "engagement": {
          "metric": "Daily sessions or usage",
          "target": "X+ per week (industry: Y)",
          "measureHow": "Track per user"
        },
        "stickiness": {
          "metric": "DAU/MAU or equivalent",
          "target": ">X% (industry: Y%)",
          "measureHow": "Active today / active this month"
        }
      },

      "successDecision": {
        "strong": "Metric >X% -> proceed to full MVP",
        "moderate": "Metric Y-X% -> test more, iterate",
        "weak": "Metric <Y% -> pivot or kill"
      },

      "timeline": {
        "week1_2": "Build minimal prototype",
        "week3_4": "Get 100 testers organically",
        "week5_6": "Measure retention + engagement",
        "week7_8": "Analyze, decide: proceed/pivot/kill"
      }
    },

    "marketContext": {
      "sector": "Gaming/SaaS/Tool",
      "marketSize": "$XB market",
      "advantage": "What gives this project an edge",
      "challenge": "Main obstacle to success",
      "competition": "Who dominates and why"
    },

    "organicTestingChannels": [
      {
        "platform": "Reddit subreddits",
        "expectedReach": "X views, Y testers",
        "cost": "$0"
      },
      {
        "platform": "Discord servers",
        "expectedReach": "Direct access to users",
        "cost": "$0"
      },
      {
        "platform": "Platform-specific (itch.io, ProductHunt)",
        "expectedReach": "X views if featured",
        "cost": "$0"
      }
    ],

    "pivotTriggers": {
      "ifFeatureAWorks": "Scenario -> specific pivot",
      "ifFeatureBFails": "Scenario -> alternative direction",
      "ifRetentionLow": "Core loop broken -> salvage strategy"
    },

    "nextMilestones": {
      "after90Days": {
        "ifValidated": "Next steps with specific targets",
        "funding": "What metrics attract investment",
        "valuation": "How value increases with proven metrics"
      }
    },

    "brutalVerdict": "Worth $X now. Test with 100 users. If [key metric] >Y%, you have something. If <Z%, kill it. [Market context]. [Specific advantage or disadvantage]."
  }]
}

CRITICAL:
1. Use REAL benchmark numbers from 2024 data for the sector
2. Give specific platforms to find testers
3. Identify THE key metric for this project type
4. Explain what each metric means and how to measure
5. Give clear decision criteria (>X% proceed, <Y% kill)`
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
