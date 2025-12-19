// app/page.tsx - Main Splash Page
'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export default function SplashPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrimaryAction = () => {
    setIsLoading(true);
    // This would navigate to your main app or authentication
    console.log('Primary action triggered - navigate to app');
    // Example: router.push('/dashboard');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleGitHubConnect = () => {
    console.log('GitHub OAuth initiated');
    // Implement GitHub OAuth flow here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl">PD</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ProxyDealMaker
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#how" className="text-gray-300 hover:text-white transition">How It Works</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
          </nav>
          <button 
            onClick={handleGitHubConnect}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium transition-all"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Headline with clarity of purpose */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              AI-Powered Deal Execution
              <span className="block text-4xl md:text-5xl font-normal mt-4 text-blue-300">
                for the Code-Driven Economy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Transform software repositories into verified assets.
              <span className="block text-lg text-gray-400 mt-2">
                Automated valuation, intelligent buyer matching, and seamless transaction execution.
              </span>
            </p>

            {/* Primary Call-to-Action */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button
                onClick={handlePrimaryAction}
                disabled={isLoading}
                className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center min-w-[240px]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-3">⟳</span>
                    Processing...
                  </span>
                ) : (
                  <>
                    Analyze Your Repository
                    <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button
                onClick={handleGitHubConnect}
                className="px-10 py-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-2xl font-medium text-lg backdrop-blur-sm transition-all flex items-center"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Connect GitHub
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div className="p-6 bg-gray-800/30 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-300 mb-2">$24M+</div>
                <div className="text-gray-400">Deals Facilitated</div>
              </div>
              <div className="p-6 bg-gray-800/30 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-300 mb-2">1,200+</div>
                <div className="text-gray-400">Repos Analyzed</div>
              </div>
              <div className="p-6 bg-gray-800/30 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-300 mb-2">98.7%</div>
                <div className="text-gray-400">Accuracy Rate</div>
              </div>
              <div className="p-6 bg-gray-800/30 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-orange-300 mb-2">24/7</div>
                <div className="text-gray-400">AI Monitoring</div>
              </div>
            </div>
          </div>

          {/* Value Proposition Visualization */}
          <div className="grid md:grid-cols-3 gap-8 mb-24" id="features">
            <div className="p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Intelligent Valuation</h3>
              <p className="text-gray-400">
                Real-time analysis of code quality, market demand, and comparable transactions.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Automated Matching</h3>
              <p className="text-gray-400">
                AI-driven buyer/seller pairing based on technical requirements and strategic fit.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Execution</h3>
              <p className="text-gray-400">
                End-to-end encrypted deal rooms with smart contract integration.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center py-16" id="how">
            <h2 className="text-4xl font-bold mb-12">From Code to Close in 3 Steps</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="relative z-10 p-8 bg-gray-800/30 rounded-3xl backdrop-blur-sm">
                <div className="text-5xl font-bold text-blue-300/30 mb-4">01</div>
                <h3 className="text-2xl font-bold mb-4">Connect & Analyze</h3>
                <p className="text-gray-400">
                  Link your GitHub repository for comprehensive AI-powered analysis.
                </p>
              </div>
              <div className="relative z-10 p-8 bg-gray-800/30 rounded-3xl backdrop-blur-sm">
                <div className="text-5xl font-bold text-purple-300/30 mb-4">02</div>
                <h3 className="text-2xl font-bold mb-4">Match & Negotiate</h3>
                <p className="text-gray-400">
                  Our AI identifies optimal buyers and facilitates terms.
                </p>
              </div>
              <div className="relative z-10 p-8 bg-gray-800/30 rounded-3xl backdrop-blur-sm">
                <div className="text-5xl font-bold text-green-300/30 mb-4">03</div>
                <h3 className="text-2xl font-bold mb-4">Execute & Transfer</h3>
                <p className="text-gray-400">
                  Secure transaction processing with automated asset transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Final CTA Section */}
      <div className="container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl border border-gray-700/50 backdrop-blur-lg">
          <h2 className="text-4xl font-bold mb-6">Ready to Monetize Your Codebase?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the platform trusted by thousands of developers and investors worldwide.
          </p>
          <button
            onClick={handlePrimaryAction}
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
          >
            Start Free Analysis
          </button>
          <p className="text-gray-500 mt-6 text-sm">
            No credit card required • First analysis is complimentary
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">ProxyDealMaker</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              © 2024 AI-Powered Deal Execution Platform
            </p>
          </div>
          <div className="flex space-x-8 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
            <a href="mailto:contact@proxydeal.com" className="text-blue-400 hover:text-blue-300 transition">
              contact@proxydeal.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
