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
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <Image src={logoUrl} alt="MAKO THOTH" width={120} height={120} style={{ borderRadius: '12px' }} />
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
      
      <p style={{ 
        fontSize: '1.3rem', 
        color: '#00d4ff', 
        margin: '0 0 0.5rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        {slogan}
      </p>

      {description && (
        <p style={{ 
          fontSize: '1rem', 
          color: '#888', 
          margin: '0 0 1.5rem',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      )}

      <button 
        onClick={generateBranding}
        disabled={generatingBrand}
        style={{
          background: 'linear-gradient(45deg, #7b2ff7, #f107a3)',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: generatingBrand ? 'not-allowed' : 'pointer',
          marginBottom: '2rem',
          opacity: generatingBrand ? 0.7 : 1
        }}
      >
        {generatingBrand ? 'Generating...' : 'Generate AI Branding'}
      </button>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,212,255,0.3)',
        borderRadius: '20px',
        padding: '2rem 3rem',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,212,255,0.2)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#00d4ff' }}>
            AI Analyzing GitHub Portfolio...
          </div>
        ) : analysis?.error ? (
          <div style={{ textAlign: 'center', color: '#ff4444' }}>
            {analysis.error}
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#00d4ff' }}>
                ${analysis?.totalValue?.toLocaleString() || '---'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                Total Portfolio Valuation
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Tech Stack Value</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7b2ff7' }}>
                  {analysis?.techStackRating || '---'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Market Position</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f107a3' }}>
                  {analysis?.marketPosition || '---'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Acquisition Potential</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00d4ff' }}>
                  {analysis?.acquisitionPotential || '---'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Revenue Potential</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ff88' }}>
                  {analysis?.revenuePotential || '---'}
                </div>
              </div>
            </div>

            {analysis?.portfolioAnalysis && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#ccc'
              }}>
                {analysis.portfolioAnalysis}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        fontSize: '0.8rem', 
        color: '#555',
        textAlign: 'center'
      }}>
        2025 MAKO THOTH - AI-Powered Software Acquisitions
      </div>
    </div>
  )
}
