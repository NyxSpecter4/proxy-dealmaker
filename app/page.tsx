// app/page.tsx - COMPANY FOCUSED
'use client';

import { useState } from 'react';
import { ArrowRight, Shield, Zap, BarChart3, Users, Lock } from 'lucide-react';
import Logo from '@/app/components/Logo';

export default function CompanySplashPage() {
  const [ctaLoading, setCtaLoading] = useState(false);

  const handleEnterDashboard = () => {
    setCtaLoading(true);
    // Navigation to your dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900/20"></div>
      
      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <Logo size="default" />
          <button 
            onClick={handleEnterDashboard}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium backdrop-blur-sm transition-all"
          >
            Enter Platform
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* SINGLE CLEAR HEADLINE */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Code<span className="text-amber-400">Midas</span>
            <span className="block text-3xl md:text-4xl text-gray-300 mt-4">
              AI That Turns Code to Capital
            </span>
          </h1>

          {/* SINGLE VALUE PROPOSITION */}
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            We identify, acquire, and enhance undervalued code assets.
            <span className="block text-lg text-gray-400 mt-2">
              Proprietary AI valuation. Exclusive buyer network. Data-driven exits.
            </span>
          </p>

          {/* SINGLE PROMINENT CTA */}
          <div className="mb-20">
            <button
              onClick={handleEnterDashboard}
              disabled={ctaLoading}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl font-bold text-xl shadow-2xl shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all duration-300 inline-flex items-center"
            >
              {ctaLoading ? (
                <>
                  <span className="animate-spin mr-3">⟳</span>
                  Accessing Platform...
                </>
              ) : (
                <>
                  Access Deal Dashboard
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Exclusive access for partners and acquisition targets
            </p>
          </div>

          {/* Company Focus Points - YOUR SERVICES */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-900/50 to-transparent">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our AI Valuation</h3>
              <p className="text-gray-400 text-sm">
                Proprietary algorithms trained on $200M+ in closed software deals.
              </p>
            </div>
            
            <div className="p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-900/50 to-transparent">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exclusive Network</h3>
              <p className="text-gray-400 text-sm">
                150+ pre-vetted tech acquirers with allocated capital.
              </p>
            </div>
            
            <div className="p-6 border border-gray-800 rounded-xl bg-gradient-to-b from-gray-900/50 to-transparent">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Execution</h3>
              <p className="text-gray-400 text-sm">
                End-to-end encrypted deal rooms with AI-assisted diligence.
              </p>
            </div>
          </div>

          {/* Meet the Team Section */}
          <div className="border-t border-gray-800 pt-16">
            <h2 className="text-3xl font-bold mb-8">Meet Our AI Team</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-2xl">🤖</div>
                </div>
                <div className="font-medium">Roxy</div>
                <div className="text-sm text-gray-400">AI Investment Analyst</div>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-2xl">🧠</div>
                </div>
                <div className="font-medium">The Brain</div>
                <div className="text-sm text-gray-400">Valuation Intelligence</div>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-2xl">💼</div>
                </div>
                <div className="font-medium">DealRoom</div>
                <div className="text-sm text-gray-400">Negotiation Engine</div>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-2xl">🎤</div>
                </div>
                <div className="font-medium">BoardRoom</div>
                <div className="text-sm text-gray-400">Presentation System</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="text-center">
          <div className="mb-6">
            <Logo size="small" />
          </div>
          <div className="text-sm text-gray-500">
            © 2024 CodeMidas. Proprietary AI deal execution platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
