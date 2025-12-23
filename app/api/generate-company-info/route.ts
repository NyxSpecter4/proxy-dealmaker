import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST() {
  try {
    // Get repos
    const res = await fetch('https://api.github.com/users/NyxSpecter4/repos?per_page=100')
    const repos = await res.json()
    
    const repoData = repos.slice(0, 15).map((r: any) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      topics: r.topics
    }))

    // Generate company info with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Analyze this GitHub portfolio and create epic company branding:

REPOS: ${JSON.stringify(repoData, null, 2)}

Generate JSON:
{
  "slogan": "<powerful 3-7 word slogan that captures the essence>",
  "description": "<2-3 sentence epic description of what this company does and why it's unique>"
}

Make it creative, bold, and memorable. Focus on AI, code, innovation.`
      }],
      response_format: { type: 'json_object' }
    })

    const { slogan, description } = JSON.parse(completion.choices[0].message.content || '{}')

    // Save to Supabase
    const { error } = await supabase
      .from('company_info')
      .upsert({ id: 'main', slogan, description })

    if (error) throw error

    return NextResponse.json({ slogan, description })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET to load saved info
export async function GET() {
  try {
    const { data } = await supabase
      .from('company_info')
      .select('*')
      .eq('id', 'main')
      .single()

    return NextResponse.json(data || {})
  } catch {
    return NextResponse.json({})
  }
}
