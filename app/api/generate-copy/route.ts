import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function GET() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: "Write 3 professional, compelling taglines for MAKO THOTH - a premium software company selling enterprise-grade applications (BountyWarz gaming platform, Camel Racing game, RWS-CC enterprise SaaS, WanderQuest interactive fiction). Make it sophisticated, powerful, and professional. Return JSON: {tagline1: '', tagline2: '', footer: ''}"
    }],
    temperature: 0.8
  })
  
  const content = completion.choices[0]?.message?.content || '{"tagline1":"Sovereign Intelligence • Divine Code Valuation","tagline2":"PRIVATE ASSET VAULT • OWNER: NYXSPECTER4","footer":"© 2025 MAKO THOTH • ALL INTELLIGENCE RESERVED"}'
  const result = JSON.parse(content.replace(/```json|```/g, '').trim())
  return NextResponse.json(result)
}