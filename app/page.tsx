'use client';

import { BRAND } from '@/lib/constants/brand';
import { useState, useEffect } from 'react';

interface RepoForSale {
  name: string;
  description: string;
  language: string;
  analysis?: {
    valueProposition: string;
    targetCustomers: string[];
    pricing: string;
    features: string[];
  };
  pitch?: string;
  githubUrl: string;
}

export default function AIRepoMarketplace() {
  const [repos, setRepos] = useState<RepoForSale[]>([
    {
      name: 'camel-racing',
      description: 'Advanced racing simulation system',
      language: 'TypeScript',
      githubUrl: 'https://github.com/***/camel-racing'
    },
    {
      name: 'RWS-CC',
      description: 'Credit card processing and finance system',
      language: 'TypeScript',
      githubUrl: 'https://github.com/***/RWS-CC'
    },
    {
      name: 'wanderquest',
      description: 'Adventure and exploration game engine',
      language: 'TypeScript',
      githubUrl: 'https://github.com/***/wanderquest'
    }
  ]);

  const [analyzing, setAnalyzing] = useState(false);

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    // Simulate AI analysis (real version would call your API)
    const analyzedRepos = repos.map(repo => ({
      ...repo,
      analysis: {
        valueProposition: `AI-analyzed: ${repo.name} offers ${repo.description.toLowerCase()}`,
        targetCustomers: ['Startups', 'Enterprises', 'Developers'],
        pricing: 'Contact for AI-generated quote',
        features: ['TypeScript', 'Modular Design', 'Production Ready']
      },
      pitch: `Our AI analysis shows ${repo.name} is a valuable asset for companies needing ${repo.description.toLowerCase()}.`
    }));
    
    setTimeout(() => {
      setRepos(analyzedRepos);
      setAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    analyzeWithAI();
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white'}}>
      {/* HEADER */}
      <header style={{padding:'3rem 2rem',textAlign:'center',borderBottom:'1px solid #333'}}>
        <h1 style={{fontSize:'3.5rem',fontWeight:'900',margin:'0 0 0.5rem',background:'linear-gradient(90deg, #FF6B35, #00E5E9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          {BRAND.NAME}
        </h1>
        <p style={{margin:'0',opacity:0.8,fontSize:'1.2rem'}}>AI-Powered Software Marketplace</p>
        <p style={{margin:'1rem auto 0',maxWidth:'600px',opacity:0.7}}>
          Using OpenAI to analyze, pitch, and value proprietary software
        </p>
      </header>

      {/* AI ANALYSIS STATUS */}
      <div style={{padding:'1.5rem 2rem',background:'#1a1a1a',textAlign:'center',borderBottom:'1px solid #333'}}>
        {analyzing ? (
          <p>🔄 AI is analyzing repository value and generating pitches...</p>
        ) : (
          <p>✅ AI analysis complete. Repositories valued and pitched.</p>
        )}
      </div>

      {/* REPOSITORY MARKETPLACE */}
      <main style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <h2 style={{fontSize:'2.5rem',marginBottom:'3rem',textAlign:'center'}}>
          AI-Valued Software Assets
        </h2>
        
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))',gap:'2.5rem'}}>
          {repos.map((repo, index) => (
            <div key={index} style={{background:'#1a1a1a',borderRadius:'16px',padding:'2rem',border:'1px solid #333',position:'relative'}}>
              {/* FOR SALE BADGE */}
              <div style={{position:'absolute',top:'-12px',right:'1.5rem',background:'#FF6B35',color:'white',padding:'0.5rem 1.5rem',borderRadius:'20px',fontWeight:'bold',fontSize:'0.9rem'}}>
                AI-VALUED
              </div>
              
              <h3 style={{fontSize:'1.8rem',margin:'0 0 1rem',color:'white'}}>
                {repo.name}
              </h3>
              
              <p style={{opacity:0.9,marginBottom:'1.5rem'}}>
                {repo.description}
              </p>
              
              {/* AI ANALYSIS RESULTS */}
              {repo.analysis && (
                <div style={{background:'rgba(0,0,0,0.3)',padding:'1.5rem',borderRadius:'12px',marginBottom:'1.5rem'}}>
                  <h4 style={{color:'#00E5E9',margin:'0 0 1rem',fontSize:'1.1rem'}}>🤖 AI Analysis</h4>
                  
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Value Proposition</div>
                    <div style={{fontWeight:'500'}}>{repo.analysis.valueProposition}</div>
                  </div>
                  
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Target Customers</div>
                    <div>{repo.analysis.targetCustomers.join(', ')}</div>
                  </div>
                  
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>AI Pricing</div>
                    <div style={{fontSize:'1.2rem',fontWeight:'bold',color:'#FF6B35'}}>
                      {repo.analysis.pricing}
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI GENERATED PITCH */}
              {repo.pitch && (
                <div style={{background:'rgba(255,107,53,0.1)',padding:'1.5rem',borderRadius:'12px',border:'1px solid rgba(255,107,53,0.3)',marginBottom:'1.5rem'}}>
                  <h4 style={{color:'#FF6B35',margin:'0 0 0.75rem',fontSize:'1.1rem'}}>🎯 AI-Generated Pitch</h4>
                  <p style={{opacity:0.9,margin:0,fontStyle:'italic'}}>"{repo.pitch}"</p>
                </div>
              )}
              
              {/* ACTIONS */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:'0.9rem',opacity:0.7}}>Technology</div>
                  <div style={{fontWeight:'500'}}>{repo.language}</div>
                </div>
                <button style={{
                  padding:'0.75rem 1.5rem',
                  background:'#FF6B35',
                  color:'white',
                  border:'none',
                  borderRadius:'8px',
                  fontWeight:'600',
                  cursor:'pointer'
                }}>
                  Contact to Purchase
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EXCLUDED REPO NOTICE */}
        <div style={{marginTop:'4rem',padding:'2rem',background:'rgba(255,255,255,0.05)',borderRadius:'12px',textAlign:'center'}}>
          <h3 style={{margin:'0 0 1rem'}}>Not Available</h3>
          <p style={{opacity:0.8,margin:0}}>
            proxy-dealmaker • Internal enterprise platform
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{padding:'3rem 2rem',textAlign:'center',borderTop:'1px solid #333',opacity:0.7}}>
        <p style={{margin:'0 0 0.5rem',fontSize:'1.1rem'}}>{BRAND.NAME} • AI-Powered Software Valuation</p>
        <p style={{margin:'0',fontSize:'0.9rem'}}>
          OpenAI Analysis • Intelligent Pitches • Deal Structuring
        </p>
      </footer>
    </div>
  );
}
