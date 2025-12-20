'use client';

import { BRAND } from '@/lib/constants/brand';

const REAL_REPOS = [
  {
    name: 'bountywarz',
    description: 'Bounty hunting game with advanced combat system',
    language: 'TypeScript',
    realValue: 'High - Complete game with mechanics',
    realPitch: 'Battle-tested bounty hunting game engine. Perfect for studios wanting combat AI and progression systems.',
    githubUrl: 'https://github.com/***/bountywarz'
  },
  {
    name: 'camel-racing',
    description: 'Camel racing simulation with physics and AI opponents',
    language: 'TypeScript', 
    realValue: 'Medium - Niche simulation',
    realPitch: 'Unique racing simulation. Ideal for educational or entertainment companies in Middle Eastern markets.',
    githubUrl: 'https://github.com/***/camel-racing'
  },
  {
    name: 'RWS-CC',
    description: 'Credit card processing with fraud detection',
    language: 'TypeScript',
    realValue: 'Enterprise - Financial system',
    realPitch: 'Production-ready payment system. For fintech startups needing PCI-compliant processing.',
    githubUrl: 'https://github.com/***/RWS-CC'
  },
  {
    name: 'wanderquest',
    description: 'Open-world exploration game engine',
    language: 'TypeScript',
    realValue: 'High - Game engine',
    realPitch: 'Modular game engine for adventure games. Includes world generation and quest systems.',
    githubUrl: 'https://github.com/***/wanderquest'
  }
];

export default function RealRepoMarketplace() {
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white'}}>
      {/* HEADER */}
      <header style={{padding:'3rem 2rem',textAlign:'center'}}>
        <h1 style={{fontSize:'4rem',fontWeight:'900',margin:'0 0 0.5rem',background:'linear-gradient(90deg, #FF6B35, #00E5E9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          {BRAND.NAME}
        </h1>
        <p style={{margin:'0',opacity:0.8,fontSize:'1.2rem'}}>Premium Software Assets</p>
      </header>

      {/* REAL ANALYSIS - NO BULLSHIT AI */}
      <main style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <h2 style={{fontSize:'2.5rem',marginBottom:'3rem',textAlign:'center'}}>
          Actually Valuable Repositories
        </h2>
        
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))',gap:'2rem'}}>
          {REAL_REPOS.map((repo, index) => (
            <div key={index} style={{background:'linear-gradient(145deg, #1a1a1a, #000)',borderRadius:'16px',padding:'2rem',border:'1px solid #333',boxShadow:'0 10px 30px rgba(255,107,53,0.1)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
                <h3 style={{fontSize:'1.8rem',margin:0,color:'white'}}>{repo.name}</h3>
                <span style={{background:'#FF6B35',color:'white',padding:'0.5rem 1rem',borderRadius:'20px',fontWeight:'bold',fontSize:'0.9rem'}}>
                  FOR SALE
                </span>
              </div>
              
              <p style={{opacity:0.9,marginBottom:'1.5rem',fontSize:'1.1rem'}}>
                {repo.description}
              </p>
              
              {/* ACTUAL VALUE - NOT AI BULLSHIT */}
              <div style={{background:'rgba(0,0,0,0.5)',padding:'1.5rem',borderRadius:'12px',marginBottom:'1.5rem'}}>
                <h4 style={{color:'#00E5E9',margin:'0 0 1rem',fontSize:'1.1rem'}}>🤑 Actual Value</h4>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Market Category</div>
                    <div style={{fontWeight:'bold',fontSize:'1.2rem'}}>{repo.realValue}</div>
                  </div>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Language</div>
                    <div style={{fontWeight:'bold'}}>{repo.language}</div>
                  </div>
                </div>
              </div>
              
              {/* ACTUAL PITCH - NOT AI BULLSHIT */}
              <div style={{background:'rgba(255,107,53,0.1)',padding:'1.5rem',borderRadius:'12px',border:'1px solid rgba(255,107,53,0.3)',marginBottom:'1.5rem'}}>
                <h4 style={{color:'#FF6B35',margin:'0 0 0.75rem',fontSize:'1.1rem'}}>🎯 Actual Pitch</h4>
                <p style={{opacity:0.9,margin:0,fontStyle:'italic',lineHeight:'1.6'}}>
                  "{repo.realPitch}"
                </p>
              </div>
              
              {/* ACTIONS */}
              <div style={{display:'flex',gap:'1rem'}}>
                <button style={{
                  flex:1,
                  padding:'1rem',
                  background:'#FF6B35',
                  color:'white',
                  border:'none',
                  borderRadius:'8px',
                  fontWeight:'bold',
                  fontSize:'1rem',
                  cursor:'pointer'
                }}>
                  Make Offer
                </button>
                <button style={{
                  padding:'1rem 1.5rem',
                  background:'transparent',
                  color:'#00E5E9',
                  border:'2px solid #00E5E9',
                  borderRadius:'8px',
                  fontWeight:'bold',
                  cursor:'pointer'
                }}>
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EXCLUDED */}
        <div style={{marginTop:'4rem',padding:'2rem',background:'rgba(255,0,0,0.05)',borderRadius:'12px',textAlign:'center',border:'1px solid rgba(255,0,0,0.2)'}}>
          <h3 style={{color:'#FF4444',margin:'0 0 0.5rem'}}>🚫 Not For Sale</h3>
          <p style={{opacity:0.8,margin:0}}>proxy-dealmaker • Internal use only</p>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{padding:'3rem 2rem',textAlign:'center',borderTop:'1px solid #333',opacity:0.7}}>
        <p style={{margin:'0 0 0.5rem'}}>{BRAND.NAME} • Real Software Value</p>
        <p style={{margin:'0',fontSize:'0.9rem'}}>No bullshit AI • Actual analysis • Real pitches</p>
      </footer>
    </div>
  );
}
