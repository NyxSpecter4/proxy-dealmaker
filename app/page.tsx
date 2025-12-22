'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  name: string;
  category: string;
  githubUrl: string;
  description: string;
  techStack: string[];
  engineeringHours: number;
  qualityScore: number;
  valuation: number;
  salesPitch: string;
  loading: boolean;
  error: string | null;
}

interface PersonaEvaluation {
  id: number;
  persona: string;
  score: number;
  quote: string;
  alternative: string;
}

interface AnalysisResponse {
  success: boolean;
  repository: {
    owner: string;
    name: string;
    url: string;
    description: string | null;
  };
  metrics: {
    commits: number;
    stars: number;
    forks: number;
    languages: string[];
    size: number;
    issues: number;
    complexity: number;
  };
  valuation: {
    raw: number;
    formatted: string;
    breakdown: any;
  };
  aiPitch: string;
}

export default function Home() {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'BountyWarz',
      category: 'Gaming Economy',
      githubUrl: 'https://github.com/NyxSpecter4/bountywarz',
      description: '',
      techStack: [],
      engineeringHours: 0,
      qualityScore: 0,
      valuation: 0,
      salesPitch: '',
      loading: true,
      error: null
    },
    {
      id: 2,
      name: 'Camel Racing',
      category: 'Multiplayer Game',
      githubUrl: 'https://github.com/NyxSpecter4/camel-racing',
      description: '',
      techStack: [],
      engineeringHours: 0,
      qualityScore: 0,
      valuation: 0,
      salesPitch: '',
      loading: true,
      error: null
    },
    {
      id: 3,
      name: 'RWS-CC',
      category: 'Enterprise SaaS',
      githubUrl: 'https://github.com/NyxSpecter4/proxy-dealmaker',
      description: '',
      techStack: [],
      engineeringHours: 0,
      qualityScore: 0,
      valuation: 0,
      salesPitch: '',
      loading: true,
      error: null
    },
    {
      id: 4,
      name: 'WanderQuest',
      category: 'Interactive Fiction',
      githubUrl: 'https://github.com/NyxSpecter4/specter_analyzer',
      description: '',
      techStack: [],
      engineeringHours: 0,
      qualityScore: 0,
      valuation: 0,
      salesPitch: '',
      loading: true,
      error: null
    }
  ]);

  // AI Persona evaluations for "MAKO THOTH"
  const personaEvaluations: PersonaEvaluation[] = [
    {
      id: 1,
      persona: 'VC Investor',
      score: 9,
      quote: 'Memorable, evokes both speed (Mako) and wisdom (Thoth). Perfect for a tech portfolio brand.',
      alternative: 'CodeSovereign'
    },
    {
      id: 2,
      persona: 'Brand Strategist',
      score: 8,
      quote: 'Strong mythological resonance. The shark-god fusion creates instant intrigue.',
      alternative: 'ThothLabs'
    },
    {
      id: 3,
      persona: 'Tech CEO',
      score: 7,
      quote: 'Distinctive but might be too abstract for some enterprise clients.',
      alternative: 'MakoVault'
    },
    {
      id: 4,
      persona: 'Marketing Director',
      score: 9,
      quote: 'Visual potential is enormous. The logo alone could become iconic.',
      alternative: 'SovereignShark'
    },
    {
      id: 5,
      persona: 'Software Engineer',
      score: 8,
      quote: 'Cool name. Sounds like a powerful framework or tool.',
      alternative: 'DevThoth'
    },
    {
      id: 6,
      persona: 'Design Lead',
      score: 10,
      quote: 'Perfect balance of aggression and intelligence. The brand visuals write themselves.',
      alternative: 'AzureThoth'
    },
    {
      id: 7,
      persona: 'Angel Investor',
      score: 8,
      quote: 'Unforgettable. In a sea of generic tech names, this stands out immediately.',
      alternative: 'NileCode'
    }
  ];

  useEffect(() => {
    // Fetch AI analysis for each project
    const fetchProjectAnalysis = async () => {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          try {
            const response = await fetch('/api/analyze-repo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ repoUrl: project.githubUrl }),
            });

            const data: AnalysisResponse = await response.json();

            if (data.success) {
              // Convert valuation to $125/hr rate (instead of $100/hr used in API)
              const hours = data.metrics.commits / 2;
              const valuation = Math.round(hours * data.metrics.complexity * 125);
              
              // Extract first 2-3 languages as tech stack
              const techStack = data.metrics.languages.slice(0, 3);
              
              // Calculate quality score based on metrics
              const qualityScore = Math.min(
                100,
                Math.max(
                  60,
                  Math.round(
                    (data.metrics.commits > 50 ? 20 : 10) +
                    (data.metrics.stars > 10 ? 15 : 5) +
                    (data.metrics.forks > 5 ? 10 : 5) +
                    (data.metrics.complexity * 10) +
                    (techStack.length * 5)
                  )
                )
              );

              return {
                ...project,
                description: data.repository.description || `A ${project.category.toLowerCase()} project with ${data.metrics.commits} commits and ${data.metrics.stars} stars.`,
                techStack,
                engineeringHours: Math.round(hours),
                qualityScore,
                valuation,
                salesPitch: data.aiPitch.split('\n')[0] || `AI-powered ${project.category.toLowerCase()} solution with strong technical foundation.`,
                loading: false,
                error: null
              };
            } else {
              throw new Error('API returned unsuccessful response');
            }
          } catch (error) {
            console.error(`Failed to analyze ${project.name}:`, error);
            // Fallback to hardcoded data if API fails
            const fallbackData = getFallbackData(project.id);
            return {
              ...project,
              ...fallbackData,
              loading: false,
              error: 'Using fallback data due to API error'
            };
          }
        })
      );

      setProjects(updatedProjects);
    };

    fetchProjectAnalysis();
  }, []);

  // Fallback data in case API fails
  const getFallbackData = (id: number) => {
    const fallbacks = [
      {
        description: 'Competitive coding platform with real-time AI tournaments and blockchain rewards',
        techStack: ['Python', 'React', 'PostgreSQL', 'WebSocket'],
        engineeringHours: 420,
        qualityScore: 92,
        valuation: 52500,
        salesPitch: 'A next-gen esports platform where developers compete in live coding battles with AI judges and crypto prizes.'
      },
      {
        description: '3D racing simulation with blockchain integration and NFT camel ownership',
        techStack: ['Unity', 'C#', 'Node.js', 'MongoDB'],
        engineeringHours: 380,
        qualityScore: 88,
        valuation: 47500,
        salesPitch: 'Immersive desert racing game combining traditional sport with modern blockchain technology.'
      },
      {
        description: 'Commercial cleaning management platform with AI scheduling and automated invoicing',
        techStack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe'],
        engineeringHours: 520,
        qualityScore: 95,
        valuation: 65000,
        salesPitch: 'Reduces administrative workload by 70% for commercial cleaning companies through intelligent automation.'
      },
      {
        description: 'Choose-your-own-adventure platform with AI-generated storylines and multiplayer quests',
        techStack: ['HTML/CSS', 'JavaScript', 'OpenAI API', 'Firebase'],
        engineeringHours: 280,
        qualityScore: 85,
        valuation: 35000,
        salesPitch: 'Revolutionizes interactive storytelling with AI-driven narratives that adapt to player choices.'
      }
    ];
    return fallbacks[id - 1] || fallbacks[0];
  };

  const totalPortfolioValue = projects.reduce((sum, project) => sum + project.valuation, 0);
  const averageQualityScore = projects.reduce((sum, project) => sum + project.qualityScore, 0) / projects.length;
  const allProjectsLoaded = projects.every(p => !p.loading);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Simple background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-gray-900 to-black"></div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Logo and Headline */}
            <div className="mb-16 flex flex-col items-center">
              <div className="mb-8">
                {/* Logo - will be generated by API */}
                <div className="relative w-[400px] h-[200px] mx-auto mb-6">
                  <Image
                    src="/mako-thoth-logo.png"
                    alt="MAKO THOTH Logo"
                    width={400}
                    height={200}
                    className="filter drop-shadow-[0_0_30px_#f59e0b]"
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoLoaded(false)}
                  />
                  {!logoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-[#f59e0b]">
                        MAKO THOTH
                      </h1>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Sovereign Intelligence
                  </h2>
                  <p className="text-2xl text-[#f59e0b] font-serif mb-2">
                    Divine Code Valuation
                  </p>
                  <p className="text-lg text-silver mt-4 mb-6">
                    Premium Software Portfolio • AI-Valued • Available for Acquisition
                  </p>
                  
                  {/* Generate Logo Button */}
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/generate-logo');
                        const data = await response.json();
                        if (data.success) {
                          // Reload the page to show the new logo
                          window.location.reload();
                        } else {
                          alert('Failed to generate logo: ' + (data.error || data.message));
                        }
                      } catch (error) {
                        console.error('Error generating logo:', error);
                        alert('Error generating logo. Check console.');
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white font-bold rounded-lg hover:opacity-90 transition"
                  >
                    Generate Logo
                  </button>
                </div>
              </div>
            </div>

            {/* Sovereign Badge */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-[#F59E0B] bg-black">
                <span className="text-sm font-semibold text-[#F59E0B]">SOVEREIGN ASSET VAULT • EXCLUSIVE ACCESS REQUIRED</span>
              </div>
            </div>

            {/* Portfolio Vault */}
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-10 text-center">PORTFOLIO VAULT</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-black border-2 border-[#f59e0b] rounded-xl p-6 transition-all duration-300 hover:border-[#f59e0b]/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                  >
                    {project.loading ? (
                      <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f59e0b]"></div>
                        <p className="mt-4 text-silver">AI Analyzing {project.name}...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                            <div className="text-sm text-[#f59e0b] mt-1">{project.category}</div>
                            {project.error && (
                              <div className="text-xs text-amber-500 mt-1">{project.error}</div>
                            )}
                          </div>
                          <div className="px-3 py-1 bg-[#f59e0b]/20 rounded-full">
                            <span className="text-sm font-bold text-[#f59e0b]">{project.qualityScore}/100</span>
                          </div>
                        </div>
                        
                        <p className="text-silver text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        {/* Tech Stack */}
                        <div className="mb-4">
                          <div className="text-xs text-silver mb-2">TECH STACK</div>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span key={tech} className="px-3 py-1 bg-gray-900 rounded-full text-xs text-silver">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Valuation */}
                        <div className="mb-4 p-4 bg-black/50 rounded-lg border border-gray-800">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-xs text-silver">AI VALUATION</div>
                              <div className="text-2xl font-black text-[#f59e0b]">
                                ${project.valuation.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-silver">{project.engineeringHours} hours</div>
                              <div className="text-sm text-white">× $125/hr</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Sales Pitch */}
                        <div className="mb-4">
                          <div className="text-xs text-silver mb-1">AI SALES PITCH</div>
                          <p className="text-sm text-white italic line-clamp-3">"{project.salesPitch}"</p>
                        </div>
                        
                        <button className="w-full py-3 bg-black border-2 border-[#f59e0b] text-[#f59e0b] font-bold rounded-lg hover:bg-[#f59e0b]/10 transition">
                          Request Access
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Summary - Only show when all projects loaded */}
            {allProjectsLoaded && (
              <div className="mb-16 p-8 rounded-3xl border-2 border-[#f59e0b] bg-[#0a0a0f]">
                <h2 className="text-3xl font-bold text-[#F59E0B] mb-8 text-center">VALUATION METHODOLOGY</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">${totalPortfolioValue.toLocaleString()}</div>
                    <div className="text-sm text-silver">Total Portfolio Value</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">{averageQualityScore.toFixed(0)}/100</div>
                    <div className="text-sm text-silver">Average Quality Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">$125/hr</div>
                    <div className="text-sm text-silver">Elite Market Rate</div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-lg text-white">
                    <span className="text-[#f59e0b] font-bold">Proprietary Algorithm:</span> Engineering Hours × Elite Market Rate
                  </p>
                  <p className="text-silver mt-2">
                    Each project is analyzed for code quality, architecture, market potential, and technical sophistication.
                  </p>
                </div>
              </div>
            )}

            {/* Name Generator Section */}
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-[#F59E0B] mb-4 text-center">Validate the MAKO THOTH Brand</h2>
              <p className="text-lg text-silver text-center mb-10 max-w-2xl mx-auto">
                7 AI personas evaluate "MAKO THOTH" as a company name. Each provides a score, quote, and alternative suggestion.
              </p>
              
              <div className="text-center mb-10">
                <button className="px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#f59e0b] text-white font-bold text-lg rounded-lg hover:opacity-90 transition">
                  Get Investor Feedback
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {personaEvaluations.map((evalItem) => (
                  <div
                    key={evalItem.id}
                    className="bg-black border-2 border-[#f59e0b] rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">{evalItem.persona}</h3>
                      <div className="px-3 py-1 bg-[#f59e0b]/20 rounded-full">
                        <span className="text-sm font-bold text-[#f59e0b]">{evalItem.score}/10</span>
                      </div>
                    </div>
                    
                    <p className="text-silver text-sm mb-4 italic">"{evalItem.quote}"</p>
                    
                    <div className="pt-4 border-t border-gray-800">
                      <div className="text-xs text-silver mb-1">Alternative Suggestion</div>
                      <div className="text-white font-bold">{evalItem.alternative}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-900 py-8 text-center text-silver text-sm">
          <div className="container mx-auto px-4">
            <p className="text-white font-bold">MAKO THOTH • SOVEREIGN INTELLIGENCE • DIVINE CODE VALUATION</p>
            <p className="mt-2">Private equity dashboard for elite software assets • AI-powered valuation engine</p>
            <p className="mt-1 text-xs text-silver">© 2025 MAKO THOTH Sovereign Asset Vault. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
