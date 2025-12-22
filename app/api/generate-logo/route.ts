import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { supabase } from '@/lib/supabase-client';

const streamPipeline = promisify(pipeline);

export async function GET(request: Request) {
  try {
    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'sk-placeholder-openai-api-key') {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          message: 'Add OPENAI_API_KEY to Vercel environment variables',
          instructions: 'Run the script manually: node scripts/generate-logo.mjs'
        },
        { status: 200 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `Side profile fusion of a Mako Shark and Egyptian God Thoth (ibis-headed). Shark's dorsal fin transitions into Thoth's curved beak. Electric blue (#6366f1) and ancient gold (#f59e0b). Minimalist line art, logo style, transparent background.`;

    console.log('🚀 Generating MAKO THOTH logo with DALL-E 3...');
    console.log('📝 Prompt:', prompt);
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }
    
    console.log('✅ Image generated:', imageUrl);

    // Download the image using fetch
    console.log('⬇️  Downloading image...');
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    // Convert image to base64
    console.log('🔄 Converting to base64...');
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = 'image/png';

    // Ensure public directory exists
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }

    // Save the image to file system
    const outputPath = 'public/mako-thoth-logo.png';
    const writeStream = createWriteStream(outputPath);
    
    // Convert ReadableStream to Node.js stream if needed
    if (imageResponse.body) {
      // Reset the response body by creating a new response
      const newResponse = new Response(arrayBuffer);
      // @ts-ignore - body may be ReadableStream
      await streamPipeline(newResponse.body, writeStream);
    } else {
      throw new Error('No response body from image URL');
    }
    
    console.log(`✅ Logo saved to: ${outputPath}`);

    // Save to database
    console.log('💾 Saving logo to database...');
    try {
      const { data, error } = await supabase
        .from('logos')
        .insert({
          name: 'MAKO THOTH Logo',
          description: 'Generated logo for MAKO THOTH brand',
          prompt: prompt,
          image_url: imageUrl,
          image_base64: base64Image,
          mime_type: mimeType,
          model: 'dall-e-3',
          size: '1024x1024'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error.message);
        // Continue anyway - don't fail the whole request
      } else {
        console.log('✅ Logo saved to database with ID:', data.id);
      }
    } catch (dbError: any) {
      console.error('❌ Database save failed:', dbError.message);
      // Continue - the file was saved locally
    }

    return NextResponse.json({
      success: true,
      message: 'Logo generated successfully',
      imageUrl: imageUrl,
      savedPath: outputPath,
      prompt: prompt,
      base64: base64Image ? 'data:image/png;base64,' + base64Image.substring(0, 100) + '...' : null,
      savedToDatabase: true
    });

  } catch (error: any) {
    console.error('❌ Error generating logo:', error.message);
    
    return NextResponse.json({
      error: error.message,
      message: 'Failed to generate logo',
      fallback: true,
      instructions: 'Use the script at scripts/generate-logo.mjs instead'
    }, { status: 500 });
  }
}