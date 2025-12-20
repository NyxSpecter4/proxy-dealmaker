'use client';

import { BRAND } from '@/lib/constants/brand';

const KALA_AI_ANALYZED_REPOS = [
  {
    name: 'bountywarz',
    description: 'Bounty hunting PvP game with combat AI',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 420,
      // SECRET: hourlyRate removed
      minimumValuation: 105000,
      recommendedPrice: '105,000+',
      aiPitch: 'Battle-tested PvP game engine with extensive development. Built with TypeScript for enterprise scaling. Perfect for studios wanting immediate combat systems.'
    }
  },
  {
    name: 'camel-racing',
    description: 'Physics-based camel racing simulation',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 280,
      minimumValuation: 70000,
      recommendedPrice: '70,000+',
      aiPitch: 'Niche racing simulation with substantial development. Unique market position. Ideal for educational or regional entertainment companies.'
    }
  },
  {
    name: 'RWS-CC',
    description: 'Credit card processing with fraud detection',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 350,
      minimumValuation: 87500,
      recommendedPrice: '87,500+',
      aiPitch: 'Fintech system with extensive security development. PCI-ready architecture. For startups needing production payment processing.'
    }
  },
  {
    name: 'wanderquest',
    description: 'Open-world exploration game engine',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 380,
      minimumValuation: 95000,
      recommendedPrice: '95,000+',
      aiPitch: 'Game engine with comprehensive world-building systems. Modular quest architecture. For developers creating adventure games.'
    }
  }
];

export default function KALA_AIMarketplace() {
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',fontFamily:'system-ui'}}>
      {/* HEADER */}
      <header style={{padding:'4rem 2rem 3rem',textAlign:'center'}}>
        <div style={{position:'relative',display:'inline-block'}}>
          <div style={{
            width:'120px',
            height:'120px',
            background:'linear-gradient(135deg, #FF6B35 0%, #00E5E9 100%)',
            borderRadius:'50%',
            margin:'0 auto 2rem',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'3rem',
            fontWeight:'900',
            color:'#000'
          }}>
            K.AI
          </div>
          <h1 style={{
            fontSize:'4.5rem',
            fontWeight:'900',
            margin:'0 0 0.5rem',
            background:'linear-gradient(90deg, #FF6B35, #00E5E9)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent'
          }}>
            KALA.AI
          </h1>
        </div>
        <p style={{margin:'0',opacity:0.8,fontSize:'1.3rem'}}>
          Proprietary Software Marketplace
        </p>
      </header>

      {/* MAIN CONTENT */}
      <main style={{maxWidth:'1300px',margin:'0 auto',padding:'0 2rem 4rem'}}>
        <h2 style={{fontSize:'2.8rem',margin:'0 0 3rem',textAlign:'center'}}>
          KALA.AI Valued Assets
        </h2>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(380px, 1fr))',gap:'2.5rem'}}>
          {KALA_AI_ANALYZED_REPOS.map((repo, index) => (
            <div key={index} style={{
              background:'linear-gradient(145deg, #111, #000)',
              borderRadius:'20px',
              padding:'2.5rem',
              border:'1px solid #222'
            }}>
              <h3 style={{fontSize:'2rem',margin:'0 0 1rem',color:'white'}}>
                {repo.name}
              </h3>
              
              <p style={{opacity:0.9,marginBottom:'2rem'}}>
                {repo.description}
              </p>
              
              {/* KALA.AI ANALYSIS - NO HOURLY RATE */}
              <div style={{
                background:'rgba(0,0,0,0.5)',
                padding:'1.5rem',
                borderRadius:'12px',
                marginBottom:'2rem'
              }}>
                <h4 style={{color:'#00E5E9',margin:'0 0 1.2rem'}}>
                  KALA.AI DEVELOPMENT ANALYSIS
                </h4>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Development Investment</div>
                    <div style={{fontSize:'1.5rem',fontWeight:'bold'}}>{repo.kalaAnalysis.developmentHours} hours</div>
                  </div>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Technology</div>
                    <div style={{fontSize:'1.2rem',fontWeight:'bold'}}>{repo.language}</div>
                  </div>
                </div>
              </div>
              
              {/* VALUATION - SHOWS RESULT, NOT CALCULATION */}
              <div style={{
                background:'rgba(255,107,53,0.1)',
                padding:'1.5rem',
                borderRadius:'12px',
                marginBottom:'2rem',
                border:'1px solid rgba(255,107,53,0.3)'
              }}>
                <h4 style={{color:'#FF6B35',margin:'0 0 1rem'}}>
                  KALA.AI VALUATION
                </h4>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Minimum Valuation</div>
                    <div style={{fontSize:'2rem',fontWeight:'bold',color:'#FF6B35'}}>
                      ${repo.kalaAnalysis.minimumValuation.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI PITCH */}
              <div style={{marginBottom:'2rem'}}>
                <h4 style={{color:'white',margin:'0 0 1rem'}}>
                  KALA.AI GENERATED PITCH
                </h4>
                <p style={{
                  background:'rgba(255,255,255,0.05)',
                  padding:'1.5rem',
                  borderRadius:'12px',
                  margin:0,
                  fontStyle:'italic',
                  lineHeight:'1.6'
                }}>
                  "{repo.kalaAnalysis.aiPitch}"
                </p>
              </div>
              
              <button style={{
                width:'100%',
                padding:'1.2rem',
                background:'linear-gradient(90deg, #FF6B35, #FF8B35)',
                color:'white',
                border:'none',
                borderRadius:'10px',
                fontWeight:'bold',
                fontSize:'1.1rem',
                cursor:'pointer'
              }}>
                CONTACT TO PURCHASE
              </button>
            </div>
          ))}
        </div>

        {/* NOT AVAILABLE */}
        <div style={{
          marginTop:'5rem',
          padding:'2.5rem',
          background:'rgba(255,255,255,0.03)',
          borderRadius:'16px',
          textAlign:'center'
        }}>
          <h3 style={{color:'#999',margin:'0 0 0.5rem'}}>
            Not Available for Purchase
          </h3>
          <p style={{opacity:0.7,margin:0}}>
            proxy-dealmaker • Internal enterprise platform
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        padding:'3rem 2rem',
        textAlign:'center',
        borderTop:'1px solid rgba(255,255,255,0.1)',
        background:'#000'
      }}>
        <p style={{margin:'0 0 0.5rem',fontSize:'1.3rem',fontWeight:'700'}}>
          KALA.AI
        </p>
        <p style={{margin:'0',opacity:0.7}}>
          Proprietary Software Valuation Technology
        </p>
      </footer>
    </div>
  );
}
