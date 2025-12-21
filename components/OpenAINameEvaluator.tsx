'use client';

import { useState } from 'react';

const INVESTOR_PERSONAS = [
  {
    id: 'sarah',
    name: "Sarah Chen",
    title: "Enterprise VC (Sequoia Capital Partner)",
    avatar: "👩‍💼",
    focus: "Scalable B2B SaaS, clear unit economics"
  },
  {
    id: 'jake',
    name: "Jake Morrison", 
    title: "Web3/AI Investor (a16z Crypto)",
    avatar: "🧑‍💻",
    focus: "Cutting-edge AI, disruption, memorable"
  },
  {
    id: 'david',
    name: "David Kumar",
    title: "Corporate M&A (Google Cloud VP)", 
    avatar: "👨‍💼",
    focus: "Tech talent, clean technical names"
  },
  {
    id: 'maya',
    name: "Maya Rodriguez",
    title: "Technical Founder/Angel (YC Partner)",
    avatar: "👩‍🔬",
    focus: "Developer love, becomes a verb"
  },
  {
    id: 'richard',
    name: "Richard Blackwell",
    title: "Growth Equity (Tiger Global)",
    avatar: "🧔",
    focus: "Scales globally, professional"
  },
  {
    id: 'lisa',
    name: "Lisa Park",
    title: "Corporate Venture (Microsoft)",
    avatar: "👩‍💼",
    focus: "Enterprise-friendly, trustworthy"
  },
  {
    id: 'marcus',
    name: "Marcus Johnson",
    title: "Indie Founder (MicroConf)",
    avatar: "🧑‍🦱",
    focus: "Practical, clear value prop"
  }
];

interface Evaluation {
  score: number;
  verdict: 'thumbs_up' | 'thumbs_down';
  quote: string;
  error?: string;
}

export default function OpenAINameEvaluator() {
  const [companyName, setCompanyName] = useState('');
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const evaluateWithOpenAI = async () => {
    if (!companyName.trim()) return;
    
    setEvaluating(true);
    setEvaluations({});
    setOverallScore(null);
    
    const newEvaluations: Record<string, Evaluation> = {};
    let totalScore = 0;
    let completed = 0;
    
    // Evaluate each persona in parallel
    const promises = INVESTOR_PERSONAS.map(async (persona) => {
      try {
        const response = await fetch('/api/openai/evaluate-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            persona,
            businessType: 'AI-powered software marketplace that analyzes GitHub repos for valuation and sales'
          })
        });
        
        if (!response.ok) throw new Error('API failed');
        
        const data = await response.json();
        
        newEvaluations[persona.id] = {
          score: data.score,
          verdict: data.verdict,
          quote: data.quote
        };
        
        totalScore += data.score;
        completed++;
        
        // Update UI progressively
        setEvaluations({...newEvaluations});
        
      } catch (error) {
        newEvaluations[persona.id] = {
          score: 0,
          verdict: 'thumbs_down',
          quote: `"API error - check OpenAI configuration"`,
          error: 'Failed to evaluate'
        };
        setEvaluations({...newEvaluations});
      }
    });
    
    await Promise.all(promises);
    
    if (completed > 0) {
      setOverallScore(Math.round((totalScore / completed) * 10) / 10);
    }
    
    setEvaluating(false);
  };

  const getVerdictColor = (score: number) => {
    if (score >= 8) return '#00E5E9';
    if (score >= 6) return '#FFD166';
    return '#FF6B35';
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
      color: 'white',
      padding: '2.5rem',
      borderRadius: '20px',
      border: '1px solid #333',
      marginTop: '3rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #FF6B35, #00E5E9)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🎯
          </div>
          <h2 style={{ fontSize: '2.2rem', margin: 0 }}>AI Name Evaluator</h2>
        </div>
        <p style={{ opacity: 0.8, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          GPT-4 analyzes your company name through 7 investor personas. Uses your OpenAI API key from Vercel.
        </p>
      </div>
      
      {/* INPUT SECTION */}
      <div style={{ 
        background: 'rgba(30, 30, 30, 0.7)', 
        padding: '2rem', 
        borderRadius: '16px',
        marginBottom: '2.5rem',
        border: '1px solid #444'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>COMPANY NAME</div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Valur, Aestimo, CodeSovereign, CodeFlux, etc."
              style={{
                width: '100%',
                padding: '1.2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid #444',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.1rem',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>
          <button
            onClick={evaluateWithOpenAI}
            disabled={evaluating || !companyName.trim()}
            style={{
              padding: '1.2rem 2.5rem',
              background: evaluating ? '#555' : 'linear-gradient(90deg, #FF6B35, #FF8B35)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: evaluating ? 'not-allowed' : 'pointer',
              opacity: evaluating ? 0.7 : 1,
              minWidth: '200px',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => {
              if (!evaluating && companyName.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!evaluating && companyName.trim()) {
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {evaluating ? (
              <>
                <span style={{ display: 'inline-block', animation: 'pulse 1s infinite' }}>⚡</span>
                <span style={{ marginLeft: '0.5rem' }}>AI Evaluating...</span>
              </>
            ) : 'Submit to AI Panel'}
          </button>
        </div>
        
        {overallScore !== null && (
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            borderLeft: '4px solid ' + getVerdictColor(overallScore)
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>OVERALL AI SCORE</div>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'bold',
                  color: getVerdictColor(overallScore)
                }}>
                  {overallScore}/10
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                {overallScore >= 8 ? '✅ Strong name' : 
                 overallScore >= 6 ? '⚠️  Needs consideration' : 
                 '❌ Poor choice'}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* RESULTS GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.5rem'
      }}>
        {INVESTOR_PERSONAS.map((persona) => {
          const evaluation = evaluations[persona.id];
          
          return (
            <div 
              key={persona.id}
              style={{
                background: 'linear-gradient(145deg, #1a1a1a, #111)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #333',
                minHeight: '220px',
                transition: 'all 0.3s',
                opacity: evaluation ? 1 : 0.7
              }}
            >
              {/* PERSONA HEADER */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  marginRight: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  width: '55px',
                  height: '55px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {persona.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>{persona.name}</h3>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: '1.3' }}>{persona.title}</div>
                </div>
              </div>
              
              {/* FOCUS */}
              <div style={{ 
                fontSize: '0.85rem', 
                opacity: 0.8, 
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                Focus: {persona.focus}
              </div>
              
              {/* EVALUATION RESULTS */}
              {evaluating && !evaluation ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ 
                    fontSize: '1.5rem',
                    animation: 'pulse 1.5s infinite',
                    marginBottom: '0.5rem'
                  }}>
                    {persona.id === 'jake' ? '🤖' : 
                     persona.id === 'maya' ? '⚡' : '🌀'}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>GPT-4 analyzing...</div>
                </div>
              ) : evaluation ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: getVerdictColor(evaluation.score),
                      marginRight: '1rem'
                    }}>
                      {evaluation.score}/10
                    </div>
                    <div style={{ 
                      fontSize: '2rem',
                      color: evaluation.verdict === 'thumbs_up' ? getVerdictColor(evaluation.score) : '#FF6B35'
                    }}>
                      {evaluation.verdict === 'thumbs_up' ? '👍' : '👎'}
                    </div>
                  </div>
                  <div style={{ 
                    fontStyle: 'italic',
                    opacity: 0.9,
                    padding: '0.75rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    borderLeft: '3px solid ' + getVerdictColor(evaluation.score)
                  }}>
                    {evaluation.quote}
                  </div>
                  {evaluation.error && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#FF6B35', 
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255,107,53,0.1)',
                      borderRadius: '4px'
                    }}>
                      {evaluation.error}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', opacity: 0.5 }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>⏳</div>
                  <div>Enter name to evaluate</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* FOOTER NOTE */}
      <div style={{ 
        marginTop: '2.5rem',
        padding: '1.5rem',
        background: 'rgba(0, 229, 233, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 229, 233, 0.2)',
        fontSize: '0.9rem',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span>🤖</span>
          <span>Powered by OpenAI GPT-4 using your Vercel environment variable</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}