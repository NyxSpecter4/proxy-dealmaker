'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'
import GitHubLoginButton from '@/app/components/GitHubLoginButton'
import { Briefcase, Grid3x3, Presentation, Mic } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="animate-pulse">Loading CodeMidas...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold">CodeMidas Dashboard</h1>
      <p className="text-gray-400 mt-2">Your 24/7 autonomous negotiation agent</p>
      
      {/* Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 mt-8">
        <Link href="/dealroom" className="dashboard-card bg-gradient-to-br from-amber-900/30 to-black border border-amber-800/50 rounded-xl p-6 flex flex-col items-center justify-center hover:border-amber-600 transition-colors">
          <Briefcase className="w-8 h-8 text-amber-400 mb-2" />
          <span className="font-semibold">DealRoom</span>
          <span className="text-sm text-gray-400">Analyze & Value</span>
        </Link>
        
        <Link href="/showroom" className="dashboard-card bg-gradient-to-br from-amber-900/30 to-black border border-amber-800/50 rounded-xl p-6 flex flex-col items-center justify-center hover:border-amber-600 transition-colors">
          <Grid3x3 className="w-8 h-8 text-amber-400 mb-2" />
          <span className="font-semibold">ShowRoom</span>
          <span className="text-sm text-gray-400">Your 4 Repos</span>
        </Link>
        
        <Link href="/boardroom" className="dashboard-card bg-gradient-to-br from-amber-900/30 to-black border border-amber-800/50 rounded-xl p-6 flex flex-col items-center justify-center hover:border-amber-600 transition-colors">
          <Presentation className="w-8 h-8 text-amber-400 mb-2" />
          <span className="font-semibold">BoardRoom</span>
          <span className="text-sm text-gray-400">Roxy Pitches</span>
        </Link>
        
        <Link href="/roxy-test" className="dashboard-card bg-gradient-to-br from-amber-900/30 to-black border border-amber-800/50 rounded-xl p-6 flex flex-col items-center justify-center hover:border-amber-600 transition-colors">
          <Mic className="w-8 h-8 text-amber-400 mb-2" />
          <span className="font-semibold">Roxy Voice</span>
          <span className="text-sm text-gray-400">Test AI</span>
        </Link>
      </div>
      
      <div className="mt-8">
        {user ? (
          <div>
            <p className="text-lg">Welcome, {user.email || 'User'}!</p>
            <p className="text-gray-400 mb-4">Your GitHub is connected. Start analyzing repositories in the DealRoom.</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-lg">Connect your GitHub to start analyzing repositories.</p>
            <GitHubLoginButton />
          </div>
        )}
      </div>
    </div>
  )
}
