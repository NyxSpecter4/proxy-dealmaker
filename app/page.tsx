import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Proxy<span className="text-blue-500">DealMaker</span></div>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Your 24/7
          <span className="block text-blue-400">AI Co-Founder</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-3xl mx-auto">
          It finds buyers, negotiates deals, and secures letters of intent for your software projects—autonomously.
        </p>
        <div className="mt-10">
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 rounded-xl text-xl font-bold inline-block mr-4"
          >
            Connect GitHub & Activate Agent
          </Link>
          <button className="border border-gray-700 hover:bg-gray-800 px-10 py-4 rounded-xl text-xl font-bold">
            See Live Deal Simulation
          </button>
        </div>
        <div className="mt-20 border border-gray-800 rounded-2xl p-2 inline-block bg-gray-900/50">
          {/* Placeholder for terminal animation */}
          <div className="font-mono text-left p-4 text-sm">
            <p><span className="text-green-400">$</span> dealmaker analyze --repo nyxspecter4/proxy-dealmaker</p>
            <p className="text-blue-300">{'>'} Analyzing codebase... Found 12,500 LOC. Tech stack: Next.js 14, TypeScript, Supabase.</p>
            <p className="text-blue-300">{'>'} Calculating market valuation... <span className="text-yellow-300">$18,500 - $24,000</span></p>
            <p className="text-green-300">{'>'} ✓ Deal pipeline activated. 3 potential buyers identified.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
// Force rebuild Fri Dec 19 12:36:47 AM UTC 2025
