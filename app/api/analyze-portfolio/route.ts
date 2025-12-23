import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET() {
  try {
    // Get repos from GitHub
    const githubRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100&sort=updated')
    const repos = await githubRes.json()
    
    const repoList = repos.slice(0, 10).map((r: any) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      size: r.size,
      topics: r.topics
    }))

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Analyze this GitHub portfolio and provide REAL market valuations. No fake multipliers.

REPOS: ${JSON.stringify(repoList, null, 2)}

Provide JSON response:
{
  "totalValue": <realistic dollar amount based on tech stack, market demand, acquisition potential>,
  "techStackRating": "<rating like 'Enterprise-Grade' or 'Emerging Tech'>",
  "marketPosition": "<position like 'Niche Leader' or 'Growing'>",
  "acquisitionPotential": "<High/Medium/Low with reason>",
  "revenuePotential": "<realistic assessment>",
  "portfolioAnalysis": "<2-3 sentence analysis of real value drivers>"
}

Base valuation on:
- Tech stack market demand
- Repository activity and quality
- Potential customer base
- Real acquisition value
NO hourly rate math. NO multipliers. REAL market analysis only.`
      }],
      response_format: { type: 'json_object' }
    })

    const analysis = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(analysis)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
