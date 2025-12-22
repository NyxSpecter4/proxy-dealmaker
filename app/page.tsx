'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingLogo, setGeneratingLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/analyze-portfolio')
      .then(r => r.json())
      .then(data => {
        if (data.projects) setProjects(data.projects)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const generateLogo = async () => {
    setGeneratingLogo(true)
    try {
      const res = await fetch('/api/generate-logo', { method: 'POST' })
      const data = await res.json()
      if (data.base64) setLogoUrl(`data:image/png;base64,${data.base64}`)
    } finally {
      setGeneratingLogo(false)
    }
  }

  const total = projects.reduce((s, p) => s + (p.valuation || 0), 0)
  const avgQuality = projects.length ? Math.round(projects.reduce((s, p) => s + (p.quality || 0), 0) / projects.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0520] to-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <div className="border-b-2 border-[#6366f1] shadow-[0_0_50px_rgba(99,102,241,0.5)] py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-40 h-40 mx-auto mb-8 drop-shadow-[0_0_25px_rgba(245,158,11,1)]" />
            ) : (
              <div className="w-40 h-40 mx-auto mb-8 border-4 border-[#f59e0b] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-pulse">
                <span className="text-[#f59e0b] text-2xl font-bold">MT</span>
              </div>
            )}
            
            <h1 className="text-7xl md:text-8xl font-black text-center mb-6 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]">
              MAKO THOTH
            </h1>
            <p className="text-2xl md:text-3xl text-[#f59e0b] text-center mb-3 font-bold tracking-wide">
              Sovereign Intelligence. Divine Code Valuation.
            </p>
            <p className="text-lg text-white/80 text-center mb-10 max-w-3xl mx-auto">
              Elite Software Portfolio • AI-Powered Valuations • Exclusive Acquisition Opportunities
            </p>
            
            <div className="text-center">
              <button
                onClick={generateLogo}
                disabled={generatingLogo}
                className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_40px_rgba(99,102,241,0.8)] transition-all disabled:opacity-50 transform hover:scale-105"
              >
                {generatingLogo ? '✨ Creating Legendary Logo...' : '⚡ Generate Divine Logo'}
              </button>
            </div>
          </div>
        </div>

        {/* Epic Stats */}
        <div className="bg-black/40 backdrop-blur-xl border-y border-[#f59e0b]/30 py-8 px-4 shadow-[0_0_60px_rgba(245,158,11,0.3)]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/10 to-transparent border border-[#6366f1]/30">
              <div className="text-5xl font-black bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
                {loading ? '...' : `$${total.toLocaleString()}`}
              </div>
              <div className="text-sm text-white/70 font-semibold tracking-widest uppercase">Total Portfolio Value</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/10 to-transparent border border-[#8b5cf6]/30">
              <div className="text-5xl font-black bg-gradient-to-r from-[#8b5cf6] to-[#f59e0b] bg-clip-text text-transparent mb-2">
                {loading ? '...' : projects.length}
              </div>
              <div className="text-sm text-white/70 font-semibold tracking-widest uppercase">Elite Projects</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#f59e0b]/10 to-transparent border border-[#f59e0b]/30">
              <div className="text-5xl font-black bg-gradient-to-r from-[#f59e0b] to-[#fb923c] bg-clip-text text-transparent mb-2">
                {loading ? '...' : `${avgQuality}/100`}
              </div>
              <div className="text-sm text-white/70 font-semibold tracking-widest uppercase">Average Quality</div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              🏆 The Vault
            </h2>
            <p className="text-xl text-[#f59e0b] font-semibold">
              AI-Analyzed • Enterprise-Grade • Investment-Ready
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#6366f1] mb-6"></div>
              <p className="text-2xl text-white/80 font-bold">AI Analyzing Portfolio...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="group bg-black/60 backdrop-blur-xl border-2 border-[#6366f1]/30 rounded-3xl p-8 hover:border-[#f59e0b] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-3xl font-black text-white group-hover:text-[#f59e0b] transition-colors">{p.name}</h3>
                    <div className="text-right">
                      <div className="text-sm text-[#6366f1] font-bold mb-1">QUALITY</div>
                      <div className="text-3xl font-black text-white">{p.quality}/100</div>
                    </div>
                  </div>
                  
                  <p className="text-[#8b5cf6] text-sm font-bold mb-4 uppercase tracking-wide">{p.category}</p>
                  <p className="text-white/80 text-base mb-6 leading-relaxed">{p.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tech?.map((t: string) => (
                      <span key={t} className="bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1] text-[#6366f1] px-3 py-1 rounded-full text-sm font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-[#6366f1]/30 pt-6 mb-6">
                    <div className="mb-2">
                      <div className="text-xs text-[#f59e0b] font-bold mb-1 tracking-widest">AI VALUATION</div>
                      <div className="text-4xl font-black bg-gradient-to-r from-[#f59e0b] to-[#fb923c] bg-clip-text text-transparent">
                        ${p.valuation?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-xs text-[#8b5cf6] font-bold mb-3 tracking-widest">AI SALES PITCH</div>
                    <p className="text-white/90 text-sm italic leading-relaxed border-l-4 border-[#8b5cf6] pl-4">
                      "{p.salesPitch}"
                    </p>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all transform hover:scale-105">
                    Request Exclusive Access
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Methodology */}
        <div className="bg-black/60 backdrop-blur-xl border-y-2 border-[#f59e0b]/30 py-16 px-4 shadow-[0_0_80px_rgba(245,158,11,0.3)]">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-black text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              🔒 Proprietary AI Valuation Engine
            </h3>
            <p className="text-xl text-white/80 mb-3 font-semibold">
              Advanced Algorithmic Analysis × Real-Time Market Intelligence
            </p>
            <p className="text-[#f59e0b] text-sm font-bold tracking-widest uppercase">
              Methodology: Classified
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#6366f1] py-12 px-4 text-center bg-black/40 backdrop-blur-xl">
          <p className="text-2xl font-black bg-gradient-to-r from-[#6366f1] to-[#f59e0b] bg-clip-text text-transparent mb-3">
            MAKO THOTH
          </p>
          <p className="text-white/60 text-sm font-semibold">
            © 2025 • Sovereign Intelligence • Divine Code Valuation • Elite Software Assets
          </p>
        </div>
      </div>
    </div>
  )
}
