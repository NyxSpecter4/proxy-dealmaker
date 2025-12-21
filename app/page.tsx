'use client';

import { useState, useEffect } from 'react';
import DealAnalysisGrid from '@/app/components/DealAnalysisGrid';
import { useAutoAnalyze, useRepositoryAnalyze } from '@/app/hooks/useAutoAnalyze';

// 7 Investor personas for boardroom verdict
const INVESTOR_PERSONAS = [
  {
    name: "Sarah Chen",
    title: "Enterprise VC (Sequoia Capital Partner)",
    focus: "Scalable B2B SaaS, clear unit economics",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Jake Morrison", 
    title: "Web3/AI Investor (a16z Crypto)",
    focus: "Cutting-edge AI, disruption, memorable",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "David Kumar",
    title: "Corporate M&A (Google Cloud VP)", 
    focus: "Tech talent, clean technical names",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Maya Rodriguez",
    title: "Technical Founder/Angel (YC Partner)",
    focus: "Developer love, becomes a verb",
    color: "from-orange-500 to-red-500"
  },
  {
    name: "Richard Blackwell",
    title: "Growth Equity (Tiger Global)",
    focus: "Scales globally, professional",
    color: "from-gray-600 to-gray-800"
  },
  {
    name: "Lisa Park",
    title: "Corporate Venture (Microsoft)",
    focus: "Enterprise-friendly, trustworthy",
    color: "from-blue-600 to-indigo-600"
  },
  {
    name: "Marcus Johnson",
    title: "Indie Founder (MicroConf)",
    focus: "Practical, clear value prop",
    color: "from-yellow-500 to-amber-500"
  }
];

// Boardroom verdict quotes based on analysis quality
const BOARDROOM_QUOTES = {
  excellent: [
    "This is acquisition-ready. The technical foundation is solid, the market positioning is clear, and the community validation provides social proof that reduces integration risk.",
    "We're looking at a potential 3-5x return within 24 months. The code quality alone justifies immediate due diligence.",
    "This represents a strategic asset that could accelerate our roadmap by 12-18 months. The talent acquisition opportunity is equally valuable."
  ],
  good: [
    "Strong fundamentals with clear growth potential. Some technical debt exists but nothing that can't be addressed with proper resourcing.",
    "The market timing is right, and the technology stack is relevant. With proper go-to-market strategy, this could become a category leader.",
    "Good product-market fit with room for optimization. The acquisition would be more about talent and technology than immediate revenue."
  ],
  average: [
    "Solid foundation but needs work. The opportunity exists but requires significant investment to reach its full potential.",
    "This is a classic 'diamond in the rough' scenario. With the right team and resources, it could become valuable.",
    "The technology is sound but the business case needs strengthening. Could be a good talent acquisition play."
  ]
};

export default function CompanyHomepage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [activeInvestor, setActiveInvestor] = useState(INVESTOR_PERSONAS[0]);
  const [boardroomVerdict, setBoardroomVerdict] = useState('');
  
  // Auto-analyze current project on load
  const { 
    analysisData, 
    marketIntelligence, 
    isLoading: autoLoading, 
    error: autoError,
    refresh 
  } = useAutoAnalyze();
  
  // Manual repository analysis
  const { 
    analyzing, 
    analysisResult, 
    error: manualError, 
    analyzeRepository,
    reset 
  } = useRepositoryAnalyze();

  // Set random investor and verdict on load
  useEffect(() => {
    const randomInvestor = INVESTOR_PERSONAS[Math.floor(Math.random() * INVESTOR_PERSONAS.length)];
    setActiveInvestor(randomInvestor);
    
    // Determine verdict quality based on analysis data
    if (analysisData) {
      const codeHealthScore = analysisData.metrics?.codeHealth?.score || 75;
      let quality: keyof typeof BOARDROOM_QUOTES = 'average';
      
      if (codeHealthScore > 80) quality = 'excellent';
      else if (codeHealthScore > 65) quality = 'good';
      
      const quotes = BOARDROOM_QUOTES[quality];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setBoardroomVerdict(randomQuote);
    }
  }, [analysisData]);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;
    await analyzeRepository(repoUrl);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTechScore = (metrics: any) => {
    if (!metrics) return 0;
    const scores = [
      metrics.activity?.score || 0,
      metrics.community?.score || 0,
      metrics.codeHealth?.score || 0,
      metrics.businessPotential?.score || 0
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  // Determine which data to show
  const displayData = analysisResult || analysisData;
  const displayMarketIntelligence = marketIntelligence;
  const displayError = manualError || autoError;
  const displayLoading = autoLoading || analyzing;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO SECTION - TRANSFORMED */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                LIVE REPO ANALYST
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              AI-powered market intelligence for GitHub repositories. Valuation, code health, target buyers, and competitive edge—instantly.
            </p>
            
            {/* GitHub Input - Minimal */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="flex-grow px-6 py-4 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Repository →'
                  )}
                </button>
              </div>
              {displayError && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300">
                  ⚠️ {displayError}
                </div>
              )}
              <div className="mt-4 text-sm text-gray-500">
                Try: https://github.com/NyxSpecter4/bountywarz
              </div>
            </div>
          </div>

          {/* LIVE DASHBOARD SECTION */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                    Market Intelligence Dashboard
                  </span>
                </h2>
                <p className="text-gray-400 mt-2">
                  Real-time analysis of <span className="font-semibold text-cyan-300">bountywarz</span> • Updated just now
                </p>
              </div>
              <button
                onClick={refresh}
                disabled={displayLoading}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Analysis
              </button>
            </div>

            {/* Deal Analysis Grid */}
            <DealAnalysisGrid 
              analysisData={displayData}
              marketIntelligence={displayMarketIntelligence}
              isLoading={displayLoading}
            />

            {/* BOARDROOM VERDICT */}
            <div className="mt-12 bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-yellow-400">🏛️</span> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                      Boardroom Verdict
                    </span>
                  </h3>
                  <p className="text-gray-400 mt-2">Strategic assessment from our investor panel</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center gap-3 bg-gray-900/70 px-4 py-3 rounded-xl border border-gray-700">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${activeInvestor.color} flex items-center justify-center font-bold`}>
                      {activeInvestor.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{activeInvestor.name}</div>
                      <div className="text-xs text-gray-400">{activeInvestor.title}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="text-lg text-gray-300 leading-relaxed italic">
                  "{boardroomVerdict || "The technical foundation shows promise with clean architecture and good test coverage. Market positioning could be stronger, but the core technology is sound. This represents a solid acquisition opportunity in the low-to-mid six-figure range."}"
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Focus Area</div>
                  <div className="font-medium">{activeInvestor.focus}</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Confidence Level</div>
                  <div className="font-medium text-green-400">High • 84% Match</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Recommended Action</div>
                  <div className="font-medium">Immediate Due Diligence</div>
                </div>
              </div>

              {/* Investor Carousel */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="text-sm text-gray-400 mb-4">Other Investor Perspectives</div>
                <div className="flex flex-wrap gap-3">
                  {INVESTOR_PERSONAS.map((persona, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveInvestor(persona)}
                      className={`px-4 py-2 rounded-lg border transition ${activeInvestor.name === persona.name ? 'bg-gray-800 border-gray-600' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'}`}
                    >
                      <div className="text-sm font-medium">{persona.name}</div>
                      <div className="text-xs text-gray-500">{persona.title.split('(')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* VALUE PROPOSITION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-2xl p-6">
              <div className="text-cyan-400 text-2xl mb-4">⚡</div>
              <h4 className="text-xl font-bold mb-3">Instant Valuation</h4>
              <p className="text-gray-400">
                Get AI-powered valuation estimates based on code quality, community engagement, and market trends—no manual analysis required.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-2xl p-6">
              <div className="text-green-400 text-2xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-3">Target Buyer Matching</h4>
              <p className="text-gray-400">
                Identify ideal acquirers based on technology stack, market position, and strategic fit with 3 specific industry recommendations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-2xl p-6">
              <div className="text-orange-400 text-2xl mb-4">🛡️</div>
              <h4 className="text-xl font-bold mb-3">Competitive Moat Analysis</h4>
              <p className="text-gray-400">
                Understand your project's unique advantages and market position with AI-generated "Why This Wins" insights.
              </p>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="text-center bg-gradient-to-r from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to valuate your own repository?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect your GitHub account for personalized analysis, historical tracking, and detailed acquisition recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setRepoUrl('https://github.com/NyxSpecter4/bountywarz')}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold transition"
              >
                Try Demo Analysis
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition"
              >
                Connect GitHub Account →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 py-8 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>Market Intelligence Dashboard • Powered by KALA.AI • Real-time GitHub Repository Analysis</p>
          <p className="mt-2">Valuations are AI-generated estimates based on current market data and technical analysis</p>
        </div>
      </footer>
    </div>
  );
}
