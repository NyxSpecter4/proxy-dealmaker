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
        content: `You are a ruthless startup acquisitions analyst. Your job is to give REALISTIC valuations, not inflated fantasy numbers.

${JSON.stringify(repoList, null, 2)}

CORE RULES:
1. NO REVENUE = $0-$500 MAX (just code asset value)
2. No active users = $0-$500 MAX
3. Side projects are worth $100-$1000 typically
4. Be BRUTALLY HONEST - most GitHub repos are worth almost nothing

VALUATION FRAMEWORK:
- Dead/inactive repo: $0-$100
- Working code, no users, no revenue: $200-$1000
- Has some users but no revenue: $1000-$5000
- Has revenue: Calculate ARR x 3-7x based on growth
- Strategic/viral project: $10k+

For each repo, you MUST analyze:
1. Is this actually deployed and working? (check README, commits)
2. Any evidence of users? (stars mean nothing, look for issues, PRs, activity)
3. Code quality indicators (tests, docs, recent commits)
4. Real market demand (is anyone actually searching for this?)

Return JSON:
{
  "totalValue": 2500,
  "portfolioSummary": "brutally honest 1-2 sentence overview",
  "projects": [{
    "name": "repo-name",
    "value": 500,
    "description": "what it actually does",
    "marketReality": "WHO would pay and WHY - be skeptical",
    "actualStatus": "deployed/prototype/broken/abandoned",
    "userEvidence": "none visible / some GitHub activity / actual users",
    "revenueEvidence": "none / unknown / $X MRR",
    "strengths": ["max 2-3 real strengths"],
    "weaknesses": ["be honest - what sucks"],
    "competition": "who does this better",
    "pivotIdea": "only if project is salvageable",
    "nextSteps": ["3 realistic actions"],
    "honestAssessment": "One brutal sentence about real value"
  }]
}

DEFAULT ASSUMPTION: Worth $0-$500 unless proven otherwise.
Most repos on GitHub are worthless. Prove the value.`
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
