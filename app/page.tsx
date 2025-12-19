// app/page.tsx - CodeMidas: Your Software Company
'use client';

import { useState } from 'react';
import { ArrowRight, Cpu, Sparkles, Shield, Zap, Code } from 'lucide-react';
import Logo from '@/app/components/Logo';

export default function CodeMidasSplashPage() {
  const [ctaLoading, setCtaLoading] = useState(false);

  const handleEnterPlatform = () => {
    setCtaLoading(true);
    window.location.href = '/dashboard';
  };

  // YOUR ACTUAL PRODUCTS
  const yourProducts = [
    {
      name: 'ProxyDealMaker',
      description: 'AI agent that analyzes, values, and negotiates software deals',
      icon: <Cpu className="w-8 h-8" />,
      status: 'Active',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Redwood Command Center',
      description: 'Command & control platform for enterprise operations',
      icon: <Shield className="w-8 h-8" />,
      status: 'Active',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'BountyWarz',
      description: 'Bounty-based competition and reward platform',
      icon: <Zap className="w-8 h-8" />,
      status: 'Active',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Camel Racing',
      description: 'Simulation and analytics platform for racing systems',
      icon: <Sparkles className="w-8 h-8" />,
      status: 'In Development',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <Logo />
          <button
            onClick={handleEnterPlatform}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium backdrop-blur-sm transition-all"
          >
            Enter Platform
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Company Headline */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-amber-400">Code</span>Midas
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              AI-Enhanced Software Assets
            </p>
            
            {/* Single CTA */}
            <button
              onClick={handleEnterPlatform}
              disabled={ctaLoading}
              className="px-12 py-5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 rounded-xl font-bold text-xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 inline-flex items-center"
            >
              {ctaLoading ? (
                <>
                  <span className="animate-spin mr-3">⟳</span>
                  Entering...
                </>
              ) : (
                <>
                  View Our Software Portfolio
                  <ArrowRight className="ml-3 w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* YOUR ACTUAL PRODUCTS */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our AI-Enhanced Software Portfolio
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {yourProducts.map((product, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${product.color}/10 to-transparent border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors`}
                >
                  <div className="flex items-start mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center mr-4`}>
                      {product.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold">{product.name}</h3>
                        <span className="text-sm px-3 py-1 bg-gray-800/50 rounded-full">
                          {product.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-2">{product.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>AI Valuation Ready</span>
                    <span>Available for Acquisition</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Makes Us Different - NO FLUFF */}
          <div className="border-t border-gray-800 pt-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              The CodeMidas Process
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Code className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Build</h3>
                <p className="text-gray-400">
                  We develop proprietary software with embedded AI capabilities.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Enhance</h3>
                <p className="text-gray-400">
                  Our AI systems continuously improve and value our own code.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Present</h3>
                <p className="text-gray-400">
                  Roxy AI delivers data-driven pitches to qualified acquirers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="text-center">
          <div className="mb-6">
            <Logo />
            <p className="text-gray-500 text-sm mt-2">
              Transforming our own code into capital
            </p>
          </div>
          <div className="text-sm text-gray-600">
            © 2024 CodeMidas. Our software. Our AI. Our value.
          </div>
        </div>
      </footer>
    </div>
  );
}
