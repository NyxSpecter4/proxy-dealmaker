import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function GET() {
  try {
    // Get user's repos
    const reposRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100', {
      headers: { 'User-Agent': 'MAKO-THOTH' }
    })

    const allRepos = await reposRes.json()

    // Filter and get top 4 (exclude proxy-dealmaker)
    const repos = allRepos
      .filter(r => r.name.toLowerCase() !== 'proxy-dealmaker')
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)

    // Analyze with AI
    const projects = await Promise.all(
      repos.map(async (repo) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "user",
            content: `Analyze: ${repo.name}. Description: ${repo.description || 'None'}. Stars: ${repo.stargazers_count}. Return JSON: {"val":45000,"hrs":360,"desc":"Category","pitch":"One sentence"}`
          }]
        })

        const ai = JSON.parse(completion.choices[0].message.content.replace(/```json|```/g, '').trim())
        return { name: repo.name, val: ai.val, hrs: ai.hrs, desc: ai.desc, pitch: ai.pitch }
      })
    )

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
