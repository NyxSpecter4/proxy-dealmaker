import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type GitHubRepo = {
  name: string
  description: string | null
  stargazers_count: number
  languages_url: string
  size: number
}

export async function GET() {
  try {
    // Get ALL repos from NyxSpecter4
    const reposRes = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100', {
      headers: { 'User-Agent': 'MAKO-THOTH' }
    })
    
    if (!reposRes.ok) throw new Error('GitHub API failed')
    
    const allRepos: GitHubRepo[] = await reposRes.json()
    
    // Filter out proxy-dealmaker and get top 4 by stars/activity
    const repos = allRepos
      .filter((r: GitHubRepo) => r.name !== 'proxy-dealmaker')
      .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
    
    // Analyze each repo with AI
    const projects = await Promise.all(
      repos.map(async (repo) => {
        // Get languages
        const langsRes = await fetch(repo.languages_url, {
          headers: { 'User-Agent': 'MAKO-THOTH' }
        })
        const langs = await langsRes.json()
        
        // Call OpenAI for valuation
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "user",
            content: `Analyze GitHub repo: ${repo.name}
Description: ${repo.description || 'No description'}
Stars: ${repo.stargazers_count}
Languages: ${Object.keys(langs).join(', ')}
Size: ${repo.size}kb

Return JSON only: {"val":45000,"hrs":360,"desc":"Category","pitch":"One sentence pitch"}
Valuation range: $30k-$80k based on code quality/complexity.`
          }],
          temperature: 0.8,
          max_tokens: 200
        })
        
        const content = completion.choices[0]?.message?.content || '{"val":45000,"hrs":360,"desc":"Software","pitch":"Premium software asset"}'
        const ai = JSON.parse(content.replace(/```json|```/g, '').trim())
        
        return {
          name: repo.name,
          val: ai.val,
          hrs: ai.hrs,
          desc: ai.desc,
          pitch: ai.pitch
        }
      })
    )
    
    return NextResponse.json({ projects })
    
  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}