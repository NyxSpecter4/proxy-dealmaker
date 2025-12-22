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
        try {
          const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers: { 'User-Agent': 'MAKO-THOTH' } })
          const repo = await repoRes.json()
          
          // Handle GitHub API errors
          if (!repoRes.ok || repo.message) {
            throw new Error(`GitHub API error: ${repo.message || 'Unknown error'}`)
          }
          
          const langsRes = await fetch(repo.languages_url || `https://api.github.com/repos/${owner}/${name}/languages`, { headers: { 'User-Agent': 'MAKO-THOTH' } })
          const langs = await langsRes.json() || {}
          
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: `Analyze ${name}: ${repo.description || 'No description'}. Stars: ${repo.stargazers_count || 0}. Languages: ${Object.keys(langs).join(', ') || 'Unknown'}. Return JSON only: {"val":45000,"hrs":360,"desc":"Brief category","pitch":"1 sentence pitch"}. Valuation $30k-$80k.` }],
            temperature: 0.7,
            max_tokens: 150
          })
          
          const content = completion.choices[0]?.message?.content || '{"val":45000,"hrs":360,"desc":"Software","pitch":"Premium software asset"}'
          const ai = JSON.parse(content.replace(/```json|```/g, '').trim())
          return { name: repo.name || name, val: ai.val || 45000, hrs: ai.hrs || 360, desc: ai.desc || 'Software', pitch: ai.pitch || 'Premium software asset ready for acquisition' }
        } catch (repoError) {
          console.error(`Failed to analyze ${name}:`, repoError)
          // Return fallback data for this repo
          return {
            name,
            val: 45000,
            hrs: 360,
            desc: 'Software Project',
            pitch: 'Premium software asset with enterprise potential'
          }
        }
      })
    )
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Portfolio analysis failed:', error)
    // Return fallback static data if everything fails
    const fallbackProjects = [
      { name: "bountywarz", val: 52500, hrs: 420, desc: "Gaming Economy Platform", pitch: "Next-generation esports platform with blockchain economy" },
      { name: "camel-racing", val: 47500, hrs: 380, desc: "Multiplayer Game", pitch: "Physics-based racing simulator with social features" },
      { name: "rws-cc", val: 65000, hrs: 520, desc: "Enterprise SaaS", pitch: "Workflow automation reducing manual processing by 70%" },
      { name: "wanderquest", val: 35000, hrs: 280, desc: "Interactive Fiction Platform", pitch: "Choose-your-own-adventure platform with AI story generation" }
    ]
    return NextResponse.json({ projects: fallbackProjects })
  }
}