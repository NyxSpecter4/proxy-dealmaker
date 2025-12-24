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
        content: `You are a startup analyst using industry-standard valuation methods (Scorecard/Berkus). Be brutally honest.

${JSON.stringify(repoList, null, 2)}

VALUATION REALITY:
- 90% of games fail commercially
- No traction = speculative code asset only ($100-$1000)
- Early-stage projects valued on risk factors, NOT potential
- ARR is the ONLY reliable metric for SaaS

SCORECARD METHOD - Rate each project:
- Quality of idea/team: Low/Medium/High
- Prototype/MVP status: None/Basic/Production
- Market size: Niche/Medium/Large
- Product-market fit: None/Some/Proven
- Traction (users/revenue): None/Early/Growing
- Defensibility: None/Weak/Strong

Return JSON:
{
  "totalValue": 2000,
  "portfolioSummary": "brutally honest overview - which to pursue, which to kill",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 300,
    "optimisticValue": 5000,
    "description": "what it does",

    "stage": "Concept/Pre-MVP/MVP/Production",
    "valuationGaps": [
      "No measurable traction (DAU/MAU/ARR)",
      "No paying customers",
      "Easily replicable - no moat"
    ],

    "industryReality": {
      "sector": "Gaming/SaaS/Tool/Consumer",
      "failureRate": "90% of games fail / 75% of SaaS fail",
      "keyMetric": "DAU for games / ARR for SaaS",
      "currentMetric": "0 - no evidence of users or revenue",
      "competition": "who does this better and why you'll lose"
    },

    "scorecardAssessment": {
      "idea": "Low/Medium/High - brief reason",
      "team": "Low - solo dev",
      "mvp": "Basic/None/Production",
      "marketFit": "None - no user validation",
      "traction": "None - no DAU/MAU/ARR data",
      "moat": "None - easily copied"
    },

    "pathToValue": {
      "isViable": false,
      "criticalMetrics": [
        "Get first 100 active users",
        "Prove 30-day retention >20%",
        "Generate first $1 revenue"
      ],
      "timeToProof": "3-6 months to basic validation",
      "probabilityOfSuccess": "10% (industry average)"
    },

    "nextSteps": [
      "Step 1 with specific metric",
      "Step 2 with validation criteria",
      "Step 3 with success threshold"
    ],

    "brutalTruth": "One sentence on whether to pursue or abandon"
  }]
}

CRITICAL: Default to LOW valuations. Evidence required to justify higher.
Focus on 1-2 projects with best fundamentals.
Tell them which projects to kill immediately.`
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
