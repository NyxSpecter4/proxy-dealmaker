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

  const Section = ({ title, children, color = '#00d4ff' }: { title: string; children: React.ReactNode; color?: string }) => (
    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.9rem', color, fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title}
      </div>
      {children}
    </div>
  )

  const InfoRow = ({ label, value, color = '#ccc' }: { label: string; value: any; color?: string }) => (
    <div style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
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
                  <div style={{ background: 'rgba(255,68,68,0.15)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <span style={{ color: '#888', fontSize: '0.75rem' }}>Current: </span>
                    <span style={{ color: '#ff4444', fontWeight: '700' }}>${project.realisticValue?.toLocaleString() || '0'}</span>
                  </div>
                  <div style={{ background: 'rgba(0,255,136,0.15)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <span style={{ color: '#888', fontSize: '0.75rem' }}>Potential: </span>
                    <span style={{ color: '#00ff88', fontWeight: '700' }}>${project.optimisticValue?.toLocaleString() || '0'}</span>
                  </div>
                  <div style={{ background: 'rgba(123,47,247,0.15)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <span style={{ color: '#888', fontSize: '0.75rem' }}>Stage: </span>
                    <span style={{ color: '#7b2ff7', fontWeight: '700' }}>{project.stage}</span>
                  </div>
                </div>

                {/* The 90-Day Test */}
                {project.the90DayTest && (
                  <Section title="📋 THE 90-DAY VALIDATION TEST">
                    {/* Build Plan */}
                    <div style={{ marginBottom: '1rem' }}>
                      <InfoRow label="Build" value={project.the90DayTest.buildThis} color="#fff" />
                      <InfoRow label="Example" value={project.the90DayTest.example} />
                      <InfoRow label="Test With" value={project.the90DayTest.testWith} color="#00d4ff" />
                      <InfoRow label="Cost" value={project.the90DayTest.costPerInstall} color="#00ff88" />
                    </div>

                    {/* Week-by-Week Timeline */}
                    {project.the90DayTest.timeline && (
                      <div style={{ background: 'rgba(123,47,247,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#7b2ff7', fontWeight: '700', marginBottom: '0.75rem' }}>📅 8-WEEK TIMELINE</div>
                        {Object.entries(project.the90DayTest.timeline).map(([key, value]) => (
                          <div key={key} style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                            <span style={{ color: '#7b2ff7', fontWeight: '600' }}>{key.replace(/_/g, '-')}:</span>{' '}
                            <span style={{ color: '#ccc' }}>{value as string}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Specific Metrics */}
                    {project.the90DayTest.specificMetrics && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#f107a3', fontWeight: '700', marginBottom: '0.75rem' }}>🎯 KEY METRICS TO TRACK</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                          {Object.entries(project.the90DayTest.specificMetrics).map(([key, metric]: [string, any]) => (
                            <div key={key} style={{ background: 'rgba(241,7,163,0.1)', padding: '0.75rem', borderRadius: '8px', border: metric.critical ? '1px solid #f107a3' : 'none' }}>
                              <div style={{ fontSize: '0.85rem', color: '#f107a3', fontWeight: '700', marginBottom: '0.3rem' }}>{metric.metric}</div>
                              <div style={{ fontSize: '0.8rem', color: '#00ff88', marginBottom: '0.2rem' }}>Target: {metric.target}</div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>Measure: {metric.measureHow}</div>
                              {metric.critical && (
                                <div style={{ fontSize: '0.75rem', color: '#ff4444', marginTop: '0.3rem', fontWeight: '600' }}>⚠️ {metric.critical}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Success Decision Criteria */}
                    {project.the90DayTest.successDecision && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#00ff88', fontWeight: '700', marginBottom: '0.75rem' }}>✅ DECISION THRESHOLDS</div>
                        {Object.entries(project.the90DayTest.successDecision).map(([level, criteria]) => (
                          <div key={level} style={{
                            fontSize: '0.85rem',
                            marginBottom: '0.3rem',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '4px',
                            background: level === 'strong' ? 'rgba(0,255,136,0.1)' : level === 'moderate' ? 'rgba(255,193,7,0.1)' : 'rgba(255,68,68,0.1)'
                          }}>
                            <span style={{ color: level === 'strong' ? '#00ff88' : level === 'moderate' ? '#ffc107' : '#ff4444', fontWeight: '700' }}>
                              {level.toUpperCase()}:
                            </span>{' '}
                            <span style={{ color: '#ccc' }}>{criteria as string}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Organic Testing Channels */}
                    {project.organicTestingChannels && project.organicTestingChannels.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#00d4ff', fontWeight: '700', marginBottom: '0.75rem' }}>🌐 WHERE TO FIND TESTERS ($0 COST)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                          {project.organicTestingChannels.map((channel: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(0,212,255,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                              <div style={{ fontSize: '0.85rem', color: '#00d4ff', fontWeight: '600', marginBottom: '0.3rem' }}>{channel.platform}</div>
                              <div style={{ fontSize: '0.75rem', color: '#ccc' }}>Reach: {channel.expectedReach}</div>
                              <div style={{ fontSize: '0.75rem', color: '#00ff88' }}>Cost: {channel.cost}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>
                )}

                
                {/* Week-by-Week Timeline */}
                {project.the90DayTest?.weekByWeek && (
                  <div style={{ background: 'rgba(123,47,247,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#7b2ff7', fontWeight: '700', marginBottom: '0.75rem' }}>📅 8-WEEK TIMELINE</div>
                    {Object.entries(project.the90DayTest.weekByWeek).map(([key, value]) => (
                      <div key={key} style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#7b2ff7', fontWeight: '600' }}>{key.replace(/_/g, '-').replace('week', 'Week ')}:</span>{' '}
                        <span style={{ color: '#ccc' }}>{value as string}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technical Debt */}
                {project.technicalDebt && (
                  <Section title="🔧 TECHNICAL DEBT" color="#ff6b6b">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ff6b6b' }}>{project.technicalDebt.score}</div>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>Technical Health Score</div>
                    </div>
                    {project.technicalDebt.breakdown && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                        {Object.entries(project.technicalDebt.breakdown).map(([key, value]) => (
                          <div key={key} style={{ background: 'rgba(255,107,107,0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#ff6b6b', fontWeight: '600', textTransform: 'capitalize' }}>{key}</div>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{value as string}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {project.technicalDebt.technicalRisks && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#ff4444', fontWeight: '600', marginBottom: '0.3rem' }}>⚠️ Risks:</div>
                        {project.technicalDebt.technicalRisks.map((risk: string, i: number) => (
                          <div key={i} style={{ fontSize: '0.8rem', color: '#ccc', marginLeft: '0.5rem' }}>• {risk}</div>
                        ))}
                      </div>
                    )}
                    <InfoRow label="Cost to Fix" value={project.technicalDebt.costToFix} color="#00ff88" />
                  </Section>
                )}

                {/* Competitive Analysis */}
                {project.competitiveAnalysis && (
                  <Section title="⚔️ COMPETITIVE ANALYSIS" color="#ffa500">
                    {project.competitiveAnalysis.directCompetitors && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                        {project.competitiveAnalysis.directCompetitors.map((comp: any, i: number) => (
                          <div key={i} style={{ background: 'rgba(255,165,0,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,165,0,0.3)' }}>
                            <div style={{ fontSize: '0.9rem', color: '#ffa500', fontWeight: '700', marginBottom: '0.3rem' }}>{comp.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#00ff88', marginBottom: '0.2rem' }}>{comp.metrics}</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.2rem' }}>Advantage: {comp.advantage}</div>
                            <div style={{ fontSize: '0.75rem', color: '#00d4ff' }}>Your Edge: {comp.yourEdge}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <InfoRow label="Market Position" value={project.competitiveAnalysis.marketPosition} />
                    <InfoRow label="Moat Strength" value={project.competitiveAnalysis.moatStrength} color={project.competitiveAnalysis.moatStrength?.includes('WEAK') ? '#ff4444' : '#00ff88'} />
                  </Section>
                )}

                {/* Revenue Projections */}
                {project.revenueProjections && (
                  <Section title="💰 REVENUE PROJECTIONS" color="#00ff88">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      {project.revenueProjections.year1 && (
                        <div style={{ background: 'rgba(0,255,136,0.1)', padding: '1rem', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.85rem', color: '#00ff88', fontWeight: '700', marginBottom: '0.5rem' }}>YEAR 1</div>
                          <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.3rem' }}>{project.revenueProjections.year1.scenario}</div>
                          {project.revenueProjections.year1.assumptions?.map((a: string, i: number) => (
                            <div key={i} style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>• {a}</div>
                          ))}
                          <div style={{ marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#ff4444' }}>Realistic: {project.revenueProjections.year1.realistic}</span>
                            <span style={{ fontSize: '0.8rem', color: '#00ff88', marginLeft: '1rem' }}>Upside: {project.revenueProjections.year1.upside}</span>
                          </div>
                        </div>
                      )}
                      {project.revenueProjections.year2 && (
                        <div style={{ background: 'rgba(0,212,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.85rem', color: '#00d4ff', fontWeight: '700', marginBottom: '0.5rem' }}>YEAR 2</div>
                          <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.3rem' }}>{project.revenueProjections.year2.scenario}</div>
                          {project.revenueProjections.year2.assumptions?.map((a: string, i: number) => (
                            <div key={i} style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>• {a}</div>
                          ))}
                          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#00ff88', fontWeight: '600' }}>
                            {project.revenueProjections.year2.realistic}
                          </div>
                        </div>
                      )}
                    </div>
                    <InfoRow label="Break-Even" value={project.revenueProjections.breakEven} color="#ffc107" />
                  </Section>
                )}

                {/* Go-to-Market Strategy */}
                {project.goToMarketStrategy && (
                  <Section title="🚀 GO-TO-MARKET STRATEGY" color="#00d4ff">
                    {project.goToMarketStrategy.phase1_organic && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#00ff88', fontWeight: '700', marginBottom: '0.5rem' }}>PHASE 1: ORGANIC ($0)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                          {project.goToMarketStrategy.phase1_organic.channels?.map((ch: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(0,255,136,0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                              <div style={{ fontSize: '0.8rem', color: '#00ff88', fontWeight: '600' }}>{ch.platform}</div>
                              <div style={{ fontSize: '0.75rem', color: '#ccc' }}>Reach: {ch.reach} | Conv: {ch.conversion}</div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>{ch.timeline}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#00ff88', marginTop: '0.5rem' }}>Target: {project.goToMarketStrategy.phase1_organic.target}</div>
                      </div>
                    )}
                    {project.goToMarketStrategy.phase2_paid && (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#ffa500', fontWeight: '700', marginBottom: '0.5rem' }}>PHASE 2: PAID</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                          {project.goToMarketStrategy.phase2_paid.channels?.map((ch: any, i: number) => (
                            <div key={i} style={{ background: 'rgba(255,165,0,0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                              <div style={{ fontSize: '0.8rem', color: '#ffa500', fontWeight: '600' }}>{ch.platform}</div>
                              <div style={{ fontSize: '0.75rem', color: '#ccc' }}>CPI: {ch.expectedCPI} | Budget: {ch.budget}</div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>Reach: {ch.reach} | {ch.timeline}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '0.5rem' }}>Target: {project.goToMarketStrategy.phase2_paid.target}</div>
                      </div>
                    )}
                  </Section>
                )}

                {/* Funding Roadmap */}
                {project.fundingRoadmap && (
                  <Section title="💎 FUNDING ROADMAP" color="#7b2ff7">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {project.fundingRoadmap.bootstrap && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(123,47,247,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ width: '80px', fontSize: '0.75rem', color: '#7b2ff7', fontWeight: '700' }}>BOOTSTRAP</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.fundingRoadmap.bootstrap.milestone}</div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.fundingRoadmap.bootstrap.timeline} | Val: {project.fundingRoadmap.bootstrap.valuation}</div>
                          </div>
                        </div>
                      )}
                      {project.fundingRoadmap.angel && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,255,136,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ width: '80px', fontSize: '0.75rem', color: '#00ff88', fontWeight: '700' }}>ANGEL</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.fundingRoadmap.angel.milestone}</div>
                            <div style={{ fontSize: '0.75rem', color: '#00ff88' }}>{project.fundingRoadmap.angel.funding}</div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.fundingRoadmap.angel.timeline} | Val: {project.fundingRoadmap.angel.valuation}</div>
                          </div>
                        </div>
                      )}
                      {project.fundingRoadmap.seed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,212,255,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ width: '80px', fontSize: '0.75rem', color: '#00d4ff', fontWeight: '700' }}>SEED</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{project.fundingRoadmap.seed.milestone}</div>
                            <div style={{ fontSize: '0.75rem', color: '#00d4ff' }}>{project.fundingRoadmap.seed.funding}</div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.fundingRoadmap.seed.timeline} | Val: {project.fundingRoadmap.seed.valuation}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Section>
                )}

                {/* Exit Scenarios */}
                {project.exitScenarios && (
                  <Section title="🚪 EXIT SCENARIOS" color="#f107a3">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                      {project.exitScenarios.acquihire && (
                        <div style={{ background: 'rgba(0,255,136,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.8rem', color: '#00ff88', fontWeight: '700' }}>ACQUI-HIRE ({project.exitScenarios.acquihire.probability})</div>
                          <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>{project.exitScenarios.acquihire.value}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>Buyer: {project.exitScenarios.acquihire.buyer}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.exitScenarios.acquihire.timeline}</div>
                        </div>
                      )}
                      {project.exitScenarios.strategic && (
                        <div style={{ background: 'rgba(0,212,255,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.8rem', color: '#00d4ff', fontWeight: '700' }}>STRATEGIC ({project.exitScenarios.strategic.probability})</div>
                          <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>{project.exitScenarios.strategic.value}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>Buyer: {project.exitScenarios.strategic.buyer}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.exitScenarios.strategic.timeline}</div>
                        </div>
                      )}
                      {project.exitScenarios.shutdown && (
                        <div style={{ background: 'rgba(255,68,68,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.8rem', color: '#ff4444', fontWeight: '700' }}>SHUTDOWN ({project.exitScenarios.shutdown.probability})</div>
                          <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>{project.exitScenarios.shutdown.value}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>{project.exitScenarios.shutdown.timeline}</div>
                        </div>
                      )}
                    </div>
                    {project.exitScenarios.expectedValue && (
                      <div style={{ background: 'rgba(241,7,163,0.2)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#f107a3', fontWeight: '600' }}>EXPECTED VALUE</div>
                        <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '700' }}>{project.exitScenarios.expectedValue}</div>
                      </div>
                    )}
                  </Section>
                )}

                {/* Risk Assessment */}
                {project.riskAssessment && (
                  <Section title="⚠️ RISK ASSESSMENT" color="#ff4444">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      {['technicalRisk', 'marketRisk', 'executionRisk', 'competitiveRisk'].map((riskType) => {
                        const risk = project.riskAssessment[riskType];
                        if (!risk) return null;
                        const isHigh = risk.includes('HIGH') || risk.includes('VERY HIGH');
                        return (
                          <div key={riskType} style={{
                            background: isHigh ? 'rgba(255,68,68,0.15)' : 'rgba(255,193,7,0.15)',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            borderLeft: `3px solid ${isHigh ? '#ff4444' : '#ffc107'}`
                          }}>
                            <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'capitalize' }}>{riskType.replace('Risk', ' Risk')}</div>
                            <div style={{ fontSize: '0.8rem', color: isHigh ? '#ff4444' : '#ffc107', fontWeight: '600' }}>{risk}</div>
                          </div>
                        );
                      })}
                    </div>
                    {project.riskAssessment.probabilityOfSuccess && (
                      <div style={{ background: 'rgba(255,68,68,0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#ff4444', fontWeight: '700', marginBottom: '0.5rem' }}>PROBABILITY OF SUCCESS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                          {Object.entries(project.riskAssessment.probabilityOfSuccess).map(([key, value]) => (
                            <div key={key} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '700' }}>{value as string}</div>
                              <div style={{ fontSize: '0.7rem', color: '#888' }}>{key.replace(/([A-Z])/g, ' $1').replace('reaching', 'Reach ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>
                )}

{/* Market Context */}
                {project.marketContext && (
                  <Section title="📊 MARKET CONTEXT" color="#7b2ff7">
                    <InfoRow label="Sector" value={project.marketContext.sector} />
                    <InfoRow label="Market Size" value={project.marketContext.marketSize} color="#00ff88" />
                    <InfoRow label="Advantage" value={project.marketContext.advantage} color="#00d4ff" />
                    <InfoRow label="Challenge" value={project.marketContext.challenge} color="#ff4444" />
                    <InfoRow label="Competition" value={project.marketContext.competition} />
                  </Section>
                )}

                {/* Pivot Triggers */}
                {project.pivotTriggers && (
                  <Section title="🔄 WHEN TO PIVOT" color="#f107a3">
                    {Object.entries(project.pivotTriggers).map(([trigger, action]) => (
                      <div key={trigger} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: 'rgba(241,7,163,0.1)', borderRadius: '6px' }}>
                        <span style={{ color: '#f107a3', fontWeight: '600', fontSize: '0.8rem' }}>
                          {trigger.replace(/([A-Z])/g, ' $1').replace(/^if/, 'If')}:
                        </span>{' '}
                        <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{action as string}</span>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Next Milestones */}
                {project.nextMilestones?.after90Days && (
                  <Section title="🚀 AFTER 90 DAYS (IF VALIDATED)" color="#00ff88">
                    <InfoRow label="Next Build" value={project.nextMilestones.after90Days.ifValidated} color="#fff" />
                    <InfoRow label="Funding Potential" value={project.nextMilestones.after90Days.funding} color="#00ff88" />
                    <InfoRow label="Valuation" value={project.nextMilestones.after90Days.valuation} color="#00d4ff" />
                  </Section>
                )}

                {/* Brutal Verdict */}
                <div style={{
                  background: 'linear-gradient(90deg, rgba(123,47,247,0.2), rgba(241,7,163,0.2))',
                  borderRadius: '8px',
                  padding: '1rem',
                  borderLeft: '4px solid #f107a3'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#f107a3', fontWeight: '700', marginBottom: '0.5rem' }}>VERDICT</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '600', lineHeight: '1.6' }}>
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
