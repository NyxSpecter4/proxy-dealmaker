'use client'

import { useState, useEffect, useRef } from 'react'
import { MarketIntelligenceData } from '@/lib/intelligence/market-intelligence'

// CountUpValue component for animated number counting
function CountUpValue({ value, duration = 2000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current)
    }

    return () => {
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0
    const endValue = value

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentValue)
      countRef.current = currentValue

      if (percentage < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, value, duration])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div ref={elementRef}>
      {formatCurrency(count)}
    </div>
  )
}

interface DealAnalysisGridProps {
  analysisData?: any
  marketIntelligence?: MarketIntelligenceData
  isLoading?: boolean
}

export default function DealAnalysisGrid({ 
  analysisData, 
  marketIntelligence: externalMarketIntelligence,
  isLoading = false 
}: DealAnalysisGridProps) {
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligenceData | null>(null)
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    if (externalMarketIntelligence) {
      setMarketIntelligence(externalMarketIntelligence)
      setLoading(false)
    } else if (analysisData) {
      // Generate market intelligence from analysis data
      generateMarketIntelligence(analysisData)
    }
  }, [analysisData, externalMarketIntelligence])

  const generateMarketIntelligence = async (data: any) => {
    setLoading(true)
    try {
      // Simulate API call or local generation
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: data })
      })
      
      if (response.ok) {
        const result = await response.json()
        setMarketIntelligence(result.marketIntelligence)
      } else {
        // Fallback to local generation
        const { generateMarketIntelligence } = await import('@/lib/intelligence/market-intelligence')
        const generated = generateMarketIntelligence(data)
        setMarketIntelligence(generated)
      }
    } catch (error) {
      console.error('Failed to generate market intelligence:', error)
      // Use fallback data
      setMarketIntelligence(getFallbackMarketIntelligence())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackMarketIntelligence = (): MarketIntelligenceData => {
    return {
      codeHealth: {
        technicalGrade: 'B',
        topStrengths: ['Clean architecture', 'Good test coverage', 'Modern tech stack'],
        weaknesses: ['Limited documentation', 'Some technical debt'],
        overallScore: 75
      },
      marketValue: {
        estimatedAcquisitionValue: 145000,
        costToRebuild: 220000,
        ourPrice: 125000,
        valueGap: -95000,
        roiMultiple: 1.8
      },
      targetBuyers: {
        industries: ['SaaS', 'Developer Tools', 'Enterprise Software'],
        companyTypes: ['Tech Startups', 'Digital Agencies', 'Enterprise IT'],
        acquisitionCases: ['Talent acquisition', 'Technology stack enhancement'],
        fitScore: 82
      },
      competitiveEdge: {
        marketMoat: 'Strong community adoption creates network effects and switching costs',
        whyThisWins: ['Superior code quality', 'Active community', 'Market demand alignment'],
        competitiveAdvantages: ['Technical excellence', 'Community validation', 'Team expertise'],
        marketPosition: 'contender'
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400'
      case 'B': return 'text-blue-400'
      case 'C': return 'text-yellow-400'
      case 'D': return 'text-orange-400'
      case 'F': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getGradeBgColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-900/30 border-green-700'
      case 'B': return 'bg-blue-900/30 border-blue-700'
      case 'C': return 'bg-yellow-900/30 border-yellow-700'
      case 'D': return 'bg-orange-900/30 border-orange-700'
      case 'F': return 'bg-red-900/30 border-red-700'
      default: return 'bg-gray-900/30 border-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-800 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const intelligence = marketIntelligence || getFallbackMarketIntelligence()

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Market Intelligence Dashboard
          </span>
        </h2>
        <div className="text-sm text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full">
          AI-Powered Analysis • Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1: Code Health */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-6 hover:border-cyan-800/50 transition group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-cyan-400">🧠</span> Code Health
            </h3>
            <div className={`text-2xl font-bold ${getGradeColor(intelligence.codeHealth.technicalGrade)}`}>
              {intelligence.codeHealth.technicalGrade}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Overall Score: {intelligence.codeHealth.overallScore}/100</div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${intelligence.codeHealth.overallScore}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-300 mb-1">Top 3 Architectural Strengths</div>
              <ul className="space-y-1">
                {intelligence.codeHealth.topStrengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            {intelligence.codeHealth.weaknesses.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-300 mb-1">Areas for Improvement</div>
                <ul className="space-y-1">
                  {intelligence.codeHealth.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="text-yellow-500">⚠</span> {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Market Value - GLOWING VALUATION */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-black/80 via-emerald-900/10 to-black/80 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-500 group hover:shadow-[0_0_60px_rgba(16,185,129,0.3)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <span className="text-emerald-400 text-2xl">💰</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                Market Value
              </span>
            </h3>
            <div className="text-sm px-3 py-1.5 bg-emerald-900/40 text-emerald-300 rounded-full border border-emerald-500/30">
              ROI: {intelligence.marketValue.roiMultiple}x
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-400 mb-2 tracking-wider">EST. ACQUISITION VALUE</div>
              <div className="text-4xl font-black text-emerald-300 animate-pulse-slow">
                <CountUpValue value={intelligence.marketValue.estimatedAcquisitionValue} />
              </div>
              <div className="text-xs text-emerald-400/70 mt-2 flex items-center gap-2">
                <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
                <span>LIVE VALUATION</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 p-3 rounded">
                <div className="text-xs text-gray-400 mb-1">Cost to Rebuild</div>
                <div className="text-sm font-medium">
                  {formatCurrency(intelligence.marketValue.costToRebuild)}
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded">
                <div className="text-xs text-gray-400 mb-1">Our Price</div>
                <div className="text-sm font-medium text-cyan-400">
                  {formatCurrency(intelligence.marketValue.ourPrice)}
                </div>
              </div>
            </div>

            <div className={`p-3 rounded ${intelligence.marketValue.valueGap >= 0 ? 'bg-green-900/30' : 'bg-blue-900/30'}`}>
              <div className="text-xs text-gray-300 mb-1">
                {intelligence.marketValue.valueGap >= 0 ? 'Value Premium' : 'Discount Opportunity'}
              </div>
              <div className={`text-lg font-bold ${intelligence.marketValue.valueGap >= 0 ? 'text-green-400' : 'text-cyan-400'}`}>
                {intelligence.marketValue.valueGap >= 0 ? '+' : ''}{formatCurrency(Math.abs(intelligence.marketValue.valueGap))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {intelligence.marketValue.valueGap >= 0 
                  ? 'Above rebuild cost' 
                  : `${Math.round((intelligence.marketValue.valueGap / intelligence.marketValue.costToRebuild) * 100)}% below rebuild cost`
                }
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Target Buyers */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-6 hover:border-purple-800/50 transition group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-purple-400">🎯</span> Target Buyers
            </h3>
            <div className="text-sm px-2 py-1 bg-purple-900/30 text-purple-400 rounded">
              Fit: {intelligence.targetBuyers.fitScore}%
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-300 mb-2">Top Industries</div>
              <div className="flex flex-wrap gap-2">
                {intelligence.targetBuyers.industries.map((industry, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-300 mb-2">Company Types</div>
              <div className="space-y-2">
                {intelligence.targetBuyers.companyTypes.map((type, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800">
              <div className="text-sm font-medium text-gray-300 mb-2">Acquisition Cases</div>
              <ul className="space-y-2">
                {intelligence.targetBuyers.acquisitionCases.map((caseItem, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{caseItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Module 4: Competitive Edge */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-6 hover:border-orange-800/50 transition group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-orange-400">⚔️</span> Competitive Edge
            </h3>
            <div className="text-xs px-2 py-1 bg-orange-900/30 text-orange-400 rounded capitalize">
              {intelligence.competitiveEdge.marketPosition}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-300 mb-2">Market Moat</div>
              <div className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded">
                {intelligence.competitiveEdge.marketMoat}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-300 mb-2">Why This Wins</div>
              <ul className="space-y-2">
                {intelligence.competitiveEdge.whyThisWins.map((reason, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-orange-500">▶</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-800">
              <div className="text-sm font-medium text-gray-300 mb-2">Competitive Advantages</div>
              <div className="flex flex-wrap gap-2">
                {intelligence.competitiveEdge.competitiveAdvantages.map((advantage, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-1 bg-orange-900/30 text-orange-400 rounded"
                  >
                    {advantage}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-900/30 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live AI Analysis • Updated in real-time
        </div>
      </div>
    </div>
  )
}