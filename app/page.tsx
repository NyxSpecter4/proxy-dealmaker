'use client'

import { useState, useEffect } from 'react'

export default function MakoThothPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingLogo, setGeneratingLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    // Fetch real AI-analyzed portfolio on page load
    fetch('/api/analyze-portfolio')
      .then(r => r.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load portfolio:', err)
        setLoading(false)
      })
  }, [])

  const generateLogo = async () => {
    setGeneratingLogo(true)
    try {
      const response = await fetch('/api/generate-logo', { method: 'POST' })
      const data = await response.json()
      if (data.base64) {
        setLogoUrl(`data:image/png;base64,${data.base64}`)
      }
    } catch (error) {
      console.error('Logo generation failed:', error)
      alert('Logo generation failed')
    } finally {
      setGeneratingLogo(false)
    }
  }

  const totalValue = projects.reduce((sum, p) => sum + (p.valuation || 0), 0)
  const avgQuality = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.quality || 0), 0) / projects.length)
    : 0

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero */}
      <div className="border-b-2 border-[#6366f1] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {logoUrl ? (
            <img src={logoUrl} alt="MAKO THOTH" className="w-32 h-32 mx-auto mb-6" />
          ) : (
            <div className="w-32 h-32 mx-auto mb-6 border-2 border-[#f59e0b] rounded-lg flex items-center justify-center">
              <span className="text-[#f59e0b] text-xs">LOGO</span>
            </div>
          )}
          
          <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-[#6366f1] to-[#f59e0b] bg-clip-text text-transparent">
            MAKO THOTH
          </h1>
          <p className="text-xl text-[#f59e0b] text-center mb-2">
            Sovereign Intelligence. Divine Code Valuation.
          </p>
          <p className="text-white text-center mb-6">
            Premium Software Portfolio • AI-Valued • Available for Acquisition
          </p>
          
          <div className="text-center">
            <button
              onClick={generateLogo}
              disabled={generatingLogo}
              className="bg-black border-2 border-[#f59e0b] text-[#f59e0b] px-6 py-3 rounded-lg hover:bg-[#f59e0b] hover:text-black transition-all disabled:opacity-50"
            >
              {generatingLogo ? 'Generating...' : '⚡ Generate Logo'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-black border-b border-[#f59e0b] py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-[#f59e0b]">
              {loading ? '...' : `$${totalValue.toLocaleString()}`}
            </div>
            <div className="text-sm text-white">Total Portfolio Value</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#f59e0b]">
              {loading ? '...' : projects.length}
            </div>
            <div className="text-sm text-white">Premium Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#f59e0b]">
              {loading ? '...' : `${avgQuality}/100`}
            </div>
            <div className="text-sm text-white">Avg Quality Score</div>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">🏆 Portfolio Vault</h2>
        <p className="text-[#f59e0b] text-center mb-12">
          Elite Software Assets • AI-Analyzed • Ready for Acquisition
        </p>
        
        {loading ? (
          <div className="text-center text-white text-xl">
            <div className="animate-pulse">Analyzing portfolio with AI...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-black border-2 border-[#f59e0b] rounded-xl p-6 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-1">
                  {project.name}
                </h3>
                <p className="text-[#f59e0b] text-sm mb-4">{project.category}</p>
                
                <p className="text-white text-sm mb-4">{project.description}</p>
                
                <div className="flex gap-2 mb-4">
                  {project.tech?.map((t: string) => (
                    <span key={t} className="bg-[#0a0a0f] border border-[#f59e0b] text-[#f59e0b] px-2 py-1 rounded text-xs">
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="border-t border-[#f59e0b] pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-[#f59e0b] mb-1">AI VALUATION</div>
                      <div className="text-2xl font-bold text-white">
                        ${project.valuation?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#f59e0b] mb-1">QUALITY</div>
                      <div className="text-2xl font-bold text-white">
                        {project.quality}/100
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-[#f59e0b] mb-2">AI SALES PITCH</div>
                  <p className="text-sm text-white italic">"{project.salesPitch}"</p>
                </div>
                
                <button className="w-full bg-black border-2 border-[#f59e0b] text-[#f59e0b] py-2 rounded hover:bg-[#f59e0b] hover:text-black transition-all">
                  Request Access
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Methodology */}
      <div className="bg-black border-y-2 border-[#f59e0b] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            🔒 Proprietary AI Valuation
          </h3>
          <p className="text-white mb-2">
            Algorithmic Analysis × Market Intelligence
          </p>
          <p className="text-[#f59e0b] text-sm">Methodology: Confidential</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-[#6366f1] py-8 px-4 text-center">
        <p className="text-[#f59e0b] mb-2">MAKO THOTH</p>
        <p className="text-white text-sm">
          © 2025 • Sovereign Intelligence • Divine Code Valuation
        </p>
      </div>
    </div>
  )
}
