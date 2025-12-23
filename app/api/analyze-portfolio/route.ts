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
        content: `You are a software acquisition analyst. Analyze these GitHub repositories with detailed valuation:

${JSON.stringify(repoList, null, 2)}

For EACH repository provide:

1. VALUATION: Estimate hours invested, base value (hours × $50-150/hr), market multiplier (0.5x-5x), show math.

2. COMMERCIAL: Current state, revenue streams (SaaS/licensing/API), target customers, pricing model.

3. GAPS: Missing features, technical improvements, market positioning, competitive moats to build.

4. ROADMAP: 3 steps to 10x value, go-to-market strategy.

Return JSON:
{
  "totalValue": <sum>,
  "portfolioSummary": "<overall assessment>",
  "projects": [
    {
      "name": "repo-name",
      "value": <number>,
      "valueRange": "$X - $Y",
      "category": "SaaS|Tool|Library|Game",
      "valuation": {
        "hoursEstimate": <number>,
        "hourlyRate": <50-150>,
        "baseValue": <number>,
        "marketMultiplier": <0.5-5>,
        "calculation": "Base ($X) × Market (Ym) = $Z"
      },
      "commercial": {
        "currentState": "<what works vs incomplete>",
        "revenueStreams": ["stream1", "stream2"],
        "targetCustomers": "<specific segments>",
        "pricingModel": "<how much to charge>"
      },
      "gaps": {
        "missingFeatures": ["feature1", "feature2"],
        "technicalDebt": "<improvements>",
        "marketPosition": "<strategy>",
        "competitiveMoat": "<advantages>"
      },
      "roadmap": {
        "step1": "<action>",
        "step2": "<action>",
        "step3": "<action>",
        "goToMarket": "<strategy>"
      },
      "strengths": ["str1", "str2"],
      "weaknesses": ["weak1", "weak2"]
    }
  ]
}

Be realistic. No fluff.`
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
