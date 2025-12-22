import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
    if (!imageUrl) throw new Error('No image')

    const imgRes = await fetch(imageUrl)
    const buffer = Buffer.from(await imgRes.arrayBuffer())
    const base64 = buffer.toString('base64')

    return NextResponse.json({ base64 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
