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
  const [expandedProject, setExpandedProject] = useState<number | null>(null)

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

  const SectionHeader = ({ title, color }: { title: string; color: string }) => (
    <div style={{ fontSize: '0.7rem', color, fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
      {title}
    </div>
  )

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
              <div key={index} style={{
                background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.5rem',
                marginBottom: '1.5rem', border: '1px solid rgba(123,47,247,0.3)'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#00d4ff' }}>{project.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#7b2ff7', background: 'rgba(123,47,247,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {project.category}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#00ff88' }}>${project.value?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.valueRange}</div>
                  </div>
                </div>

                {/* Valuation Math */}
                {project.valuation && (
                  <div style={{ background: 'rgba(0,212,255,0.1)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <SectionHeader title="VALUATION METHODOLOGY" color="#00d4ff" />
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'monospace' }}>
                      {project.valuation.calculation}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                      {project.valuation.hoursEstimate} hrs × ${project.valuation.hourlyRate}/hr × {project.valuation.marketMultiplier}x multiplier
                    </div>
                  </div>
                )}

                {/* Commercial Potential */}
                {project.commercial && (
                  <div style={{ marginBottom: '1rem' }}>
                    <SectionHeader title="COMMERCIAL POTENTIAL" color="#00ff88" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>Current State</div>
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.commercial.currentState}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>Target Customers</div>
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.commercial.targetCustomers}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>Pricing Model</div>
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.commercial.pricingModel}</div>
                      </div>
                    </div>
                    {project.commercial.revenueStreams?.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>Revenue Streams</div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                          {project.commercial.revenueStreams.map((s: string, i: number) => (
                            <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(0,255,136,0.2)', color: '#00ff88', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand/Collapse for detailed sections */}
                <button onClick={() => setExpandedProject(expandedProject === index ? null : index)} style={{
                  background: 'transparent', border: '1px solid rgba(123,47,247,0.5)', color: '#7b2ff7',
                  padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', width: '100%'
                }}>
                  {expandedProject === index ? 'Hide Details ▲' : 'Show Gaps & Roadmap ▼'}
                </button>

                {expandedProject === index && (
                  <div style={{ marginTop: '1rem' }}>
                    {/* Gaps */}
                    {project.gaps && (
                      <div style={{ marginBottom: '1rem' }}>
                        <SectionHeader title="GAPS & IMPROVEMENTS" color="#f107a3" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#666' }}>Missing Features</div>
                            {project.gaps.missingFeatures?.map((f: string, i: number) => (
                              <div key={i} style={{ fontSize: '0.8rem', color: '#ccc' }}>• {f}</div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#666' }}>Technical Debt</div>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.gaps.technicalDebt}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#666' }}>Market Position</div>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.gaps.marketPosition}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#666' }}>Competitive Moat</div>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.gaps.competitiveMoat}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Roadmap */}
                    {project.roadmap && (
                      <div style={{ marginBottom: '1rem' }}>
                        <SectionHeader title="10X ROADMAP" color="#7b2ff7" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ background: '#7b2ff7', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>1</span>
                            <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.roadmap.step1}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ background: '#7b2ff7', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>2</span>
                            <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.roadmap.step2}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ background: '#7b2ff7', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>3</span>
                            <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.roadmap.step3}</span>
                          </div>
                        </div>
                        <div style={{ marginTop: '0.75rem', background: 'rgba(123,47,247,0.1)', padding: '0.75rem', borderRadius: '6px' }}>
                          <div style={{ fontSize: '0.65rem', color: '#7b2ff7', marginBottom: '0.25rem' }}>GO-TO-MARKET</div>
                          <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.roadmap.goToMarket}</div>
                        </div>
                      </div>
                    )}

                    {/* Strengths/Weaknesses */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <SectionHeader title="STRENGTHS" color="#00ff88" />
                        {project.strengths?.map((s: string, i: number) => (
                          <div key={i} style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>+ {s}</div>
                        ))}
                      </div>
                      <div>
                        <SectionHeader title="WEAKNESSES" color="#ff4444" />
                        {project.weaknesses?.map((w: string, i: number) => (
                          <div key={i} style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>- {w}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
