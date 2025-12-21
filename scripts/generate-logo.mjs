#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

// Dynamic import for node-fetch v3 (ESM)
const fetch = (await import('node-fetch')).default;

const streamPipeline = promisify(pipeline);

// Check for OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey === 'sk-placeholder-openai-api-key') {
  console.error('❌ OPENAI_API_KEY is not set or is a placeholder.');
  console.error('Please set your OpenAI API key in the environment:');
  console.error('  export OPENAI_API_KEY=your_key_here');
  console.error('Or add it to your .env.local file.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: apiKey,
});

async function generateLogo() {
  console.log('🚀 Generating MAKO THOTH logo with DALL-E 3...');
  
  const prompt = `A luxury, minimalist vector-style logo on a pure black background. A profile fusion of a sleek Mako Shark and the Ibis-headed God Thoth. Electric Blue and Ancient Gold. 8k, cinematic, high-end tech.`;

  try {
    console.log('📝 Prompt:', prompt);
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
    });

    const imageUrl = response.data[0].url;
    console.log('✅ Image generated:', imageUrl);

    // Download the image
    console.log('⬇️  Downloading image...');
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    // Ensure public directory exists
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }

    // Save the image
    const outputPath = 'public/logo.png';
    const writeStream = createWriteStream(outputPath);
    await streamPipeline(imageResponse.body, writeStream);
    
    console.log(`✅ Logo saved to: ${outputPath}`);
    console.log('🎉 Logo generation complete!');
    
  } catch (error) {
    console.error('❌ Error generating logo:', error.message);
    if (error.response) {
      console.error('OpenAI API error:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the generation
generateLogo();