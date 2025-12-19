import { Metadata } from 'next'
import YourProjects from '@/app/components/YourProjects'

export const metadata: Metadata = {
  title: 'Specter9Labs | AI Software Acquisition Platform',
  description: 'Production-ready AI assets available for acquisition. Live video demonstrations.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            Specter<span className="text-purple-500">9</span>Labs
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-green-400">●</span> Live Demos Every 10 Minutes
          </div>
        </div>
      </nav>

      {/* Hero: Video Player + Sales Pitch */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Video Player */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">LIVE DEMO</span>
                  <span className="text-xs text-gray-400 ml-auto">Next demo in: 8:32</span>
                </div>
              </div>
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">▶</div>
                  <p className="text-gray-400">AI Pitch Demonstration</p>
                  <p className="text-sm text-gray-600 mt-2">Auto-plays every 10 minutes</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-900/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Currently showing:</span>
                  <span className="font-medium">Proxy DealMaker - Autonomous Negotiation</span>
                </div>
              </div>
            </div>

            {/* Demo Schedule */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold mb-2">Demo Schedule</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Proxy DealMaker</span>
                  <span className="text-green-400">LIVE NOW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Specter9Labs Engine</span>
                  <span className="text-gray-400">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">AI Property Secretary</span>
                  <span className="text-gray-400">10:40 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sales Pitch & Assets */}
          <div className="space-y-6">
            {/* Company Pitch */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI Software Assets
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Ready for Acquisition
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                We develop production-ready AI products, validate them in market, 
                and prepare complete technical packages for enterprise acquisition.
              </p>
            </div>

            {/* Acquisition Assets - ALL ON ONE PAGE */}
            <div className="space-y-4">
              {/* Asset 1 */}
              <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Available</span>
                    </div>
                    <h3 className="text-2xl font-bold">Proxy DealMaker</h3>
                  </div>
                  <span className="text-2xl font-bold text-green-400">$85-120K</span>
                </div>
                <p className="text-gray-300 mb-4">
                  Autonomous AI that values software repositories and facilitates deal negotiation.
                  Complete with pitch presentation system.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Next.js 14', 'TypeScript', 'OpenAI', 'Supabase'].map((tech) => (
                    <span key={tech} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 py-3 rounded-lg font-medium transition">
                  Request Technical Due Diligence
                </button>
              </div>

              {/* Asset 2 */}
              <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Available</span>
                    </div>
                    <h3 className="text-2xl font-bold">Specter9Labs Engine</h3>
                  </div>
                  <span className="text-2xl font-bold text-green-400">$150-220K</span>
                </div>
                <p className="text-gray-300 mb-4">
                  AI-powered GitHub analysis system that generates investment theses 
                  and valuation models from codebases.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Node.js', 'PostgreSQL', 'GitHub API', 'GPT-4'].map((tech) => (
                    <span key={tech} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 py-3 rounded-lg font-medium transition">
                  Request Technical Due Diligence
                </button>
              </div>

              {/* Asset 3 */}
              <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Available</span>
                    </div>
                    <h3 className="text-2xl font-bold">AI Property Secretary</h3>
                  </div>
                  <span className="text-2xl font-bold text-green-400">$45-65K</span>
                </div>
                <p className="text-gray-300 mb-4">
                  24/7 autonomous property management system with AI tenant communication,
                  maintenance scheduling, and financial reporting.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['React', 'Python', 'Twilio API', 'Stripe'].map((tech) => (
                    <span key={tech} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 py-3 rounded-lg font-medium transition">
                  Request Technical Due Diligence
                </button>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-800 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-gray-400">Available Assets</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">$280K+</div>
                  <div className="text-sm text-gray-400">Total Portfolio Value</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-gray-400">Code Ownership</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm text-gray-400">Active Buyer Conversations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <YourProjects />

        {/* Final CTA - Bottom of Page */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Acquire AI Technology?</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Complete acquisition packages include source code, technical documentation, 
            database schemas, and 60-day transition support.
          </p>
          <button className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 px-10 py-4 rounded-lg font-bold text-lg transition">
            Request Full Portfolio Access
          </button>
          <p className="text-gray-600 text-sm mt-4">
            Verified investors & accredited buyers only • NDA required for technical details
          </p>
        </div>
      </main>
    </div>
  )
}
