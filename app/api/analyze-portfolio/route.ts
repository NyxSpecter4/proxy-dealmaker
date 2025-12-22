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
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers: { 'User-Agent': 'MAKO-THOTH' } })
        const repo = await repoRes.json()
        const langsRes = await fetch(repo.languages_url, { headers: { 'User-Agent': 'MAKO-THOTH' } })
        const langs = await langsRes.json()
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: `Analyze ${name}: ${repo.description}. Stars: ${repo.stargazers_count}. Languages: ${Object.keys(langs).join(', ')}. Return JSON only: {"val":45000,"hrs":360,"desc":"Brief category","pitch":"1 sentence pitch"}. Valuation $30k-$80k.` }],
          temperature: 0.7,
          max_tokens: 150
        })
        
        const content = completion.choices[0]?.message?.content || '{"val":45000,"hrs":360,"desc":"Software","pitch":"Premium software asset"}'
        const ai = JSON.parse(content.replace(/```json|```/g, '').trim())
        return { name: repo.name, val: ai.val, hrs: ai.hrs, desc: ai.desc, pitch: ai.pitch }
      })
    )
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('AI failed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}