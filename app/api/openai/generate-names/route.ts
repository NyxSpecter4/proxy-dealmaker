import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    // DEBUG: Log environment status
    console.log('Environment check:');
    console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.log('- Key length:', process.env.OPENAI_API_KEY?.length || 0);
    console.log('- Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 7) || 'none');
    
    // CRITICAL: The key name must match exactly what's in Vercel
    // Vercel uses OPENAI_API_KEY (you confirmed this)
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('FATAL: OPENAI_API_KEY is empty or undefined');
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          message: 'Add OPENAI_API_KEY to Vercel environment variables',
          names: ['CodeShark', 'GitHunter', 'RepoValue', 'DevVault', 'BytePrice', 'SourceValue']
        },
        { status: 200 } // Return 200 with fallback names
      );
    }
    
    // Test if key looks valid
    if (!apiKey.startsWith('sk-')) {
      console.error('WARNING: API key does not start with sk-');
    }

    const { criteria, business } = await request.json();
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `Generate 12 available .dev domain names for a ${business}.
Style: ${criteria.style}
Length: ${criteria.length}
Return ONLY a JSON array: ["Name1", "Name2", ...]`;

    console.log('Calling OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use cheaper model for testing
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 300,
    });

    console.log('OpenAI API call successful');
    
    const content = response.choices[0]?.message?.content;
    const result = JSON.parse(content || '{"names": []}');
    const names = result.names || result;
    
    if (!Array.isArray(names)) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      success: true,
      names: names.slice(0, 12),
      source: 'OpenAI GPT-3.5',
      environment: 'Vercel',
      key_status: 'present'
    });

  } catch (error: any) {
    console.error('OpenAI API Error details:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack
    });
    
    // Always return successful response with fallback names
    return NextResponse.json({
      error: error.message,
      names: [
        'CodeShark', 'GitHunter', 'RepoValue', 'DevVault',
        'BytePrice', 'SourceValue', 'KalaLabs', 'ValurDev',
        'ApexCode', 'NexusValue', 'SynthMarket', 'CortexSale'
      ],
      fallback: true,
      environment_check: {
        has_key: !!process.env.OPENAI_API_KEY,
        key_length: process.env.OPENAI_API_KEY?.length || 0
      }
    });
  }
}