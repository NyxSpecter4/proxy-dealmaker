import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const REPOS = [
  { owner: "NyxSpecter4", name: "bountywarz" },
  { owner: "NyxSpecter4", name: "camel-racing" },
  { owner: "NyxSpecter4", name: "rws-cc" },
  { owner: "NyxSpecter4", name: "wanderquest" }
]

export async function GET() {
  try {
    const projects = await Promise.all(
      REPOS.map(async ({ owner, name }) => {
        // Fetch real GitHub data
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        
        if (!repoRes.ok) {
          throw new Error(`GitHub API error for ${name}`)
        }
        
        const repoData = await repoRes.json()
        
        const langsRes = await fetch(repoData.languages_url)
        const languages = await langsRes.json()
        
        // AI generates valuation and pitch
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are an elite software valuation expert for MAKO THOTH. Analyze repositories and provide professional enterprise-grade assessments."
          }, {
            role: "user",
            content: `Analyze this GitHub repository:

Repository: ${name}
Description: ${repoData.description || 'No description'}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Languages: ${Object.keys(languages).join(', ')}
Size: ${repoData.size} KB
Last Updated: ${repoData.updated_at}

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "valuation": 45000,
  "quality": 85,
  "category": "Brief category like 'Gaming Platform' or 'Enterprise SaaS'",
  "salesPitch": "2-3 sentence compelling sales pitch targeting enterprise buyers and investors"
}

Valuation range: $30,000-$80,000 (realistic commercial software pricing).
Quality: 1-100 based on code quality indicators.
Make the pitch professional and compelling.`
          }],
          temperature: 0.7
        })
        
        const content = completion.choices[0]?.message?.content || '{}'
        const ai = JSON.parse(content.replace(/```json\n?|\n?```/g, ''))
        
        return {
          name: repoData.name,
          description: repoData.description || 'No description available',
          tech: Object.keys(languages).slice(0, 3),
          stars: repoData.stargazers_count,
          valuation: ai.valuation || 40000,
          quality: ai.quality || 75,
          category: ai.category || 'Software',
          salesPitch: ai.salesPitch || 'Premium software asset ready for acquisition.'
        }
      })
    )
    
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Portfolio analysis failed:', error)
    return NextResponse.json({ 
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}