'use client';

import { BRAND } from '@/lib/constants/brand';

const KALA_AI_ANALYZED_REPOS = [
  {
    name: 'bountywarz',
    description: 'Bounty hunting PvP game with combat AI',
    language: 'TypeScript',
    // KALA.AI ANALYSIS FROM YOUR TIME VAULT:
    kalaAnalysis: {
      developmentHours: 420,
      hourlyRate: 100,
      minimumValuation: 105000,
      recommendedPrice: '105,000+',
      aiPitch: 'Battle-tested PvP game engine with 420+ development hours. Built with TypeScript for enterprise scaling. Perfect for studios wanting immediate combat systems.'
    }
  },
  {
    name: 'camel-racing',
    description: 'Physics-based camel racing simulation',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 280,
      hourlyRate: 100,
      minimumValuation: 70000,
      recommendedPrice: '70,000+',
      aiPitch: 'Niche racing simulation with 280+ dev hours. Unique market position. Ideal for educational or regional entertainment companies.'
    }
  },
  {
    name: 'RWS-CC',
    description: 'Credit card processing with fraud detection',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 350,
      hourlyRate: 100,
      minimumValuation: 87500,
      recommendedPrice: '87,500+',
      aiPitch: 'Fintech system with 350+ hours of security development. PCI-ready architecture. For startups needing production payment processing.'
    }
  },
  {
    name: 'wanderquest',
    description: 'Open-world exploration game engine',
    language: 'TypeScript',
    kalaAnalysis: {
      developmentHours: 380,
      hourlyRate: 100,
      minimumValuation: 95000,
      recommendedPrice: '95,000+',
      aiPitch: 'Game engine with 380+ hours of world-building systems. Modular quest architecture. For developers creating adventure games.'
    }
  }
];

export default function KALA_AIMarketplace() {
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',fontFamily:'system-ui'}}>
      {/* HEADER WITH KALA.AI LOGO */}
      <header style={{padding:'4rem 2rem 3rem',textAlign:'center',background:'linear-gradient(180deg, #000 0%, #0a0a0a 100%)'}}>
        <div style={{position:'relative',display:'inline-block'}}>
          {/* K.AI LOGO */}
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
            color:'#000',
            boxShadow:'0 10px 30px rgba(255,107,53,0.3)'
          }}>
            K.AI
          </div>
          <h1 style={{
            fontSize:'4.5rem',
            fontWeight:'900',
            margin:'0 0 0.5rem',
            background:'linear-gradient(90deg, #FF6B35, #00E5E9)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
            letterSpacing:'-0.02em'
          }}>
            KALA.AI
          </h1>
        </div>
        <p style={{margin:'0',opacity:0.8,fontSize:'1.3rem',fontWeight:'300'}}>
          Time-Based Software Valuation Marketplace
        </p>
        <p style={{margin:'1rem auto 0',maxWidth:'700px',opacity:0.7,lineHeight:'1.6'}}>
          Proprietary software valued by actual development hours using KALA.AI Time Vault technology
        </p>
      </header>

      {/* KALA.AI ANALYSIS SHOWCASE */}
      <main style={{maxWidth:'1300px',margin:'0 auto',padding:'0 2rem 4rem'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}>
          <h2 style={{fontSize:'2.8rem',margin:'0 0 1rem',fontWeight:'700'}}>
            KALA.AI Valued Assets
          </h2>
          <p style={{opacity:0.8,maxWidth:'800px',margin:'0 auto',fontSize:'1.1rem'}}>
            Each repository analyzed by KalasTimeVault with hourly development tracking
          </p>
        </div>

        {/* REPOSITORY GRID */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(380px, 1fr))',gap:'2.5rem'}}>
          {KALA_AI_ANALYZED_REPOS.map((repo, index) => (
            <div key={index} style={{
              background:'linear-gradient(145deg, #111, #000)',
              borderRadius:'20px',
              padding:'2.5rem',
              border:'1px solid #222',
              position:'relative',
              overflow:'hidden'
            }}>
              {/* FOR SALE BADGE */}
              <div style={{
                position:'absolute',
                top:'20px',
                right:'-30px',
                background:'#FF6B35',
                color:'white',
                padding:'0.5rem 3rem',
                transform:'rotate(45deg)',
                fontWeight:'bold',
                fontSize:'0.9rem',
                boxShadow:'0 5px 15px rgba(255,107,53,0.3)'
              }}>
                KALA.VALUED
              </div>
              
              <h3 style={{
                fontSize:'2rem',
                margin:'0 0 1rem',
                color:'white',
                fontWeight:'800'
              }}>
                {repo.name}
              </h3>
              
              <p style={{opacity:0.9,marginBottom:'2rem',fontSize:'1.1rem',lineHeight:'1.6'}}>
                {repo.description}
              </p>
              
              {/* KALA.AI TIME ANALYSIS */}
              <div style={{
                background:'rgba(0,0,0,0.5)',
                padding:'1.5rem',
                borderRadius:'12px',
                marginBottom:'2rem',
                borderLeft:'4px solid #00E5E9'
              }}>
                <h4 style={{color:'#00E5E9',margin:'0 0 1.2rem',fontSize:'1.1rem',fontWeight:'600'}}>
                  KALA.AI TIME ANALYSIS
                </h4>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Development Hours</div>
                    <div style={{fontSize:'1.5rem',fontWeight:'bold'}}>{repo.kalaAnalysis.developmentHours}</div>
                  </div>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Hourly Rate</div>
                    <div style={{fontSize:'1.5rem',fontWeight:'bold'}}>${repo.kalaAnalysis.hourlyRate}/hr</div>
                  </div>
                </div>
              </div>
              
              {/* KALA.AI VALUATION */}
              <div style={{
                background:'rgba(255,107,53,0.1)',
                padding:'1.5rem',
                borderRadius:'12px',
                marginBottom:'2rem',
                border:'1px solid rgba(255,107,53,0.3)'
              }}>
                <h4 style={{color:'#FF6B35',margin:'0 0 1rem',fontSize:'1.1rem',fontWeight:'600'}}>
                  KALA.AI VALUATION
                </h4>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Minimum Valuation</div>
                    <div style={{fontSize:'2rem',fontWeight:'bold',color:'#FF6B35'}}>
                      ${repo.kalaAnalysis.minimumValuation.toLocaleString()}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.9rem',opacity:0.7}}>Recommended</div>
                    <div style={{fontSize:'1.2rem',fontWeight:'bold'}}>${repo.kalaAnalysis.recommendedPrice}</div>
                  </div>
                </div>
              </div>
              
              {/* KALA.AI GENERATED PITCH */}
              <div style={{marginBottom:'2rem'}}>
                <h4 style={{color:'white',margin:'0 0 1rem',fontSize:'1.1rem',fontWeight:'600'}}>
                  KALA.AI GENERATED PITCH
                </h4>
                <p style={{
                  background:'rgba(255,255,255,0.05)',
                  padding:'1.5rem',
                  borderRadius:'12px',
                  margin:0,
                  fontStyle:'italic',
                  lineHeight:'1.6',
                  border:'1px solid rgba(255,255,255,0.1)'
                }}>
                  "{repo.kalaAnalysis.aiPitch}"
                </p>
              </div>
              
              {/* ACTION */}
              <button style={{
                width:'100%',
                padding:'1.2rem',
                background:'linear-gradient(90deg, #FF6B35, #FF8B35)',
                color:'white',
                border:'none',
                borderRadius:'10px',
                fontWeight:'bold',
                fontSize:'1.1rem',
                cursor:'pointer',
                transition:'transform 0.2s'
              }}>
                CONTACT TO PURCHASE • ${repo.kalaAnalysis.recommendedPrice}
              </button>
            </div>
          ))}
        </div>

        {/* NOT AVAILABLE SECTION */}
        <div style={{
          marginTop:'5rem',
          padding:'2.5rem',
          background:'rgba(255,255,255,0.03)',
          borderRadius:'16px',
          textAlign:'center',
          border:'1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{color:'#999',margin:'0 0 0.5rem',fontSize:'1.3rem',fontWeight:'600'}}>
            Not Available for Purchase
          </h3>
          <p style={{opacity:0.7,margin:0,fontSize:'1.1rem'}}>
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
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <div style={{
            width:'60px',
            height:'60px',
            background:'linear-gradient(135deg, #FF6B35 0%, #00E5E9 100%)',
            borderRadius:'50%',
            margin:'0 auto 1.5rem',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'1.8rem',
            fontWeight:'900',
            color:'#000'
          }}>
            K
          </div>
          <p style={{margin:'0 0 0.5rem',fontSize:'1.3rem',fontWeight:'700'}}>
            KALA.AI
          </p>
          <p style={{margin:'0',opacity:0.7,fontSize:'1rem'}}>
            Time-Based Software Valuation • AI Analysis • Intelligent Pricing
          </p>
          <p style={{margin:'1rem 0 0',opacity:0.5,fontSize:'0.9rem'}}>
            © 2024 KALA.AI. All valuations calculated by KalasTimeVault proprietary technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
