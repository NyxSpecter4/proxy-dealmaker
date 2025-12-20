// app/page.tsx - UPDATED WITH SECRETS REMOVED
'use client';

import { BRAND } from '@/lib/constants/brand';

export default function KALACompanyWebsite() {
  const projects = [
    {
      name: 'Time Valuation System',
      description: 'Proprietary system for quantifying development investment and project worth.',
      tech: ['TypeScript', 'Advanced Algorithms', 'Secure Architecture'],
      status: 'Active',
      category: 'Core Technology'
    },
    {
      name: 'Intelligence Engine',
      description: 'AI-powered systems with adaptive learning and pattern recognition capabilities.',
      tech: ['TypeScript', 'Machine Learning', 'Real-time Processing'],
      status: 'Active',
      category: 'AI Development'
    },
    {
      name: 'Deal Architecture Platform',
      description: 'Framework for structuring complex business arrangements and partnerships.',
      tech: ['TypeScript', 'Modular Design', 'Enterprise Security'],
      status: 'Active',
      category: 'Business Technology'
    },
    {
      name: 'KALA.AI Brand System',
      description: 'Complete brand identity and design system for technology platforms.',
      tech: ['React', 'TypeScript', 'Design Systems', 'Component Architecture'],
      status: 'Complete',
      category: 'Brand Development'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6
    }}>
      {/* HERO - NO SECRETS */}
      <section style={{
        padding: '6rem 2rem 4rem',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #333',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            margin: '0 0 1rem',
            background: 'linear-gradient(90deg, #FF6B35, #00E5E9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}>
            KALA.AI
          </h1>
          <p style={{
            fontSize: '1.5rem',
            margin: '0 0 2rem',
            opacity: 0.9,
            fontWeight: '300'
          }}>
            Proprietary Technology Development
          </p>
          <p style={{
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            opacity: 0.8,
            lineHeight: 1.7
          }}>
            Building secure, intelligent systems with proprietary architectures and measurable outcomes.
          </p>
        </div>
      </section>

      {/* WHAT WE DO - NO SECRETS */}
      <section style={{ padding: '5rem 2rem', background: '#111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', margin: '0 0 3rem' }}>
            What We Build
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: '#1a1a1a', borderRadius: '12px' }}>
              <h3 style={{ color: BRAND.COLORS.accent, margin: '0 0 1rem' }}>Proprietary Technology</h3>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Custom-built systems with unique algorithms that deliver competitive advantages.
              </p>
            </div>
            <div style={{ padding: '2rem', background: '#1a1a1a', borderRadius: '12px' }}>
              <h3 style={{ color: BRAND.COLORS.accent, margin: '0 0 1rem' }}>Secure Architecture</h3>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Enterprise-grade systems with encryption, secure data handling, and protected IP.
              </p>
            </div>
            <div style={{ padding: '2rem', background: '#1a1a1a', borderRadius: '12px' }}>
              <h3 style={{ color: BRAND.COLORS.accent, margin: '0 0 1rem' }}>Intelligent Systems</h3>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Technology that learns, adapts, and delivers measurable business outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS - NO SECRETS */}
      <section style={{ padding: '5rem 2rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', margin: '0 0 3rem' }}>
            Technology Portfolio
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {projects.map((project, index) => (
              <div key={index} style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: '0', color: 'white' }}>
                    {project.name}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(0, 200, 83, 0.1)',
                    color: '#00C853',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    {project.category}
                  </span>
                </div>
                <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {project.tech.map((tech, i) => (
                    <span key={i} style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      border: '1px solid #333'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '5rem 2rem', background: '#111', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>Build With Us</h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>
            Interested in proprietary technology solutions?
          </p>
          <div style={{
            padding: '2rem',
            background: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <p style={{ margin: '0 0 1rem', fontWeight: '600' }}>Contact</p>
            <p style={{ margin: '0', opacity: 0.9 }}>Via secure channels</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 2rem', background: '#000', textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
          KALA.AI
        </p>
        <p style={{ margin: '0', opacity: 0.5, fontSize: '0.9rem' }}>
          Proprietary Technology Development
        </p>
      </footer>
    </div>
  );
}
