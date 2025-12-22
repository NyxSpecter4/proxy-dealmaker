import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface GitHubRepo {
  name: string
  description: string | null
  stargazers_count: number
  language: string | null
}

export async function GET() {
  try {
    const reposRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100', {
      headers: { 'User-Agent': 'MAKO-THOTH' }
    })
    
    const allRepos: GitHubRepo[] = await reposRes.json()
    
    const repos = allRepos
      .filter((r: GitHubRepo) => r.name.toLowerCase() !== 'proxy-dealmaker')
      .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
    
    const projects = await Promise.all(
      repos.map(async (repo: GitHubRepo) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "user",
            content: `Analyze GitHub repo: ${repo.name}
    
Description: ${repo.description || 'No description'}
Stars: ${repo.stargazers_count}
Language: ${repo.language || 'Unknown'}

ANALYZE:
- Market demand and competition
- Technical complexity
- Customer value proposition
- Required hours of work

Return ONLY JSON (no markdown):
{
  "val": <number between 30000-80000>,
  "hrs": <realistic hours estimate>,
  "desc": "<one word category>",
  "pitch": "<one sentence value prop>"
}`
          }]
        })
        
        const content = completion.choices[0].message.content || '{}'
        const ai = JSON.parse(content.replace(/```json|```/g, '').trim())
        return { name: repo.name, val: ai.val, hrs: ai.hrs, desc: ai.desc, pitch: ai.pitch }
      })
    )
    
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
