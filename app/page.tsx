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
  
  useEffect(() => {
    fetch('/api/analyze-portfolio').then(r => r.json()).then(data => { setProjects(data.projects || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '100px 20px', borderBottom: '2px solid #f59e0b' }}>
        <MakoThothLogo />
        <p style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sovereign Intelligence • Divine Code Valuation</p>
        <p style={{ color: '#ffffff', opacity: 0.6, marginTop: '10px' }}>PRIVATE ASSET VAULT • OWNER: NYXSPECTER4</p>
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
      <div style={{ padding: '60px', textAlign: 'center', borderTop: '1px solid #333', opacity: 0.5, fontSize: '0.8rem' }}>© 2025 MAKO THOTH • ALL INTELLIGENCE RESERVED</div>
    </div>
  )
}
