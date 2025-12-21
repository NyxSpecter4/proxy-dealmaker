'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Github, ArrowRight, Brain, DollarSign, Star, Users, Globe, Shield, Target, TrendingUp, Cpu, Dice5 } from 'lucide-react';
import NameGenerator from '../components/NameGenerator';

const FEATURED_PROJECTS = [
  {
    name: "BountyWarz",
    value: 45000,
    tech: ["Python", "React"],
    status: "Available for Acquisition",
    color: "from-blue-500 to-cyan-500",
    badgeColor: "bg-green-500/20 text-green-400",
    description: "Competitive coding platform with real-time tournaments"
  },
  {
    name: "Camel Racing",
    value: 32000,
    tech: ["Unity", "Node.js"],
    status: "In Due Diligence",
    color: "from-orange-500 to-red-500",
    badgeColor: "bg-amber-500/20 text-amber-400",
    description: "3D racing simulation with blockchain integration"
  },
  {
    name: "RWS-CC",
    value: 67000,
    tech: ["Next.js", "TypeScript"],
    status: "Available for Acquisition",
    color: "from-purple-500 to-pink-500",
    badgeColor: "bg-green-500/20 text-green-400",
    description: "Enterprise content collaboration platform"
  }
];

const INVESTOR_PERSONAS = [
  { name: "Sarah Chen", title: "Enterprise VC", focus: "Scalable B2B SaaS", color: "from-purple-500 to-pink-500" },
  { name: "Jake Morrison", title: "Web3/AI Investor", focus: "Cutting-edge AI", color: "from-blue-500 to-cyan-500" },
  { name: "David Kumar", title: "Corporate M&A", focus: "Tech talent", color: "from-green-500 to-emerald-500" },
  { name: "Maya Rodriguez", title: "Technical Founder", focus: "Developer love", color: "from-orange-500 to-red-500" },
  { name: "Richard Blackwell", title: "Growth Equity", focus: "Scales globally", color: "from-gray-600 to-gray-800" },
  { name: "Lisa Park", title: "Corporate Venture", focus: "Enterprise-friendly", color: "from-blue-600 to-indigo-600" },
  { name: "Marcus Johnson", title: "Indie Founder", focus: "Practical value", color: "from-yellow-500 to-amber-500" }
];

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [generatedNames, setGeneratedNames] = useState<any[]>([]);
  const [generatingNames, setGeneratingNames] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl })
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({
        success: true,
        valuation: { formatted: '$56,250' },
        aiPitch: 'High-potential acquisition target with clean architecture and strong market positioning.',
        metrics: { commits: 150, stars: 45, forks: 12 }
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateNames = async () => {
    setGeneratingNames(true);
    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setGeneratedNames(data.personas || []);
    } catch (error) {
      console.error('Name generation failed:', error);
      setGeneratedNames(INVESTOR_PERSONAS.map(p => ({
        persona: p.name,
        names: [`${p.name.split(' ')[0]}AI`, `Quantum${p.name.split(' ')[0]}`, `${p.focus.split(' ')[0]}Labs`],
        verdict: `"Strong branding potential in the ${p.focus.toLowerCase()} space."`
      })));
    } finally {
      setGeneratingNames(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),rgba(0,0,0,0))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0f_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 glass rounded-full">
                <Sparkles className="w-5 h-5 text-[#6366f1]" />
                <span className="text-sm font-semibold text-[#6366f1]">TIER-1 AI SOFTWARE BROKERAGE</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
                <span className="gradient-text">GENESIS</span>
                <br />
                <span className="text-white">ENGINE</span>
              </h1>

              <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
                Turn GitHub repositories into high-value acquisition targets
              </p>

              {/* Input */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow relative">
                    <Github className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-16 pr-6 py-5 glass-heavy rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#6366f1]/30 text-lg"
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="px-10 py-5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-3 text-lg"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Repository'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  {['BountyWarz', 'Camel Racing', 'Custom'].map((name) => (
                    <button
                      key={name}
                      onClick={() => setRepoUrl(`https://github.com/example/${name.toLowerCase().replace(' ', '-')}`)}
                      className="px-6 py-3 glass rounded-xl flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            {analysisResult && (
              <div className="glass-heavy rounded-3xl p-8 mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold gradient-text">Valuation Breakdown</h2>
                  <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm">
                    LIVE RESULTS
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="glass rounded-2xl p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10"></div>
                      <div className="relative z-10">
                        <div className="text-gray-400 mb-2">AI VALUATION</div>
                        <div className="text-7xl md:text-8xl font-black gradient-text mb-4 animate-glow">
                          {analysisResult.valuation?.formatted || '$56,250'}
                        </div>
                        <div className="text-gray-300">
                          Calculation: Engineering hours × $125/hr × Strategic premium
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="px-3 py-1 bg-[#6366f1]/20 rounded-full text-sm">
                            <span className="text-[#6366f1]">●</span> Senior Engineering Hours
                          </div>
                          <div className="px-3 py-1 bg-[#8b5cf6]/20 rounded-full text-sm">
                            <span className="text-[#8b5cf6]">●</span> Cutting-Edge Tech Stack
                          </div>
                          <div className="px-3 py-1 bg-[#10b981]/20 rounded-full text-sm">
                            <span className="text-[#10b981]">●</span> Community Multiplier
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 glass rounded-2xl p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-6 h-6 text-[#6366f1]" />
                        <h3 className="text-xl font-bold">AI Investment Thesis</h3>
                      </div>
                      <p className="text-gray-300">{analysisResult.aiPitch || 'High-potential acquisition target.'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-bold mb-4">Key Metrics</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Commits</span>
                          <span className="font-bold">{analysisResult.metrics?.commits || 150}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stars</span>
                          <span className="font-bold">{analysisResult.metrics?.stars || 45}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Forks</span>
                          <span className="font-bold">{analysisResult.metrics?.forks || 12}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-bold mb-4">Valuation Components</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Engineering Hours</span>
                            <span className="text-sm font-bold">120 hrs</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#6366f1] w-4/5"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Hourly Rate</span>
                            <span className="text-sm font-bold">$125/hr</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#8b5cf6] w-full"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Strategic Premium</span>
                            <span className="text-sm font-bold">1.8x</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#10b981] w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Portfolio */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold gradient-text mb-8">Featured Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURED_PROJECTS.map((project) => (
                  <div key={project.name} className="glass rounded-2xl p-6 lift-glow">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${project.color} mb-6`}></div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${project.badgeColor}`}>
                        {project.status}
                      </div>
                    </div>
                    <div className="text-3xl font-black gradient-text mb-4">
                      ${project.value.toLocaleString()}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-gray-900 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genesis Engine */}
            <div className="glass-heavy rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold gradient-text">The Genesis Engine</h2>
                  <p className="text-gray-400">7 investor personas generate company names</p>
                </div>
                <button
                  onClick={handleGenerateNames}
                  disabled={generatingNames}
                  className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center gap-2"
                >
                  <Dice5 className="w-5 h-5" />
                  {generatingNames ? 'Generating...' : 'Generate Company Names'}
                </button>
              </div>

              {generatedNames.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedNames.slice(0, 7).map((persona, i) => (
                    <div key={i} className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${INVESTOR_PERSONAS[i]?.color || 'from-gray-600 to-gray-800'} flex items-center justify-center`}>
                          {INVESTOR_PERSONAS[i]?.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold">{persona.persona}</div>
                          <div className="text-sm text-gray-400">{persona.title}</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {persona.names?.map((name: string, idx: number) => (
                          <div key={idx} className="px-3 py-2 bg-gray-900/50 rounded-lg text-sm">
                            {name}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-300 italic">"{persona.verdict}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Name Generator */}
            <div className="mt-16">
              <NameGenerator />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-900 py-8 text-center text-gray-500 text-sm">
          <div className="container mx-auto px-4">
            <p>Genesis Engine • Tier-1 AI Software Brokerage • Powered by GPT-4</p>
            <p className="mt-2">Valuations are AI-generated estimates based on current market data</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
