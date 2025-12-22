import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// GET - Load saved logo
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('logos')
      .select('base64, created_at')
      .eq('id', 'main-logo')
      .single()

    if (error || !data) {
      return NextResponse.json({ base64: null })
    }

    return NextResponse.json({ base64: data.base64, created_at: data.created_at })
  } catch (error) {
    return NextResponse.json({ base64: null })
  }
}

// POST - Generate and save new logo
export async function POST() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Epic fusion logo: Mako Shark merged with Egyptian God Thoth. Shark's dorsal fin becomes Thoth's ibis beak. Electric blue and gold. Minimalist, powerful, premium logo design.",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) throw new Error('No image generated')

    const imgRes = await fetch(imageUrl)
    const buffer = Buffer.from(await imgRes.arrayBuffer())
    const base64 = buffer.toString('base64')

    // Save to Supabase
    const { error: upsertError } = await supabase
      .from('logos')
      .upsert({
        id: 'main-logo',
        base64: base64,
        prompt: 'MAKO THOTH fusion logo',
        created_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Supabase save error:', upsertError)
      // Still return the logo even if save fails
    }

    return NextResponse.json({ base64, saved: !upsertError })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
