// app/page.tsx - KALA.AI COMPANY WEBSITE
'use client';

import { BRAND } from '@/lib/constants/brand';
import { useState, useEffect } from 'react';

interface Project {
  name: string;
  description: string;
  tech: string[];
  status: 'Active' | 'Complete' | 'In Development';
  value?: string;
  github?: string;
}

export default function KALACompanyWebsite() {
  const [projects, setProjects] = useState<Project[]>([
    {
      name: 'Time Valuation System',
      description: 'Intelligent system that calculates project value based on development hours at $100/hr. Tracks and certifies developer time investment.',
      tech: ['TypeScript', 'Singleton Pattern', 'Local Storage', 'Encryption'],
      status: 'Active',
      value: 'Core IP',
      github: 'https://github.com/yourusername/time-valuation'
    },
    {
      name: 'Auction Intelligence Engine',
      description: 'AI-powered auction system with restart logic. Analyzes bid patterns and automatically enhances failed auctions.',
      tech: ['TypeScript', 'Game Theory', 'Collision Detection', 'Real-time Analytics'],
      status: 'Active',
      value: 'Proprietary Algorithm',
      github: 'https://github.com/yourusername/auction-engine'
    },
    {
      name: 'Deal Architecture Platform',
      description: 'Framework for structuring complex deals with equity, cash, royalty, and partnership components.',
      tech: ['TypeScript', 'JSON Schema', 'Smart Contracts', 'Modular Design'],
      status: 'Active',
      value: 'Enterprise Solution',
      github: 'https://github.com/yourusername/deal-architect'
    },
    {
      name: 'KALA.AI Brand System',
      description: 'Complete brand identity and design system for intelligent technology platforms.',
      tech: ['React', 'TypeScript', 'Design Tokens', 'Component Library'],
      status: 'Complete',
      value: 'Brand Assets',
      github: 'https://github.com/yourusername/kala-brand'
    }
  ]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6
    }}>
      {/* HERO SECTION */}
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
            Intelligent Systems Development
          </p>
          <p style={{
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            opacity: 0.8,
            lineHeight: 1.7
          }}>
            Building proprietary technology systems with time-based valuation and intelligent architecture. 
            Every hour coded translates to measurable enterprise value.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#projects" style={{
              padding: '1rem 2rem',
              background: BRAND.COLORS.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              View Our Work
            </a>
            <a href="mailto:contact@kala.ai" style={{
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section style={{ padding: '5rem 2rem', background: '#111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            margin: '0 0 3rem',
            fontWeight: '700'
          }}>
            What We Build
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ padding: '2rem', background: '#1a1a1a', borderRadius: '12px' }}>
              <h3 style={{ color: BRAND.COLORS.accent, margin: '0 0 1rem' }}>Proprietary Technology</h3>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Custom-built systems with unique algorithms and business logic that can't be bought off the shelf.
              </p>
            </div>
            <div style={{ padding: '2rem', background: '#1a1a1a', borderRadius: '12px' }}>
              <h3 style={{ color: BRAND.COLORS.accent, margin: '0 0 1rem' }}>Time-Based Valuation</h3>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Every project is valued by actual development hours at $100/hr, ensuring fair pricing and transparent value.
              </p>
            </div>
            <div style={{ padding: '2rem', background: '#1a1a1a', borderRadius: '12px' }}>
              <h3 style={{ color: BRAND.COLORS.accent, margin: '0 0 1rem' }}>Intelligent Architecture</h3>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Systems that learn, adapt, and improve over time using data patterns and machine intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SHOWCASE */}
      <section id="projects" style={{ padding: '5rem 2rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            margin: '0 0 3rem',
            fontWeight: '700'
          }}>
            Our Technology Portfolio
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {projects.map((project, index) => (
              <div key={index} style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #333'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    margin: '0',
                    color: 'white'
                  }}>
                    {project.name}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: project.status === 'Active' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                    color: project.status === 'Active' ? '#00C853' : '#FFC107',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    border: `1px solid ${project.status === 'Active' ? '#00C853' : '#FFC107'}`
                  }}>
                    {project.status}
                  </span>
                </div>
                
                <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
                  {project.description}
                </p>
                
                <div style={{ marginBottom: '1.5rem' }}>
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
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #333'
                }}>
                  {project.value && (
                    <span style={{ fontWeight: '600', color: BRAND.COLORS.accent }}>
                      {project.value}
                    </span>
                  )}
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#58a6ff',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      View on GitHub →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '5rem 2rem', background: '#111', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>Let's Build Together</h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>
            Interested in proprietary technology development?<br />
            Need intelligent systems for your business?
          </p>
          <a href="mailto:contact@kala.ai" style={{
            padding: '1rem 2.5rem',
            background: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.1rem',
            display: 'inline-block'
          }}>
            contact@kala.ai
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '3rem 2rem',
        background: '#000',
        textAlign: 'center',
        borderTop: '1px solid #333'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
            KALA.AI
          </p>
          <p style={{ margin: '0 0 1rem', opacity: 0.7 }}>
            Intelligent Systems Development Company
          </p>
          <p style={{ margin: '0', opacity: 0.5, fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} KALA.AI. All proprietary technology and intellectual property rights reserved.
          </p>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.5, fontSize: '0.9rem' }}>
            Time Valuation • Intelligent Architecture • Proprietary Development
          </p>
        </div>
      </footer>
    </div>
  );
}
