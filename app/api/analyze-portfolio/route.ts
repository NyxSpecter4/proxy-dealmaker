import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`)
        const repo = await repoRes.json()
        const langsRes = await fetch(repo.languages_url)
        const langs = await langsRes.json()
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are an elite software valuation expert. Generate realistic commercial valuations."
          }, {
            role: "user",
            content: `Analyze: ${name}\nDescription: ${repo.description}\nStars: ${repo.stargazers_count}\nLanguages: ${Object.keys(langs).join(', ')}\n\nRespond with JSON only:\n{"valuation":50000,"quality":85,"category":"Category","salesPitch":"2-3 sentence pitch"}\n\nValuation: $30k-$80k range.`
          }],
          temperature: 0.7
        })
        
        const ai = JSON.parse(completion.choices[0].message.content?.replace(/```json\n?|\n?```/g, '') || '{}')
        
        return {
          name: repo.name,
          description: repo.description,
          tech: Object.keys(langs).slice(0, 3),
          valuation: ai.valuation || 40000,
          quality: ai.quality || 75,
          category: ai.category || 'Software',
          salesPitch: ai.salesPitch || 'Premium software asset.'
        }
      })
    )
    
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}