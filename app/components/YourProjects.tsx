'use client'

import { useState, useEffect } from 'react'

const YOUR_GITHUB_PROJECTS = [
  {
    name: 'bountywarz',
    displayName: 'BountyWarz',
    description: 'Gaming platform with competitive mechanics',
    url: 'https://github.com/NyxSpecter4/bountywarz',
    language: 'JavaScript',
    status: 'Production',
    lines: '15K+',
    category: 'Gaming',
    valuation: {
      range: '$18K - $32K',
      confidence: 'Medium',
      methodology: 'Market-based gaming multiple (1.5x)'
    }
  },
  {
    name: 'camel-racing',
    displayName: 'Camel Racing',
    description: 'Browser-based strategy racing game with AI opponents',
    url: 'https://github.com/NyxSpecter4/camel-racing',
    language: 'HTML/JavaScript',
    status: 'Live',
    lines: '48K',
    category: 'Gaming',
    valuation: {
      range: '$28K - $86K',
      confidence: 'High',
      methodology: 'Realistic gaming valuation (1.5x market multiple)'
    }
  },
  {
    name: 'RWS-CC',
    displayName: 'RWS Shopping Center',
    description: 'Property management system with AI integration',
    url: 'https://github.com/NyxSpecter4/RWS-CC',
    language: 'JavaScript',
    status: 'Production',
    lines: '12.5K',
    category: 'Enterprise Software',
    valuation: {
      range: '$42K - $75K',
      confidence: 'Medium',
      methodology: 'Enterprise software multiple (4.2x)'
    }
  },
  {
    name: 'proxy-dealmaker',
    displayName: 'DealMaker Platform',
    description: 'AI-powered software acquisition platform',
    url: 'https://github.com/NyxSpecter4/proxy-dealmaker',
    language: 'TypeScript/Next.js',
    status: 'Live',
    lines: '8K+',
    category: 'AI/ML',
    valuation: {
      range: '$65K - $120K',
      confidence: 'High',
      methodology: 'AI/ML premium multiple (5.0x)'
    }
  }
]

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'Gaming': 'bg-purple-900/30 text-purple-400',
  'AI/ML': 'bg-blue-900/30 text-blue-400',
  'Enterprise Software': 'bg-green-900/30 text-green-400',
  'Developer Tools': 'bg-yellow-900/30 text-yellow-400',
  'Infrastructure': 'bg-red-900/30 text-red-400',
  'Open Source': 'bg-gray-800 text-gray-300'
}

// Confidence color mapping
const CONFIDENCE_COLORS: Record<string, string> = {
  'High': 'bg-green-900/30 text-green-400',
  'Medium': 'bg-yellow-900/30 text-yellow-400',
  'Low': 'bg-red-900/30 text-red-400'
}

export default function YourProjects() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">GitHub Portfolio</span>
          <span className="block text-lg text-gray-400 mt-2">with Realistic Market Valuations</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Actual production code repositories with market-calibrated valuations based on industry multiples and acquisition data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {YOUR_GITHUB_PROJECTS.map((project) => (
          <div key={project.name} className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition group">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{project.displayName}</h3>
                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                  {project.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS['Open Source']}`}>
                  {project.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${CONFIDENCE_COLORS[project.valuation.confidence]}`}>
                  {project.valuation.confidence} Confidence
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Language</span>
                <span className="text-gray-300">{project.language}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Code Volume</span>
                <span className="text-gray-300 font-medium">{project.lines} lines</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Valuation Range</span>
                <span className="text-gray-300 font-bold">{project.valuation.range}</span>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Valuation Methodology</div>
                <div className="text-xs text-gray-400">{project.valuation.methodology}</div>
              </div>
            </div>

            <div className="space-y-3">
              <a 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 py-3 rounded-lg font-medium transition"
              >
                View Source Code
              </a>
              <button className="block w-full text-center bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 border border-gray-800 py-2 rounded-lg text-sm font-medium transition opacity-0 group-hover:opacity-100">
                Request Detailed Valuation Analysis
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 pt-8 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-bold mb-3">Valuation Methodology</h3>
          <p className="text-gray-600 text-sm mb-4">
            Valuations are calculated using our enhanced market-calibrated analyzer with industry-specific multiples:
            Gaming (1.5x), AI/ML (5.0x), Enterprise Software (4.2x), and realistic base parameters ($250/star, $10K/contributor).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-gray-900/30 p-3 rounded">
              <div className="font-bold">Market Parameters</div>
              <div className="text-gray-400">$250/star, $10K/contributor</div>
            </div>
            <div className="bg-gray-900/30 p-3 rounded">
              <div className="font-bold">Industry Multiples</div>
              <div className="text-gray-400">1.5x - 5.0x based on category</div>
            </div>
            <div className="bg-gray-900/30 p-3 rounded">
              <div className="font-bold">Quality Adjustment</div>
              <div className="text-gray-400">Activity, community, code health scores</div>
            </div>
            <div className="bg-gray-900/30 p-3 rounded">
              <div className="font-bold">Realistic Ranges</div>
              <div className="text-gray-400">60-180% variance based on market data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}