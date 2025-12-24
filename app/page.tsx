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
    <div style={{ fontSize: '0.8rem', color, fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
      {title}
    </div>
  )

  const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.75rem', color: '#00d4ff', fontWeight: '700', marginBottom: '0.75rem' }}>{title}</div>
      {children}
    </div>
  )

  const InfoRow = ({ label, value, color = '#ccc' }: { label: string; value: string; color?: string }) => (
    <div style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
      <span style={{ color: '#888' }}>{label}:</span> <span style={{ color }}>{value}</span>
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
            {/* Portfolio Summary */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#00d4ff' }}>
                ${analysis?.totalValue?.toLocaleString() || '0'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>Total Portfolio Valuation</div>
              {analysis?.portfolioSummary && (
                <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '1rem', maxWidth: '700px', margin: '1rem auto 0', lineHeight: '1.6' }}>
                  {analysis.portfolioSummary}
                </div>
              )}
            </div>

            {/* Top Pick Banner */}
            {analysis?.topPick && (
              <div style={{
                background: 'linear-gradient(90deg, rgba(0,255,136,0.2), rgba(0,212,255,0.2))',
                border: '2px solid #00ff88',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#00ff88' }}>
                  🎯 RECOMMENDED FOCUS: {analysis.topPick}
                </div>
              </div>
            )}

            {/* Projects */}
            {analysis?.projects?.map((project: any, index: number) => (
              <div key={project.name || index} style={{
                background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.5rem',
                marginBottom: '2rem', border: '1px solid rgba(123,47,247,0.3)'
              }}>
                {/* Header */}
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.5rem', color: '#00d4ff' }}>{project.name}</h3>

                {/* Values Row */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,68,68,0.15)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,68,68,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#ff4444', fontWeight: '700' }}>CURRENT</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ff4444' }}>${project.realisticValue?.toLocaleString() || '0'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,255,136,0.15)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#00ff88', fontWeight: '700' }}>POTENTIAL</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#00ff88' }}>${project.optimisticValue?.toLocaleString() || '0'}</div>
                  </div>
                  <div style={{ background: 'rgba(123,47,247,0.15)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(123,47,247,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#7b2ff7', fontWeight: '700' }}>STAGE</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#7b2ff7' }}>{project.stage}</div>
                  </div>
                </div>

                {/* Validation Framework */}
                <div style={{
                  background: project.validationFramework?.shouldValidate ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)',
                  border: project.validationFramework?.shouldValidate ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,68,68,0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: project.validationFramework?.shouldValidate ? '#00ff88' : '#ff4444', marginBottom: '0.5rem' }}>
                    {project.validationFramework?.shouldValidate ? '✅ Worth Validating' : '❌ Not Worth Validating'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem' }}>
                    {project.validationFramework?.reasoning}
                  </div>

                  {project.validationFramework?.shouldValidate && (
                    <>
                      {/* 90-Day Test */}
                      <SubSection title="📋 THE 90-DAY TEST">
                        <InfoRow label="Build" value={project.validationFramework?.the90DayTest?.buildThis} color="#fff" />
                        <InfoRow label="Example" value={project.validationFramework?.the90DayTest?.example} />
                        <InfoRow label="Metric" value={project.validationFramework?.the90DayTest?.metric} color="#00d4ff" />
                        <InfoRow label="Success" value={project.validationFramework?.the90DayTest?.successCriteria} color="#00ff88" />
                        <InfoRow label="Time Cost" value={project.validationFramework?.the90DayTest?.cost} />
                      </SubSection>

                      {/* Micro-MVP */}
                      <SubSection title="🔬 MICRO-MVP PLAN">
                        <InfoRow label="What to Build" value={project.microMVP?.whatToBuild} color="#fff" />
                        <InfoRow label="Example" value={project.microMVP?.example} />
                        <InfoRow label="Timeline" value={project.microMVP?.timeline} color="#00d4ff" />
                        <InfoRow label="Test With" value={project.microMVP?.userTarget} />
                        <InfoRow label="Key Question" value={project.microMVP?.criticalQuestion} color="#f107a3" />
                      </SubSection>

                      {/* Immediate Actions */}
                      {project.immediateActions?.length > 0 && (
                        <SubSection title="📅 WEEK-BY-WEEK PLAN">
                          {project.immediateActions.map((action: any, i: number) => (
                            <div key={i} style={{ marginBottom: '0.5rem' }}>
                              {Object.entries(action).map(([week, task]) => (
                                <InfoRow key={week} label={week.replace('_', '-')} value={task as string} />
                              ))}
                            </div>
                          ))}
                        </SubSection>
                      )}

                      {/* Strategic Pivots */}
                      {project.validationFramework?.strategicPivots?.length > 0 && (
                        <SubSection title="🔄 IF TEST RESULTS SHOW...">
                          {project.validationFramework.strategicPivots.map((pivot: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(241,7,163,0.1)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                              <InfoRow label="Scenario" value={pivot.scenario} color="#f107a3" />
                              <InfoRow label="→ Pivot to" value={pivot.pivot} color="#00ff88" />
                              <InfoRow label="Why" value={pivot.reasoning} />
                              {pivot.newMarket && <InfoRow label="New Market" value={pivot.newMarket} color="#00d4ff" />}
                            </div>
                          ))}
                        </SubSection>
                      )}

                      {/* Pivot Opportunities */}
                      {project.pivotOpportunities?.length > 0 && (
                        <SubSection title="💡 ALTERNATIVE DIRECTIONS">
                          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                            {project.pivotOpportunities.map((opp: string, i: number) => (
                              <li key={i} style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.25rem' }}>{opp}</li>
                            ))}
                          </ul>
                        </SubSection>
                      )}

                      {/* Intelligent Shelving */}
                      <SubSection title="📦 IF VALIDATION FAILS">
                        <InfoRow label="When" value={project.validationFramework?.intelligentShelving?.if} />
                        <InfoRow label="Action" value={project.validationFramework?.intelligentShelving?.then} color="#7b2ff7" />
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#888' }}>Salvage Value:</span>
                          <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
                            {project.validationFramework?.intelligentShelving?.salvageValue?.map((v: string, i: number) => (
                              <li key={i} style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.15rem' }}>{v}</li>
                            ))}
                          </ul>
                        </div>
                      </SubSection>
                    </>
                  )}
                </div>

                {/* Industry Benchmarks */}
                <SubSection title="📊 INDUSTRY REALITY">
                  <InfoRow label="Sector" value={project.industryBenchmarks?.sector} />
                  <InfoRow label="Failure Rate" value={project.industryBenchmarks?.failureRate} color="#ff4444" />
                  <InfoRow label="Success Metric" value={project.industryBenchmarks?.successMetric} color="#00ff88" />
                  <InfoRow label="Business Model" value={project.industryBenchmarks?.dominantModel} />
                </SubSection>

                {/* Decision Framework */}
                <SubSection title="🤔 BEFORE YOU DECIDE">
                  <InfoRow label="Passion Check" value={project.decisionFramework?.passion} />
                  <InfoRow label="Resource Reality" value={project.decisionFramework?.resources} />
                  <InfoRow label="Skill Value" value={project.decisionFramework?.skillDevelopment} />
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(123,47,247,0.2)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#7b2ff7', fontWeight: '700' }}>→ Recommendation: </span>
                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>{project.decisionFramework?.recommendation}</span>
                  </div>
                </SubSection>

                {/* Brutal Verdict */}
                <div style={{
                  background: 'linear-gradient(90deg, rgba(123,47,247,0.2), rgba(241,7,163,0.2))',
                  borderRadius: '8px',
                  padding: '1rem',
                  borderLeft: '4px solid #f107a3'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#f107a3', fontWeight: '700', marginBottom: '0.5rem' }}>VERDICT</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '600', lineHeight: '1.5' }}>
                    {project.brutalVerdict}
                  </div>
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
