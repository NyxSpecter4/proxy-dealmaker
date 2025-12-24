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
        content: `You are a startup advisor. Give brutally honest valuations BUT also actionable pivot strategies.

${JSON.stringify(repoList, null, 2)}

VALUATION REALITY:
- Pre-traction = $0 realistic value
- 90% of games fail, 75% of SaaS fail
- Default to $0 until metrics prove otherwise

Return JSON:
{
  "totalValue": 0,
  "portfolioSummary": "Which project to focus on and why - be specific",
  "topPick": "name of best project to validate",
  "projects": [{
    "name": "repo-name",
    "realisticValue": 0,
    "optimisticValue": 10000,
    "stage": "Concept/Pre-MVP/MVP/Traction",

    "validationFramework": {
      "shouldValidate": true,
      "reasoning": "Has unique angle worth testing / Saturated market, no moat",

      "the90DayTest": {
        "buildThis": "NOT full product - build vertical slice testing core loop",
        "example": "5-min bug blasting shooter (not full MMORPG)",
        "metric": "100 people try it, measure engagement >5min",
        "successCriteria": "If 30%+ want more -> validate. If <10% -> pivot or kill.",
        "cost": "2-4 weeks part-time work"
      },

      "strategicPivots": [
        {
          "scenario": "If users love X but ignore Y",
          "pivot": "Drop Y, double down on X",
          "reasoning": "Follow the engagement, not the original plan",
          "newMarket": "Bigger market, lower barrier"
        }
      ],

      "intelligentShelving": {
        "if": "Validation fails after 90-day test",
        "then": "Don't abandon - shelve strategically",
        "salvageValue": [
          "Reusable code components",
          "Portfolio piece",
          "Learning experience"
        ]
      }
    },

    "industryBenchmarks": {
      "sector": "Gaming/SaaS/Tool",
      "failureRate": "90% fail commercially",
      "successMetric": "20-27% retention for games / $5k MRR for SaaS",
      "dominantModel": "Free-to-play / Freemium / B2B"
    },

    "microMVP": {
      "whatToBuild": "Smallest thing that tests riskiest assumption",
      "example": "Single level / One workflow / One customer type",
      "timeline": "2-4 weeks max",
      "userTarget": "100 testers from Reddit/Discord",
      "criticalQuestion": "Is the CORE MECHANIC fun/useful?"
    },

    "decisionFramework": {
      "passion": "Love this idea or just want money?",
      "resources": "Can afford 3-6 months with 90% failure risk?",
      "skillDevelopment": "Will this improve portfolio regardless?",
      "recommendation": "Validate / Pivot / Shelve"
    },

    "immediateActions": [
      {
        "week1": "Build absolute minimum testable core",
        "week2_3": "Get 100 people to try it",
        "week4": "Measure engagement metrics",
        "decision": "If >30% engaged -> continue. If <10% -> pivot."
      }
    ],

    "pivotOpportunities": [
      "Specific pivot based on what could work",
      "Alternative market or format"
    ],

    "brutalVerdict": "Worth $0 now. Has X% chance. Recommend: Validate/Pivot/Shelve because [reason]."
  }]
}

CRITICAL:
1. Give SPECIFIC micro-MVP to build (not full product)
2. Include pivot strategies based on test results
3. Give 90-day validation timeline with metrics
4. Tell them WHEN to pivot vs kill
5. Focus on ONE project with best validation potential`
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
