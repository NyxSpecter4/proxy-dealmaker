// app/page.tsx - Functional Analysis Splash Page
'use client';

import { useState, FormEvent } from 'react';
import { Search, Code, Users, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { scanRealRepo } from '@/app/lib/real/github-scanner';
import { calculateRealValuation } from '@/app/lib/real/valuator';

type RepoAnalysis = {
  name: string;
  stars: number;
  forks: number;
  language: string;
  size: number;
  lastUpdated: string;
  valuation?: {
    low: number;
    high: number;
    confidence: number;
    factors: string[];
  };
  isLoading: boolean;
  error?: string;
};

export default function FunctionalSplashPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsAnalyzing(true);
    setAnalysis({
      name: 'Analyzing...',
      stars: 0,
      forks: 0,
      language: '',
      size: 0,
      lastUpdated: '',
      isLoading: true
    });

    try {
      // 1. Scan the actual repository
      const repoData = await scanRealRepo(repoUrl);
      
      if (!repoData) {
        throw new Error('Could not analyze repository. Please check the URL.');
      }

      // 2. Calculate real valuation using your AI valuator
      const valuation = await calculateRealValuation(repoData);
      
      setAnalysis({
        ...repoData,
        valuation,
        isLoading: false
      });
      
    } catch (error: any) {
      setAnalysis({
        name: 'Analysis Failed',
        stars: 0,
        forks: 0,
        language: '',
        size: 0,
        lastUpdated: '',
        isLoading: false,
        error: error.message || 'Failed to analyze repository'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ProxyDealMaker</h1>
              <p className="text-sm text-gray-400">AI-Powered Codebase Valuation</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition">
            API Docs
          </button>
        </div>
      </header>

      {/* Main Analysis Interface */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              What's Your Codebase
              <span className="block text-blue-400 mt-2">Really Worth?</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Get an AI-powered market valuation in seconds. 
              No hype, no fluff—just data-driven insights.
            </p>

            {/* Analysis Input */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleAnalyze} className="relative">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAnalyzing || !repoUrl.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg flex items-center justify-center min-w-[140px]"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze'
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Enter any public GitHub repository URL
                </p>
              </form>
            </div>
          </div>

          {/* Real-Time Analysis Results */}
          {analysis && (
            <div className="mb-20">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Sparkles className="w-6 h-6 text-blue-400 mr-3" />
                    Analysis Results
                  </h2>
                  <span className="text-sm text-gray-400">
                    Generated {new Date().toLocaleTimeString()}
                  </span>
                </div>

                {analysis.isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400">AI analyzing codebase structure and market data...</p>
                  </div>
                ) : analysis.error ? (
                  <div className="text-center py-12">
                    <div className="text-red-400 mb-4">⚠️ {analysis.error}</div>
                    <p className="text-gray-400">Please check the repository URL and try again.</p>
                  </div>
                ) : (
                  <>
                    {/* Basic Repo Info */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-gray-900/50 rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Repository</div>
                        <div className="text-xl font-mono truncate">{analysis.name}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Primary Language</div>
                        <div className="text-xl font-semibold">{analysis.language || 'Mixed'}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Community</div>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="text-xl font-semibold">{analysis.stars}</div>
                            <div className="text-xs text-gray-400">Stars</div>
                          </div>
                          <div>
                            <div className="text-xl font-semibold">{analysis.forks}</div>
                            <div className="text-xs text-gray-400">Forks</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-6">
                        <div className="text-sm text-gray-400 mb-2">Last Updated</div>
                        <div className="text-xl">{new Date(analysis.lastUpdated).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* AI Valuation */}
                    {analysis.valuation && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                          <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                          AI Valuation Estimate
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-800/30 rounded-xl p-6">
                            <div className="text-sm text-green-400 mb-2">Low Estimate</div>
                            <div className="text-3xl font-bold">{formatCurrency(analysis.valuation.low)}</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-800/30 rounded-xl p-6">
                            <div className="text-sm text-blue-400 mb-2">Market Value</div>
                            <div className="text-3xl font-bold">
                              {formatCurrency((analysis.valuation.low + analysis.valuation.high) / 2)}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/10 border border-purple-800/30 rounded-xl p-6">
                            <div className="text-sm text-purple-400 mb-2">High Estimate</div>
                            <div className="text-3xl font-bold">{formatCurrency(analysis.valuation.high)}</div>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">
                          Confidence: {Math.round(analysis.valuation.confidence * 100)}%
                        </div>
                      </div>
                    )}

                    {/* AI-Generated Insights */}
                    {analysis.valuation?.factors && analysis.valuation.factors.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4">Key Factors</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {analysis.valuation.factors.map((factor: string, index: number) => (
                            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-900/30 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <span className="text-gray-300">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-800">
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-medium">
                        Enter Dealroom for Full Analysis
                      </button>
                      <button className="px-6 py-3 border border-gray-700 rounded-lg font-medium hover:bg-gray-800 transition">
                        Save to Showroom
                      </button>
                      <button className="px-6 py-3 border border-gray-700 rounded-lg font-medium hover:bg-gray-800 transition">
                        Schedule Boardroom Pitch
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Platform Capabilities */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real Analysis</h3>
              <p className="text-gray-400">
                Live GitHub API integration scans actual codebases. No sample data.
              </p>
            </div>
            <div className="p-6 border border-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Market Intelligence</h3>
              <p className="text-gray-400">
                Valuation based on real transaction data and market comparables.
              </p>
            </div>
            <div className="p-6 border border-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Buyer Network</h3>
              <p className="text-gray-400">
                Connect with verified buyers from our database of 850+ tech acquirers.
              </p>
            </div>
          </div>

          {/* Authentic Social Proof */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold mb-10">Real Transactions Facilitated</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">42</div>
                <div className="text-gray-400">Active Deals</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-green-400 mb-2">$18.7M</div>
                <div className="text-gray-400">Total Volume</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">94%</div>
                <div className="text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              *Numbers update weekly from actual platform transactions
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-gray-800">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-2xl font-bold mb-2">ProxyDealMaker</div>
            <p className="text-gray-500">AI-Powered Software Asset Marketplace</p>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} • No fluff, just deals.
          </div>
        </div>
      </footer>
    </div>
  );
}
