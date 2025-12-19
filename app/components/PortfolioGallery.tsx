import React from 'react'

interface Product {
  id: number
  name: string
  tagline: string
  category: 'AI Agent' | 'SaaS Platform' | 'Developer Tool' | 'Enterprise Solution'
  status: 'Available for Acquisition' | 'Exclusive Preview' | 'In Development'
  tech: string[]
  valuation: {
    price: string  // e.g., "$45-65K"
    timeframe: string  // e.g., "30-day close"
  }
  keyFeature: string  // The ONE killer feature
  buyerProfile: string[]  // e.g., ["VC-backed startups", "Tech incubators"]
  demoReady: boolean
}

const SPECTER9LABS_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Proxy DealMaker',
    tagline: 'Autonomous AI that values & negotiates software deals',
    category: 'AI Agent',
    status: 'Available for Acquisition',
    tech: ['Next.js 14', 'TypeScript', 'OpenAI', 'Supabase'],
    valuation: {
      price: '$85-120K',
      timeframe: '60-day transition'
    },
    keyFeature: 'Roxy AI Pitch Agent - runs live sales presentations',
    buyerProfile: ['VC firms', 'M&A platforms', 'Enterprise SaaS companies'],
    demoReady: true
  },
  {
    id: 2,
    name: 'Specter9Labs Engine',
    tagline: 'AI-powered GitHub valuation & investment thesis generator',
    category: 'SaaS Platform',
    status: 'Exclusive Preview',
    tech: ['Node.js', 'PostgreSQL', 'GitHub API', 'OpenAI GPT-4'],
    valuation: {
      price: '$150-220K',
      timeframe: '90-day enterprise handover'
    },
    keyFeature: 'Generates investor-ready deal memos in 60 seconds',
    buyerProfile: ['Investment banks', 'Private equity', 'Tech accelerators'],
    demoReady: true
  },
  {
    id: 3,
    name: 'Roxy AI Secretary',
    tagline: '24/7 autonomous property management AI (from RWS-CC)',
    category: 'Enterprise Solution',
    status: 'Available for Acquisition',
    tech: ['React', 'Python', 'Twilio API', 'Stripe'],
    valuation: {
      price: '$45-65K',
      timeframe: '45-day integration'
    },
    keyFeature: 'Reduces property manager workload by 70%',
    buyerProfile: ['PropTech companies', 'Real estate funds', 'Facility management SaaS'],
    demoReady: true
  }
]

const StatusBadge = ({ status }: { status: Product['status'] }) => {
  const colors = {
    'Available for Acquisition': 'bg-green-900/40 text-green-300 border-green-700',
    'Exclusive Preview': 'bg-purple-900/40 text-purple-300 border-purple-700',
    'In Development': 'bg-blue-900/40 text-blue-300 border-blue-700'
  }
  return (
    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${colors[status]}`}>
      {status}
    </span>
  )
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-black border border-gray-800 rounded-2xl p-6 hover:border-purple-800 transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-400">{product.category}</span>
          </div>
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="text-gray-400 mt-1">{product.tagline}</p>
        </div>
        <StatusBadge status={product.status} />
      </div>

      {/* Tech Stack */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">Technology</div>
        <div className="flex flex-wrap gap-2">
          {product.tech.map((tech) => (
            <span key={tech} className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1.5 rounded-lg">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Key Feature Highlight */}
      <div className="mb-4 p-4 bg-gray-900/40 rounded-xl border border-gray-800">
        <div className="text-sm text-gray-500 mb-1">Key Value Proposition</div>
        <div className="text-white">{product.keyFeature}</div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Acquisition Price</div>
            <div className="text-xl font-bold text-green-400">{product.valuation.price}</div>
            <div className="text-xs text-gray-400">{product.valuation.timeframe}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Target Buyer</div>
            <div className="text-sm">
              {product.buyerProfile.map((profile, idx) => (
                <div key={idx} className="text-gray-300">{profile}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 border border-gray-700 py-3 rounded-lg font-medium transition-all duration-300 group-hover:border-purple-700">
          <div className="flex items-center justify-center gap-2">
            <span>Request Private Pitch Deck</span>
            {product.demoReady && (
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded">Live Demo Ready</span>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

export default function PortfolioGallery() {
  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Specter9Labs</span> Portfolio
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Curated AI software assets available for acquisition. Each product is production-ready, revenue-validated, and includes full technical handover.
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-sm text-gray-400 mt-1">Available Products</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">$280K+</div>
          <div className="text-sm text-gray-400 mt-1">Total Portfolio Value</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">100%</div>
          <div className="text-sm text-gray-400 mt-1">Code Ownership</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">4</div>
          <div className="text-sm text-gray-400 mt-1">Active Buyer Conversations</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPECTER9LABS_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* CTA - For BUYERS, not repo analyzers */}
      <div className="text-center mt-16 p-8 border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900/30 to-black/30">
        <h3 className="text-2xl font-bold mb-2">Interested in Acquiring AI Software Assets?</h3>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Gain exclusive access to technical due diligence, live product demos, and direct negotiation with our AI deal agent.
        </p>
        <button className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-lg font-medium text-lg transition">
          Request Portfolio Access
        </button>
        <p className="text-gray-600 text-sm mt-4">
          Verified investors & accredited buyers only
        </p>
      </div>
    </section>
  )
}