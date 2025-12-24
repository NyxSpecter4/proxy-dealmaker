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
                {/* Header with name */}
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.4rem', color: '#00d4ff' }}>{project.name}</h3>

                {/* Value Comparison */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,68,68,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#ff4444', fontWeight: '700', letterSpacing: '0.05em' }}>CURRENT VALUE</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ff4444' }}>${project.realisticValue?.toLocaleString() || '0'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,255,136,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#00ff88', fontWeight: '700', letterSpacing: '0.05em' }}>POTENTIAL (IF EXECUTED)</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#00ff88' }}>${project.optimisticValue?.toLocaleString() || '0'}</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {project.description}
                </p>

                {/* Stage */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#7b2ff7', background: 'rgba(123,47,247,0.2)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: '600' }}>
                    Stage: {project.stage}
                  </span>
                </div>

                {/* Valuation Gaps */}
                {project.valuationGaps?.length > 0 && (
                  <div style={{ background: 'rgba(255,68,68,0.1)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid rgba(255,68,68,0.2)' }}>
                    <SectionHeader title="⚠️ VALUATION GAPS" color="#ff4444" />
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {project.valuationGaps.map((gap: string, i: number) => (
                        <li key={i} style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Industry Reality */}
                {project.industryReality && (
                  <div style={{ background: 'rgba(0,212,255,0.1)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <SectionHeader title="INDUSTRY REALITY" color="#00d4ff" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                      <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Sector:</span> <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{project.industryReality.sector}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Failure Rate:</span> <span style={{ color: '#ff4444', fontSize: '0.85rem' }}>{project.industryReality.failureRate}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Key Metric:</span> <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{project.industryReality.keyMetric}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Current:</span> <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{project.industryReality.currentMetric}</span></div>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}><span style={{ color: '#666', fontSize: '0.75rem' }}>Competition:</span> <span style={{ color: '#f107a3', fontSize: '0.85rem' }}>{project.industryReality.competition}</span></div>
                  </div>
                )}

                {/* Scorecard Assessment */}
                {project.scorecardAssessment && (
                  <div style={{ marginBottom: '1rem' }}>
                    <SectionHeader title="SCORECARD ASSESSMENT" color="#7b2ff7" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', background: 'rgba(123,47,247,0.1)', padding: '1rem', borderRadius: '8px' }}>
                      <div><span style={{ color: '#666', fontSize: '0.7rem' }}>Idea:</span> <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{project.scorecardAssessment.idea}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.7rem' }}>Team:</span> <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{project.scorecardAssessment.team}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.7rem' }}>MVP:</span> <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{project.scorecardAssessment.mvp}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.7rem' }}>Market Fit:</span> <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{project.scorecardAssessment.marketFit}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.7rem' }}>Traction:</span> <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{project.scorecardAssessment.traction}</span></div>
                      <div><span style={{ color: '#666', fontSize: '0.7rem' }}>Moat:</span> <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{project.scorecardAssessment.moat}</span></div>
                    </div>
                  </div>
                )}

                {/* Path to Value */}
                {project.pathToValue && (
                  <div style={{
                    background: project.pathToValue.isViable ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)',
                    borderRadius: '8px', padding: '1rem', marginBottom: '1rem',
                    border: project.pathToValue.isViable ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,68,68,0.3)'
                  }}>
                    <SectionHeader title={project.pathToValue.isViable ? '✅ PATH TO VALUE - VIABLE' : '❌ PATH TO VALUE - NOT VIABLE'} color={project.pathToValue.isViable ? '#00ff88' : '#ff4444'} />
                    {project.pathToValue.criticalMetrics?.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.25rem' }}>Critical Metrics:</div>
                        <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                          {project.pathToValue.criticalMetrics.map((m: string, i: number) => (
                            <li key={i} style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.15rem' }}>{m}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                      <div><span style={{ color: '#666' }}>Time to Proof:</span> <span style={{ color: '#ccc' }}>{project.pathToValue.timeToProof}</span></div>
                      <div><span style={{ color: '#666' }}>Success Rate:</span> <span style={{ color: '#ff4444' }}>{project.pathToValue.probabilityOfSuccess}</span></div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {project.nextSteps?.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <SectionHeader title="NEXT STEPS" color="#00d4ff" />
                    <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {project.nextSteps.map((step: string, i: number) => (
                        <li key={i} style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Brutal Truth Verdict */}
                {project.brutalTruth && (
                  <div style={{ background: 'linear-gradient(90deg, rgba(123,47,247,0.2), rgba(241,7,163,0.2))', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #f107a3' }}>
                    <SectionHeader title="VERDICT" color="#f107a3" />
                    <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '600' }}>
                      {project.brutalTruth}
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
