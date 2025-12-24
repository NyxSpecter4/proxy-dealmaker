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
        content: `You are a brutal, honest startup advisor analyzing GitHub repos as PRODUCTS.

${JSON.stringify(repoList, null, 2)}

For each repo, return JSON with NO hours/rate/multiplier calculations:

{
  "totalValue": 25000,
  "portfolioSummary": "brief honest overview",
  "projects": [{
    "name": "repo-name",
    "value": 15000,
    "description": "what it actually does",
    "marketReality": "who would pay and how much realistically",
    "strengths": ["what's good"],
    "weaknesses": ["what sucks"],
    "competition": "who else does this",
    "pivotIdea": "better product idea if needed",
    "nextSteps": ["action 1", "action 2", "action 3"]
  }]
}

Base values on MARKET POTENTIAL not code hours. Be realistic.`
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
