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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
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
            <h1 className="text-4xl font-bold mb-3">DealRoom</h1>
            <p className="text-xl text-gray-600">
              Live analysis, buyer matching, and deal execution for your software assets.
            </p>
          </div>

          {/* Main Analysis Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 mb-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Analyze a New Asset</h2>
                <p className="text-gray-600">Run a full AI valuation on a target repository.</p>
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAnalyzeRepo}
                    disabled={isAnalyzing || !repoUrl.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center"
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
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                    <span className="font-medium text-blue-800">AI analyzing repository...</span>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className={`p-6 rounded-xl border ${analysisResult.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-start mb-4">
                    {analysisResult.error ? (
                      <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">
                        {analysisResult.error ? 'Analysis Failed' : 'Analysis Complete'}
                      </h3>
                      <p className="text-sm opacity-80">
                        {analysisResult.error ? analysisResult.error : `Valuation for ${analysisResult.repoData.name}`}
                      </p>
                    </div>
                  </div>

                  {!analysisResult.error && analysisResult.valuation && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-500">Low Estimate</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {formatCurrency(analysisResult.valuation.low)}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-500">Market Value</div>
                        <div className="text-2xl font-bold text-green-700">
                          {formatCurrency((analysisResult.valuation.low + analysisResult.valuation.high) / 2)}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-500">High Estimate</div>
                        <div className="text-2xl font-bold text-purple-700">
                          {formatCurrency(analysisResult.valuation.high)}
                        </div>
                      </div>
                    </div>
                  )}

                  {!analysisResult.error && analysisResult.valuation?.factors && (
                    <div className="mt-6">
                      <h4 className="font-bold mb-2">Key Factors</h4>
                      <ul className="space-y-2">
                        {analysisResult.valuation.factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-center text-sm">
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
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Present in BoardRoom</h3>
                <p className="text-gray-600 mb-6">
                  Let Roxy present this analysis to investors with AI-driven storytelling.
                </p>
                <div className="text-blue-600 font-medium flex items-center">
                  Launch Presentation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Data Room</h3>
              <p className="text-gray-600 mb-6">
                Share sensitive diligence materials with encrypted, permissioned access.
              </p>
              <div className="text-gray-400 text-sm font-medium">Coming Soon</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <FileCode className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Add to ShowRoom</h3>
              <p className="text-gray-600 mb-6">
                Feature this asset in your public portfolio for passive buyer interest.
              </p>
              <div className="text-gray-400 text-sm font-medium">Connect to ShowRoom</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}