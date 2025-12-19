import PortfolioGallery from '@/app/components/PortfolioGallery'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Specter<span className="text-purple-500">9</span>Labs</div>
          <Link href="/showroom" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-lg font-medium transition">
            View Full Portfolio
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          AI Software Assets
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Ready for Acquisition</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-3xl mx-auto mb-10">
          Specter9Labs develops production-ready AI products. We build, validate, and prepare them for enterprise acquisition.
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">3</div>
            <div className="text-sm text-gray-400">Live Products</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">$280K+</div>
            <div className="text-sm text-gray-400">Portfolio Value</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-sm text-gray-400">Code Ownership</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">AI</div>
            <div className="text-sm text-gray-400">Powered Deals</div>
          </div>
        </div>

        {/* Featured Product Teaser */}
        <div className="max-w-3xl mx-auto mb-20 p-8 border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900/30 to-black/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <span className="text-gray-400">Featured Asset</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Proxy DealMaker</h2>
          <p className="text-gray-300 mb-6">
            Autonomous AI that values software and negotiates deals. Includes Roxy AI Pitch Agent for live investor presentations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/showroom" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-lg font-bold text-lg transition"
            >
              View All Assets
            </Link>
            <button className="border border-gray-700 hover:bg-gray-800/50 px-8 py-3 rounded-lg font-bold text-lg transition">
              Request Investor Brief
            </button>
          </div>
        </div>
      </main>

      {/* Portfolio Gallery Preview */}
      <section className="container mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">AI Assets</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Production-ready software with full technical documentation and transition support.
          </p>
        </div>
        
        {/* Include the PortfolioGallery component */}
        <PortfolioGallery />
      </section>

      {/* Final CTA */}
      <div className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Acquire AI Technology?</h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Gain exclusive access to technical due diligence, live product demos, and direct negotiation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/showroom" 
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 px-8 py-3 rounded-lg font-bold transition"
            >
              Browse Full Portfolio
            </Link>
            <button className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-lg font-bold transition">
              Schedule AI Demo
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            Verified investors & accredited buyers only
          </p>
        </div>
      </div>
    </div>
  )
}
