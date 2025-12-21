'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, DollarSign, Star, Users, Shield, TrendingUp, Cpu, Lock } from 'lucide-react';
import MakoThothLogo from '../components/MakoThothLogo';

// Owner's repositories (hardcoded for private storefront)
const OWNER_REPOSITORIES = [
  {
    name: "bountywarz",
    displayName: "BountyWarz",
    value: 45000,
    tech: ["Python", "React", "FastAPI"],
    status: "Available for Acquisition",
    color: "from-blue-500 to-cyan-500",
    badgeColor: "bg-green-500/20 text-green-400",
    description: "Competitive coding platform with real-time AI tournaments",
    stars: 42,
    forks: 18,
    language: "Python"
  },
  {
    name: "camel-racing",
    displayName: "Camel Racing",
    value: 32000,
    tech: ["Unity", "Node.js", "Blockchain"],
    status: "In Due Diligence",
    color: "from-orange-500 to-red-500",
    badgeColor: "bg-amber-500/20 text-amber-400",
    description: "3D racing simulation with blockchain integration",
    stars: 28,
    forks: 9,
    language: "C#"
  },
  {
    name: "rws-cc",
    displayName: "RWS-CC",
    value: 67000,
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "Available for Acquisition",
    color: "from-purple-500 to-pink-500",
    badgeColor: "bg-green-500/20 text-green-400",
    description: "Enterprise content collaboration platform",
    stars: 56,
    forks: 23,
    language: "TypeScript"
  },
  {
    name: "specter-analyzer",
    displayName: "Specter Analyzer",
    value: 38000,
    tech: ["Python", "ML", "FastAPI"],
    status: "Ready for Acquisition",
    color: "from-green-500 to-emerald-500",
    badgeColor: "bg-green-500/20 text-green-400",
    description: "AI-powered code analysis and vulnerability detection",
    stars: 31,
    forks: 12,
    language: "Python"
  }
];

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState(OWNER_REPOSITORIES[0]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading owner's repositories
    const timer = setTimeout(() => {
      setAnalysisResult({
        success: true,
        valuation: { formatted: '$45,000' },
        aiPitch: 'High-potential acquisition target with clean architecture and strong market positioning. The AI combat systems and real-time tournament infrastructure represent significant technical moat.',
        metrics: { commits: 210, stars: 42, forks: 18 }
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Celestial Background with Starfield */}
      <div className="fixed inset-0 z-0">
        {/* Base cosmic gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),rgba(0,0,0,0))]"></div>
        
        {/* Digital Dust / Starfield */}
        <div className="absolute inset-0 opacity-20">
          <div className="starfield"></div>
        </div>
        
        {/* Ancient Future grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0f_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5"></div>
        
        {/* Slow-moving nebula */}
        <div className="absolute inset-0 opacity-3">
          <div className="nebula"></div>
        </div>
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              {/* Sovereign Badge */}
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 glass rounded-full border border-[#F59E0B]/30">
                <Lock className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-sm font-semibold text-[#F59E0B]">SOVEREIGN ASSET VAULT • OWNER: NYXSPECTER4</span>
              </div>

              {/* Animated Mako Thoth Logo */}
              <div className="mb-8">
                <MakoThothLogo />
              </div>

              {/* Hero Text with Massive Neon White */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 text-white">
                  <span className="text-white drop-shadow-[0_0_30px_rgba(245,158,11,0.7)]">
                    MAKO THOTH
                  </span>
                </h1>
                <p className="text-2xl text-silver max-w-3xl mx-auto font-serif">
                  Sovereign Intelligence. Divine Code Valuation. Private Equity Dashboard.
                </p>
              </motion.div>

              {/* Owner Assets Notice */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="glass-heavy rounded-2xl p-6 border border-[#F59E0B]/20">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-[#F59E0B]" />
                    <span className="text-lg font-bold text-white">PRIVATE STOREFRONT • OWNER ASSETS ONLY</span>
                  </div>
                  <p className="text-silver text-center">
                    This dashboard displays exclusively the software assets of NyxSpecter4. 
                    No external repository analysis permitted.
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Selection */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 font-serif text-center">SELECT ASSET</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {OWNER_REPOSITORIES.map((repo) => (
                  <button
                    key={repo.name}
                    onClick={() => setSelectedRepo(repo)}
                    className={`glass rounded-xl p-4 text-left transition-all duration-300 ${
                      selectedRepo.name === repo.name 
                        ? 'border-2 border-[#F59E0B] bg-[#F59E0B]/10' 
                        : 'border border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white">{repo.displayName}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${repo.badgeColor}`}>
                        {repo.status}
                      </div>
                    </div>
                    <p className="text-silver text-sm mb-3">{repo.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-gold">
                        ${repo.value.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-silver">{repo.stars}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Valuation Results */}
            <div className="glass-heavy rounded-3xl p-8 mb-16 border border-[#F59E0B]/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white font-serif">VALUATION BREAKDOWN</h2>
                <div className="px-4 py-2 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-sm font-bold">
                  SOVEREIGN ASSET
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="glass rounded-2xl p-8 relative overflow-hidden border border-[#F59E0B]/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-[#6366f1]/5"></div>
                    <div className="relative z-10">
                      <div className="text-silver mb-2">AI VALUATION</div>
                      <div className="text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                        {loading ? 'LOADING...' : (analysisResult?.valuation?.formatted || '$45,000')}
                      </div>
                      <div className="text-silver">
                        Calculation: Engineering hours × $125/hr × Strategic premium
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="px-3 py-1 bg-[#F59E0B]/20 rounded-full text-sm">
                          <span className="text-[#F59E0B]">●</span> Senior Engineering Hours
                        </div>
                        <div className="px-3 py-1 bg-[#6366f1]/20 rounded-full text-sm">
                          <span className="text-[#6366f1]">●</span> Cutting-Edge Tech Stack
                        </div>
                        <div className="px-3 py-1 bg-[#10b981]/20 rounded-full text-sm">
                          <span className="text-[#10b981]">●</span> Community Multiplier
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 glass rounded-2xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="w-6 h-6 text-[#F59E0B]" />
                      <h3 className="text-xl font-bold text-white font-serif">AI INVESTMENT THESIS</h3>
                    </div>
                    <p className="text-silver">
                      {loading ? 'Generating AI analysis...' : (analysisResult?.aiPitch || 'High-potential acquisition target with clean architecture and strong market positioning.')}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 border border-gray-800">
                    <h4 className="font-bold mb-4 text-white font-serif">KEY METRICS</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-silver">Commits</span>
                        <span className="font-bold text-white">{selectedRepo.name === 'bountywarz' ? 210 : 150}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-silver">Stars</span>
                        <span className="font-bold text-white">{selectedRepo.stars}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-silver">Forks</span>
                        <span className="font-bold text-white">{selectedRepo.forks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-silver">Primary Language</span>
                        <span className="font-bold text-white">{selectedRepo.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-gray-800">
                    <h4 className="font-bold mb-4 text-white font-serif">VALUATION COMPONENTS</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-silver">Engineering Hours</span>
                          <span className="text-sm font-bold text-white">120 hrs</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F59E0B] w-4/5"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-silver">Hourly Rate</span>
                          <span className="text-sm font-bold text-white">$125/hr</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#6366f1] w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-silver">Strategic Premium</span>
                          <span className="text-sm font-bold text-white">1.8x</span>
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

            {/* Portfolio Summary */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 font-serif text-center">PORTFOLIO SUMMARY</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass rounded-2xl p-6 text-center border border-[#F59E0B]/20">
                  <div className="text-4xl font-black text-gold mb-2">
                    ${OWNER_REPOSITORIES.reduce((sum, repo) => sum + repo.value, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-silver">Total Portfolio Value</div>
                </div>
                <div className="glass rounded-2xl p-6 text-center border border-[#6366f1]/20">
                  <div className="text-4xl font-black text-white mb-2">
                    {OWNER_REPOSITORIES.length}
                  </div>
                  <div className="text-sm text-silver">Sovereign Assets</div>
                </div>
                <div className="glass rounded-2xl p-6 text-center border border-[#10b981]/20">
                  <div className="text-4xl font-black text-white mb-2">
                    {OWNER_REPOSITORIES.filter(r => r.status === 'Available for Acquisition').length}
                  </div>
                  <div className="text-sm text-silver">Available for Acquisition</div>
                </div>
                <div className="glass rounded-2xl p-6 text-center border border-gray-800">
                  <div className="text-4xl font-black text-white mb-2">
                    {OWNER_REPOSITORIES.reduce((sum, repo) => sum + repo.stars, 0)}
                  </div>
                  <div className="text-sm text-silver">Total GitHub Stars</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-900 py-8 text-center text-silver text-sm">
          <div className="container mx-auto px-4">
            <p className="text-white font-bold">MAKO THOTH • SOVEREIGN INTELLIGENCE • DIVINE CODE VALUATION</p>
            <p className="mt-2">Private equity dashboard for NyxSpecter4 software assets • Valuations are AI-generated estimates</p>
            <p className="mt-1 text-xs text-gray-600">Excludes: proxy-dealmaker (this repository)</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
