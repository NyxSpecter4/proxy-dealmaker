'use client'
import { useEffect, useState } from 'react'

export default function Debug() {
  const [data, setData] = useState<any>({})
  
  useEffect(() => {
    async function runTests() {
      const results: any = {}
      
      // Test 1: Check logo API
      try {
        const logoRes = await fetch('/api/generate-logo')
        results.logoAPI = {
          status: logoRes.status,
          data: await logoRes.json()
        }
      } catch (e: any) {
        results.logoAPI = { error: e.message }
      }
      
      // Test 2: Check analyze-portfolio API
      try {
        const portfolioRes = await fetch('/api/analyze-portfolio')
        results.portfolioAPI = {
          status: portfolioRes.status,
          data: await portfolioRes.json()
        }
      } catch (e: any) {
        results.portfolioAPI = { error: e.message }
      }
      
      // Test 3: Check generate-copy API
      try {
        const copyRes = await fetch('/api/generate-copy')
        results.copyAPI = {
          status: copyRes.status,
          data: await copyRes.json()
        }
      } catch (e: any) {
        results.copyAPI = { error: e.message }
      }
      
      setData(results)
    }
    runTests()
  }, [])
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', background: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>🔍 MAKO THOTH DEBUG PAGE</h1>
      
      <h2>Logo API (/api/generate-logo GET)</h2>
      <pre>{JSON.stringify(data.logoAPI, null, 2)}</pre>
      
      <h2>Portfolio API (/api/analyze-portfolio)</h2>
      <pre>{JSON.stringify(data.portfolioAPI, null, 2)}</pre>
      
      <h2>Copy API (/api/generate-copy)</h2>
      <pre>{JSON.stringify(data.copyAPI, null, 2)}</pre>
    </div>
  )
}
