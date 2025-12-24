'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [logoUrl] = useState('/mako-thoth-logo.png')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [slogan, setSlogan] = useState('AI-Powered Code Acquisition Intelligence')
  const [description, setDescription] = useState('')
  const [generatingBrand, setGeneratingBrand] = useState(false)

  useEffect(() => {
    loadAnalysis()
    loadCompanyInfo()
  }, [])

  async function loadAnalysis() {
    setLoading(true)
    try {
      const res = await fetch('/api/analyze-portfolio')
      const data = await res.json()
      setAnalysis(data)
    } catch {
      setAnalysis({ error: 'Failed to load' })
    }
    setLoading(false)
  }

  async function loadCompanyInfo() {
    try {
      const res = await fetch('/api/generate-company-info')
      const data = await res.json()
      if (data.slogan) setSlogan(data.slogan)
      if (data.description) setDescription(data.description)
    } catch {}
  }

  async function generateBranding() {
    setGeneratingBrand(true)
    try {
      const res = await fetch('/api/generate-company-info', { method: 'POST' })
      const data = await res.json()
      if (data.slogan) setSlogan(data.slogan)
      if (data.description) setDescription(data.description)
    } catch {}
    setGeneratingBrand(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1e 100%)',
      color: '#fff',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <Image src={logoUrl} alt="MAKO THOTH" width={240} height={240} style={{ borderRadius: '12px' }} />
      </div>

      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: '900',
        margin: '0 0 0.5rem',
        background: 'linear-gradient(45deg, #00d4ff, #7b2ff7, #f107a3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        MAKO THOTH
      </h1>

      <p style={{ fontSize: '1.3rem', color: '#00d4ff', margin: '0 0 0.5rem', fontWeight: '600', textAlign: 'center' }}>
        {slogan}
      </p>

      {description && (
        <p style={{ fontSize: '1rem', color: '#888', margin: '0 0 1.5rem', textAlign: 'center', maxWidth: '600px', lineHeight: '1.5' }}>
          {description}
        </p>
      )}

      <button onClick={generateBranding} disabled={generatingBrand} style={{
        background: 'linear-gradient(45deg, #7b2ff7, #f107a3)',
        color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px',
        fontSize: '0.9rem', fontWeight: '600', cursor: generatingBrand ? 'not-allowed' : 'pointer',
        marginBottom: '2rem', opacity: generatingBrand ? 0.7 : 1
      }}>
        {generatingBrand ? 'Generating...' : 'Generate AI Branding'}
      </button>

      <div style={{
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,212,255,0.3)', borderRadius: '20px',
        padding: '2rem', maxWidth: '1000px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,212,255,0.2)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#00d4ff' }}>
            AI Analyzing GitHub Portfolio...
          </div>
        ) : analysis?.error ? (
          <div style={{ textAlign: 'center', color: '#ff4444' }}>{analysis.error}</div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#00d4ff' }}>
                ${analysis?.totalValue?.toLocaleString() || '---'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>Total Portfolio Valuation</div>
              {analysis?.portfolioSummary && (
                <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0', lineHeight: '1.5' }}>
                  {analysis.portfolioSummary}
                </div>
              )}
            </div>

            {analysis?.projects?.map((project: any, index: number) => (
              <div key={project.name || index} style={{
                background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.5rem',
                marginBottom: '1.5rem', border: '1px solid rgba(123,47,247,0.3)'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#00d4ff' }}>{project.name}</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#00ff88' }}>
                    ${project.value?.toLocaleString()}
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {project.description}
                </p>

                {/* Market Reality */}
                <div style={{ background: 'rgba(0,212,255,0.1)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#00d4ff', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    MARKET REALITY
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                    {project.marketReality}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#00ff88', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      STRENGTHS
                    </div>
                    {project.strengths?.map((s: string, i: number) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>+ {s}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#ff4444', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      WEAKNESSES
                    </div>
                    {project.weaknesses?.map((w: string, i: number) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>- {w}</div>
                    ))}
                  </div>
                </div>

                {/* Competition */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#f107a3', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    COMPETITION
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                    {project.competition}
                  </div>
                </div>

                {/* Pivot Idea */}
                {project.pivotIdea && (
                  <div style={{ background: 'rgba(123,47,247,0.1)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7b2ff7', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      PIVOT IDEA
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fff' }}>
                      {project.pivotIdea}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#00d4ff', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    NEXT STEPS
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {project.nextSteps?.map((step: string, i: number) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#555', textAlign: 'center' }}>
        2025 MAKO THOTH - AI-Powered Software Acquisitions
      </div>
    </div>
  )
}
