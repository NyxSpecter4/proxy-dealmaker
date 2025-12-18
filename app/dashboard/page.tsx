'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import GitHubLoginButton from '@/app/components/GitHubLoginButton'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="animate-pulse">Loading DealMaker...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold">DealMaker Proxy Dashboard</h1>
      <p className="text-gray-400 mt-2">Your 24/7 autonomous negotiation agent</p>
      
      <div className="mt-8">
        {user ? (
          <div>
            <p>Welcome, {user.email || 'User'}!</p>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Connect your GitHub to start analyzing repositories.</p>
            <GitHubLoginButton />
          </div>
        )}
      </div>
    </div>
  )
}
