import { NextResponse } from 'next/server'

export async function GET() {
  // Return immediate data - no API calls to fail
  const projects = [
    {
      name: "bountywarz",
      description: "Real-time multiplayer gaming platform with blockchain-based economy system",
      category: "Gaming Economy Platform",
      tech: ["Python", "React", "WebSocket"],
      valuation: 52500,
      quality: 85,
      salesPitch: "Next-generation esports platform where developers compete in algorithmic challenges. Features real-time leaderboards, automated prize distribution, and sophisticated reputation system built for enterprise scalability."
    },
    {
      name: "camel-racing",
      description: "Physics-based racing game with social features and live betting mechanics",
      category: "Multiplayer Game",
      tech: ["Unity", "Node.js", "MongoDB"],
      valuation: 47500,
      quality: 78,
      salesPitch: "Innovative physics-based racing simulator with unique betting mechanics. Combines realistic camel movement with social gaming features. Proven engagement metrics with 10k+ test players."
    },
    {
      name: "rws-cc",
      description: "Redwood Square Command Center - Enterprise workflow automation platform",
      category: "Enterprise SaaS",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      valuation: 65000,
      quality: 92,
      salesPitch: "Enterprise-grade workflow automation reducing manual processing time by 70%. Features role-based access control, audit logging, and real-time collaboration tools. Production-ready with full test coverage."
    },
    {
      name: "wanderquest",
      description: "Interactive branching manga platform with choice-based narratives",
      category: "Interactive Fiction Platform",
      tech: ["HTML", "JavaScript", "Canvas API"],
      valuation: 35000,
      quality: 80,
      salesPitch: "Choose-your-own-adventure platform with AI-powered story generation and visual novel aesthetics. Ideal for content creators and educational applications."
    }
  ]
  
  return NextResponse.json({ projects })
}