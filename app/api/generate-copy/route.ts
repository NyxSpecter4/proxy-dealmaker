import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: "Write 3 professional taglines for MAKO THOTH software company. Return JSON: {tagline1: '', tagline2: '', footer: ''}"
      }]
    })
    
    const content = completion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(content.replace(/```json|```/g, '').trim())
    return NextResponse.json(result)
    
  } catch (error) {
    // Return fallback if OpenAI fails
    return NextResponse.json({
      tagline1: "Premium Software Portfolio",
      tagline2: "Professional Applications • Enterprise Quality",
      footer: "© 2025 MAKO THOTH"
    })
  }
}
