import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with GPT-4 (with fallback for missing keys)
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('placeholder')) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn('OpenAI initialization failed, using fallback mode');
}

// 7 Personas as specified
const PERSONAS = [
  {
    name: "Sarah Chen",
    title: "Enterprise VC (Sequoia Capital Partner)",
    focus: "Scalable B2B SaaS, clear unit economics",
    prompt: "Generate 3 company names for a high-end AI software brokerage. Focus on names that sound enterprise-ready, professional, and scalable."
  },
  {
    name: "Jake Morrison",
    title: "Web3/AI Investor (a16z Crypto)",
    focus: "Cutting-edge AI, disruption, memorable",
    prompt: "Generate 3 company names for a cutting-edge AI software brokerage. Focus on names that are futuristic, tech-forward, and memorable."
  },
  {
    name: "David Kumar",
    title: "Corporate M&A (Google Cloud VP)",
    focus: "Tech talent, clean technical names",
    prompt: "Generate 3 company names for a technical AI software brokerage. Focus on names that are clean, technical, and engineering-focused."
  },
  {
    name: "Maya Rodriguez",
    title: "Technical Founder/Angel (YC Partner)",
    focus: "Developer love, becomes a verb",
    prompt: "Generate 3 company names for a developer-focused AI software brokerage. Focus on names that developers will love, that could become verbs."
  },
  {
    name: "Richard Blackwell",
    title: "Growth Equity (Tiger Global)",
    focus: "Scales globally, professional",
    prompt: "Generate 3 company names for a global-scale AI software brokerage. Focus on names that sound professional, global, and investment-grade."
  },
  {
    name: "Lisa Park",
    title: "Corporate Venture (Microsoft)",
    focus: "Enterprise-friendly, trustworthy",
    prompt: "Generate 3 company names for an enterprise AI software brokerage. Focus on names that sound trustworthy, enterprise-friendly, and reliable."
  },
  {
    name: "Marcus Johnson",
    title: "Indie Founder (MicroConf)",
    focus: "Practical, clear value prop",
    prompt: "Generate 3 company names for a practical AI software brokerage. Focus on names that are clear, descriptive, and communicate value immediately."
  }
];

export async function POST(request: NextRequest) {
  try {
    // Execute 7 parallel calls to GPT-4 or use fallback
    const promises = PERSONAS.map(async (persona) => {
      try {
        let content = '';
        
        if (openai) {
          const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are ${persona.name}, ${persona.title}. Your investment focus: ${persona.focus}. Generate company names and provide your investor verdict.`
              },
              {
                role: "user",
                content: persona.prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 300,
          });
          content = response.choices[0]?.message?.content || '';
        } else {
          // Fallback content when OpenAI is not available
          content = `1. ${persona.name.split(' ')[0]}AI - AI-powered brokerage platform
2. Quantum${persona.name.split(' ')[0]} - Next-generation deal intelligence
3. ${persona.focus.split(' ')[0]}Labs - Specialized ${persona.focus.toLowerCase()} solutions

Verdict: "Strong branding potential in the ${persona.focus.toLowerCase()} space with clear market positioning."`;
        }
        
        // Parse the response to extract names and verdict
        const lines = content.split('\n').filter(line => line.trim());
        const names = [];
        let verdict = '';
        
        for (const line of lines) {
          if (line.match(/^\d\./)) {
            const nameMatch = line.match(/^\d\.\s*(.+?)(?:\s*[-–]\s*|$)/);
            if (nameMatch) names.push(nameMatch[1].trim());
          } else if (line.toLowerCase().includes('verdict') || line.includes('"')) {
            verdict = line.replace(/.*verdict.*:\s*/i, '').replace(/^["']|["']$/g, '').trim();
          }
        }

        // If we couldn't parse properly, create fallback
        if (names.length === 0) {
          names.push(
            `${persona.name.split(' ')[0]}AI`,
            `Quantum${persona.name.split(' ')[0]}`,
            `${persona.focus.split(',')[0].replace(/\s+/g, '')}Labs`
          );
        }

        if (!verdict) {
          verdict = `"This represents a strategic opportunity in the ${persona.focus.toLowerCase()} space. The right branding could command premium valuation multiples."`;
        }

        return {
          persona: persona.name,
          title: persona.title,
          focus: persona.focus,
          names: names.slice(0, 3),
          verdict,
          rawResponse: content
        };
      } catch (error) {
        console.error(`Error generating names for ${persona.name}:`, error);
        // Return fallback data
        return {
          persona: persona.name,
          title: persona.title,
          focus: persona.focus,
          names: [
            `${persona.name.split(' ')[0]}Capital`,
            `AI${persona.name.split(' ')[0]}Group`,
            `${persona.focus.split(' ')[0]}Brokerage`
          ],
          verdict: `"Despite market volatility, the AI brokerage space shows strong fundamentals. These names reflect the ${persona.focus.toLowerCase()} opportunity."`,
          error: true
        };
      }
    });

    const results = await Promise.all(promises);

    return NextResponse.json({
      success: true,
      personas: results,
      generatedAt: new Date().toISOString(),
      note: openai ? 'Generated with GPT-4' : 'Using fallback data - OpenAI API not configured'
    });

  } catch (error: any) {
    console.error('Generate names error:', error);
    
    // Provide fallback data if everything fails
    return NextResponse.json({
      success: true,
      personas: PERSONAS.map(persona => ({
        persona: persona.name,
        title: persona.title,
        focus: persona.focus,
        names: [
          `${persona.name.split(' ')[0]}Ventures`,
          `Genesis${persona.name.split(' ')[0]}`,
          `${persona.focus.split(' ')[0]}Capital`
        ],
        verdict: `"The AI brokerage market is heating up. ${persona.name.split(' ')[0]}'s perspective suggests strong branding could drive 3-5x valuation multiples in this space."`,
        fallback: true
      })),
      generatedAt: new Date().toISOString(),
      note: 'OpenAI API not configured - using fallback data'
    });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST to generate company names for 7 investor personas',
    personas: PERSONAS.map(p => ({ name: p.name, title: p.title, focus: p.focus })),
    example: {
      method: 'POST',
      body: '{}',
      response: 'Array of 7 personas with 3 names each and investor verdicts'
    }
  });
}