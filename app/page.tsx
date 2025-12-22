'use client'
import { useState, useEffect } from 'react'
import MakoThothLogo from '@/components/MakoThothLogo'

type Project = {
  name: string
  val: number
  hrs: number
  desc: string
  pitch: string
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [tagline1, setTagline1] = useState('Software Portfolio')
  const [tagline2, setTagline2] = useState('')
  const [footer, setFooter] = useState('© 2025 MAKO THOTH')
  const [generatingLogo, setGeneratingLogo] = useState(false)
  const [logoUrl, setLogoUrl] = useState('/mako-thoth-logo.png')

  const generateLogo = async () => {
    setGeneratingLogo(true)
    try {
      const res = await fetch('/api/generate-logo', { method: 'POST' })
      const data = await res.json()
      if (data.base64) {
        setLogoUrl(`data:image/png;base64,${data.base64}`)
      }
    } catch (error) {
      console.error('Logo generation failed:', error)
    } finally {
      setGeneratingLogo(false)
    }
  }

  useEffect(() => {
    // Fetch AI-generated copy
    fetch('/api/generate-copy').then(r => r.json()).then(data => {
      if (data.tagline1) setTagline1(data.tagline1)
      if (data.tagline2) setTagline2(data.tagline2)
      if (data.footer) setFooter(data.footer)
    }).catch(() => {})
    
    // Fetch portfolio
    fetch('/api/analyze-portfolio').then(r => r.json()).then(data => {
      setProjects(data.projects || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '100px 20px', borderBottom: '2px solid #f59e0b' }}>
        <img src={logoUrl} alt="MAKO THOTH" className="w-48 h-48 mx-auto mb-8 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,1)]" />
        <p style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{tagline1}</p>
        {tagline2 && <p style={{ color: '#ffffff', opacity: 0.6, marginTop: '10px' }}>{tagline2}</p>}
        
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={generateLogo}
            disabled={generatingLogo}
            style={{
              background: 'linear-gradient(to right, #f59e0b, #fb923c)',
              color: 'black',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '900',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
              transition: 'all 0.3s',
              transform: 'scale(1)',
              cursor: generatingLogo ? 'not-allowed' : 'pointer',
              opacity: generatingLogo ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!generatingLogo) {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(245, 158, 11, 1)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {generatingLogo ? '🔥 Creating Logo...' : '⚡ Generate AI Logo'}
          </button>
        </div>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: '60px' }}>THE VAULT</h2>
        {loading ? <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>AI Analyzing Portfolio...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {projects.map((p) => (
              <div key={p.name} style={{ backgroundColor: '#000000', border: '2px solid #f59e0b', padding: '40px', borderRadius: '20px', boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)' }}>
                <h3 style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '10px' }}>{p.name}</h3>
                <p style={{ color: '#ffffff', marginBottom: '20px', opacity: 0.8 }}>{p.desc}</p>
                <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold' }}>AI VALUATION</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>${p.val?.toLocaleString()}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{p.hrs} Hours @ $125/hr</div>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#ccc', borderLeft: '3px solid #f59e0b', paddingLeft: '15px' }}>"{p.pitch}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '60px', textAlign: 'center', borderTop: '1px solid #333', opacity: 0.5, fontSize: '0.8rem' }}>{footer}</div>
    </div>
  )
}
