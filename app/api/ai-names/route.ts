import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const PERSONAS = [
  {
    name: "Sarah Chen",
    title: "Enterprise VC (Sequoia Capital Partner)",
    focus: "Scalable B2B SaaS, clear unit economics"
  },
  {
    name: "Jake Morrison", 
    title: "Web3/AI Investor (a16z Crypto)",
    focus: "Cutting-edge AI, disruption, memorable"
  },
  {
    name: "David Kumar",
    title: "Corporate M&A (Google Cloud VP)", 
    focus: "Tech talent, clean technical names"
  },
  {
    name: "Maya Rodriguez",
    title: "Technical Founder/Angel (YC Partner)",
    focus: "Developer love, becomes a verb"
  },
  {
    name: "Richard Blackwell",
    title: "Growth Equity (Tiger Global)",
    focus: "Scales globally, professional"
  },
  {
    name: "Lisa Park",
    title: "Corporate Venture (Microsoft)",
    focus: "Enterprise-friendly, trustworthy"
  },
  {
    name: "Marcus Johnson",
    title: "Indie Founder (MicroConf)",
    focus: "Practical, clear value prop"
  }
];

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        names: getFallbackNames(),
        source: "fallback",
        reason: "OPENAI_API_KEY not found in Vercel",
        personas_used: PERSONAS.length
      });
    }

    const openai = new OpenAI({ apiKey });
    
    // Ask each persona for 2-3 names
    const allNames = new Set<string>();
    
    for (const persona of PERSONAS) {
      const prompt = `You are ${persona.name}, ${persona.title}. 
      Your focus: ${persona.focus}
      
      Suggest 2-3 available .dev domain names for an AI-powered software marketplace.
      Names should be: short, memorable, tech-focused, and available as .dev domains.
      Return ONLY a JSON array: ["Name1", "Name2", "Name3"]`;
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.9,
          max_tokens: 150,
        });
        
        const content = response.choices[0]?.message?.content;
        if (content) {
          const result = JSON.parse(content);
          const names = Array.isArray(result) ? result : result.names || [];
          names.forEach((name: string) => allNames.add(name.trim()));
        }
      } catch (error) {
        console.log(`${persona.name} failed, using fallback`);
        getFallbackNames().forEach(name => allNames.add(name));
      }
    }
    
    const names = Array.from(allNames).slice(0, 15);
    
    return NextResponse.json({
      success: true,
      names,
      count: names.length,
      source: "OpenAI GPT-3.5",
      personas: PERSONAS.length,
      environment: "Vercel",
      key_present: true
    });
    
  } catch (error: any) {
    return NextResponse.json({
      names: getFallbackNames(),
      source: "fallback",
      error: error.message,
      personas: PERSONAS.length
    });
  }
}

function getFallbackNames() {
  return [
    "CodeShark", "GitHunter", "RepoValue", "DevVault", "BytePrice",
    "SourceValue", "KalaLabs", "ValurDev", "ApexCode", "NexusValue",
    "SynthMarket", "CortexSale", "VexorDev", "VeloxGit", "CodeFlux"
  ];
}