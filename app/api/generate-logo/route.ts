import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Side profile fusion of a Mako Shark and Egyptian God Thoth (ibis-headed). The shark's dorsal fin seamlessly transitions into Thoth's curved ibis beak. Electric blue (#6366f1) and ancient gold (#f59e0b) color scheme. Minimalist line art style, logo design, clean and professional, transparent background.",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url
    
    if (!imageUrl) {
      throw new Error('No image URL returned')
    }

    const imageResponse = await fetch(imageUrl)
    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')

    return NextResponse.json({ 
      base64,
      url: imageUrl
    })
  } catch (error) {
    console.error('Logo generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate logo',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}