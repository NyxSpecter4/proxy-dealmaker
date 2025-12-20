export default function KALASplashPage() {
  const projects = [
    {
      name: "KalasTimeVault",
      status: "🟢 ACTIVE",
      description: "Time valuation engine. Tracks development hours at $100/hr with intelligent minimum pricing.",
      tech: "TypeScript • Singleton Pattern • Local Storage"
    },
    {
      name: "KalaAuctionEngine", 
      status: "🟢 ACTIVE",
      description: "Intelligent auction restart system. Detects failed bids and auto-restarts with 15% smarter pricing.",
      tech: "TypeScript • Collision Detection • Game Theory"
    },
    {
      name: "DealArchitect",
      status: "🟢 ACTIVE",
      description: "Complex deal structuring. Packages cash, equity, royalty, and partnership components.",
      tech: "TypeScript • JSON Schema • Smart Contracts"
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* HEADER */}
      <header style={{
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          margin: '0 0 0.5rem',
          background: 'linear-gradient(90deg, #FF6B35, #00E5E9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          KALA.AI
        </h1>
        <p style={{
          fontSize: '1.5rem',
          opacity: 0.9,
          margin: '0 0 1rem'
        }}>
          The Intelligence Behind Modern Auctions
        </p>
        <p style={{
          maxWidth: '600px',
          margin: '0 auto',
          opacity: 0.7,
          lineHeight: '1.6'
        }}>
          Time valuation. Auction restart intelligence. Complex deal architecture.
        </p>
      </header>

      {/* PROJECTS SHOWCASE */}
      <main style={{
        padding: '3rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          Core Intelligence Systems
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {projects.map((project, index) => (
            <div key={index} style={{
              background: 'rgba(30, 41, 59, 0.7)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.2s'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  margin: '0',
                  color: '#FF6B35'
                }}>
                  {project.name}
                </h3>
                <span style={{
                  background: 'rgba(0, 229, 233, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  border: '1px solid #00E5E9'
                }}>
                  {project.status}
                </span>
              </div>
              
              <p style={{
                opacity: 0.9,
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                {project.description}
              </p>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {project.tech.split('•').map((item, i) => (
                  <span key={i} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* COMPANY INFO */}
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 107, 53, 0.3)'
        }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
            Intelligent Auction Platform
          </h2>
          <p style={{
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            KALA.AI transforms auction mechanics with time-based valuation and AI-driven restart intelligence. 
            Every failed auction becomes smarter. Every hour of development is accounted for.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button style={{
              padding: '1rem 2rem',
              background: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View Live Demos
            </button>
            <button style={{
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#00E5E9',
              border: '2px solid #00E5E9',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Contact for Enterprise
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        opacity: 0.7
      }}>
        <p style={{ margin: '0 0 0.5rem' }}>
          © 2024 KALA.AI. All intelligence reserved.
        </p>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Time Valuation Engine • Auction Restart Intelligence • Deal Architecture
        </p>
      </footer>
    </div>
  );
}
