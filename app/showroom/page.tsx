// app/showroom/page.tsx - The Gallery: Specter9Labs Portfolio Showcase
'use client';

import Logo from '@/app/components/Logo';
import Link from 'next/link';
import PortfolioGallery from '@/app/components/PortfolioGallery';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-100">
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white flex items-center">
                ← Back to Dashboard
              </Link>
              <div className="text-sm px-3 py-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 border border-purple-800/50 rounded-full">
                The Portfolio • Acquisition Gallery
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-12 text-center">
            <h1 className="text-5xl font-bold mb-4">
              Specter9Labs <span className="text-purple-500">Portfolio Gallery</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Curated AI software assets available for acquisition. Each product is production-ready, 
              revenue-validated, and includes full technical handover.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-800 transition">
                <div className="text-3xl font-bold text-green-400 mb-2">3</div>
                <div className="text-sm text-gray-400">Available Products</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-blue-800 transition">
                <div className="text-3xl font-bold text-blue-400 mb-2">$280K+</div>
                <div className="text-sm text-gray-400">Total Portfolio Value</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-yellow-800 transition">
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-sm text-gray-400">Code Ownership</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-purple-800 transition">
                <div className="text-3xl font-bold text-purple-400 mb-2">4</div>
                <div className="text-sm text-gray-400">Active Buyer Conversations</div>
              </div>
            </div>
          </section>

          {/* Portfolio Gallery Component */}
          <PortfolioGallery />

          {/* Acquisition Process */}
          <section className="py-12 mt-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold text-center mb-8">How Acquisition Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <div className="text-2xl font-bold text-purple-400 mb-4">1. Due Diligence</div>
                <p className="text-gray-400">
                  Full access to codebase, architecture documentation, and technical walkthrough.
                  Includes 30-day post-acquisition support.
                </p>
              </div>
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <div className="text-2xl font-bold text-blue-400 mb-4">2. Live Demo</div>
                <p className="text-gray-400">
                  Interactive product demonstration with our AI agent Roxy.
                  See the software in action with real data.
                </p>
              </div>
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-400 mb-4">3. Handover</div>
                <p className="text-gray-400">
                  Complete technical transfer including deployment scripts,
                  environment setup, and team training.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="text-center py-16">
            <h3 className="text-3xl font-bold mb-4">Ready to Acquire AI Software Assets?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join other forward-thinking investors and companies who are acquiring 
              production-ready AI solutions from the Specter9Labs portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition font-medium"
              >
                Schedule Private Demo
              </Link>
              <button
                onClick={() => alert('Contact: acquisitions@specter9labs.com')}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition font-medium"
              >
                Request Due Diligence Package
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>Specter9Labs • AI Software Acquisition Portfolio</p>
          <p className="mt-2">Production-ready AI solutions • Full technical handover • Post-acquisition support</p>
          <p className="mt-4 text-gray-600">© 2024 Specter9Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
