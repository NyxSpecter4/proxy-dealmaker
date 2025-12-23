import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET() {
  try {
    const githubRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100&sort=updated')
    const repos = await githubRes.json()
    
    const repoList = repos.slice(0, 10).map((r: any) => ({
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
        content: `Analyze these GitHub repositories with BRUTAL HONESTY and REALISTIC market assessment:

${JSON.stringify(repoList, null, 2)}

For EACH repository, provide:

1. CUSTOMER BASE: Who would actually use this? Be specific.
2. COMPETITION: What existing solutions compete? Name them.
3. CODE QUALITY: Based on language, stars, activity - honest assessment
4. CREATIVITY/UNIQUENESS: What makes this different? Or is it generic?
5. MARKET VALUATION: Realistic dollar range based on actual potential.

NO BULLSHIT. NO MULTIPLIERS. NO HOURLY RATES.

Be honest about weaknesses. If it's a hobby project, say so.
If market is saturated, say so. If it needs work, say so.

Return JSON:
{
  "totalValue": <realistic total>,
  "projects": [
    {
      "name": "repo-name",
      "value": <realistic dollar amount>,
      "valueRange": "$X - $Y",
      "category": "category",
      "customerBase": "<who would actually pay for this>",
      "competition": "<existing competitors>",
      "codeQuality": "<honest assessment>",
      "creativity": "<what's unique or not>",
      "marketAnalysis": "<2-3 sentences of REAL market analysis>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<weakness 1>", "<weakness 2>"]
    }
  ]
}

Be REALISTIC. Be HONEST. No fluff.`
      }],
      response_format: { type: 'json_object' }
    })

    const analysis = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(analysis)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
