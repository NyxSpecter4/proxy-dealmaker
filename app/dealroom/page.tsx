// app/dealroom/page.tsx - INTEGRATED VERSION
'use client';

import { useState } from 'react';
import { Search, FileCode, TrendingUp, Users, Shield, ArrowRight, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Logo from '@/app/components/Logo';
import Link from 'next/link';
import { scanRealRepo } from '@/app/lib/real/github-scanner';
import { calculateRealValuation } from '@/app/lib/real/valuator';

type AnalysisResult = {
  repoData: any;
  valuation: any;
  error?: string;
};

export default function DealRoomPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyzeRepo = async () => {
    if (!repoUrl.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // 1. Scan the repository using your real module
      const repoData = await scanRealRepo(repoUrl);
      if (!repoData) {
        throw new Error('Could not fetch repository data. Please check the URL.');
      }

      // 2. Calculate valuation using your real valuator
      const valuation = await calculateRealValuation(repoData);

      setAnalysisResult({ repoData, valuation });
    } catch (error: any) {
      setAnalysisResult({
        repoData: null,
        valuation: null,
        error: error.message || 'Analysis failed'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-[#111111] border-b border-[#f59e0b]/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-[#f59e0b] hover:text-white">
                ← Back to Dashboard
              </Link>
              <div className="text-sm px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] rounded-full">
                DealRoom • Live
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 text-[#f59e0b]">DealRoom</h1>
            <p className="text-xl text-silver">
              Live analysis, buyer matching, and deal execution for your software assets.
            </p>
          </div>

          {/* Main Analysis Card */}
          <div className="bg-[#111111] rounded-2xl border border-[#f59e0b]/30 p-8 mb-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Analyze a New Asset</h2>
                <p className="text-silver">Run a full AI valuation on a target repository.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Repository URL</label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="flex-1 px-4 py-3 border border-[#f59e0b]/30 bg-[#111111] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  />
                  <button
                    onClick={handleAnalyzeRepo}
                    disabled={isAnalyzing || !repoUrl.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Analysis Results */}
              {isAnalyzing && (
                <div className="p-6 bg-[#f59e0b]/10 rounded-xl border border-[#f59e0b]/30">
                  <div className="flex items-center">
                    <Loader className="w-5 h-5 text-[#f59e0b] animate-spin mr-3" />
                    <span className="font-medium text-[#f59e0b]">AI analyzing repository...</span>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className={`p-6 rounded-xl border ${analysisResult.error ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                  <div className="flex items-start mb-4">
                    {analysisResult.error ? (
                      <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {analysisResult.error ? 'Analysis Failed' : 'Analysis Complete'}
                      </h3>
                      <p className="text-sm opacity-80 text-silver">
                        {analysisResult.error ? analysisResult.error : `Valuation for ${analysisResult.repoData.name}`}
                      </p>
                    </div>
                  </div>

                  {!analysisResult.error && analysisResult.valuation && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-[#111111] p-4 rounded-lg border border-[#f59e0b]/30">
                        <div className="text-sm text-silver">Low Estimate</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {formatCurrency(analysisResult.valuation.low)}
                        </div>
                      </div>
                      <div className="bg-[#111111] p-4 rounded-lg border border-[#f59e0b]/30">
                        <div className="text-sm text-silver">Market Value</div>
                        <div className="text-2xl font-bold text-green-400">
                          {formatCurrency((analysisResult.valuation.low + analysisResult.valuation.high) / 2)}
                        </div>
                      </div>
                      <div className="bg-[#111111] p-4 rounded-lg border border-[#f59e0b]/30">
                        <div className="text-sm text-silver">High Estimate</div>
                        <div className="text-2xl font-bold text-purple-400">
                          {formatCurrency(analysisResult.valuation.high)}
                        </div>
                      </div>
                    </div>
                  )}

                  {!analysisResult.error && analysisResult.valuation?.factors && (
                    <div className="mt-6">
                      <h4 className="font-bold mb-2 text-white">Key Factors</h4>
                      <ul className="space-y-2">
                        {analysisResult.valuation.factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-center text-sm text-silver">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/boardroom" className="group">
              <div className="bg-[#111111] border border-[#f59e0b]/30 rounded-2xl p-8 h-full hover:border-[#f59e0b] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Present in BoardRoom</h3>
                <p className="text-silver mb-6">
                  Let Roxy present this analysis to investors with AI-driven storytelling.
                </p>
                <div className="text-[#f59e0b] font-medium flex items-center">
                  Launch Presentation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <div className="bg-[#111111] border border-[#f59e0b]/30 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Secure Data Room</h3>
              <p className="text-silver mb-6">
                Share sensitive diligence materials with encrypted, permissioned access.
              </p>
              <div className="text-silver text-sm font-medium">Coming Soon</div>
            </div>

            <div className="bg-[#111111] border border-[#f59e0b]/30 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <FileCode className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Add to ShowRoom</h3>
              <p className="text-silver mb-6">
                Feature this asset in your public portfolio for passive buyer interest.
              </p>
              <div className="text-silver text-sm font-medium">Connect to ShowRoom</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}