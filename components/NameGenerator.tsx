'use client';

import { useState } from 'react';

export default function NameGenerator() {
  const [generating, setGenerating] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'fallback'>('unknown');
  const [criteria, setCriteria] = useState({
    style: 'aggressive',
    length: 'short'
  });

  const generateNames = async () => {
    setGenerating(true);
    setGeneratedNames([]);
    setApiStatus('unknown');

    try {
      const response = await fetch('/api/openai/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criteria,
          business: 'AI-powered software marketplace for GitHub repos'
        })
      });

      const data = await response.json();
      
      if (data.names) {
        setGeneratedNames(data.names);
        setApiStatus(data.fallback ? 'fallback' : 'working');
        
        if (data.fallback) {
          console.warn('Using fallback names:', data.error);
        }
      } else {
        throw new Error(data.error || 'No names generated');
      }
    } catch (error: any) {
      console.error('Failed to generate names:', error);
      // Fallback names if everything fails
      setGeneratedNames([
        'CodeShark', 'GitHunter', 'RepoValue', 'DevVault',
        'BytePrice', 'SourceValue', 'ValurDev', 'ApexCode'
      ]);
      setApiStatus('fallback');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ 
      marginTop: '3rem',
      padding: '2rem',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '16px',
      border: '1px solid #333'
    }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🚀 AI Name Generator</h3>
      <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
        Click to generate available .dev domain names for your software marketplace
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select 
          value={criteria.style}
          onChange={(e) => setCriteria({...criteria, style: e.target.value})}
          style={{ padding: '0.75rem', background: '#111', color: 'white', border: '1px solid #444', borderRadius: '8px' }}
        >
          <option value="aggressive">Aggressive (Shark, Hunter)</option>
          <option value="modern">Modern (Tech, AI)</option>
          <option value="professional">Professional</option>
        </select>
        
        <button
          onClick={generateNames}
          disabled={generating}
          style={{
            padding: '0.75rem 2rem',
            background: generating ? '#555' : 'linear-gradient(90deg, #00E5E9, #FF6B35)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: generating ? 'not-allowed' : 'pointer',
            minWidth: '200px'
          }}
        >
          {generating ? '🤖 Generating...' : 'Generate Names'}
        </button>
      </div>
      
      {/* Status Indicator */}
      {apiStatus !== 'unknown' && (
        <div style={{ 
          padding: '0.75rem', 
          background: apiStatus === 'working' ? 'rgba(0,229,233,0.1)' : 'rgba(255,107,53,0.1)',
          border: `1px solid ${apiStatus === 'working' ? '#00E5E9' : '#FF6B35'}`,
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {apiStatus === 'working' ? (
            <>✅ Using OpenAI GPT (Vercel environment)</>
          ) : (
            <>⚠️ Using fallback names (check OpenAI key in Vercel)</>
          )}
        </div>
      )}
      
      {/* Results */}
      {generatedNames.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Generated Names</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            {generatedNames.map((name, index) => (
              <a
                key={index}
                href={`https://www.namecheap.com/domains/registration/results/?domain=${name.toLowerCase().replace(/\s+/g, '')}.dev`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,107,53,0.1)';
                  e.currentTarget.style.borderColor = '#FF6B35';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = '#444';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {name}
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>
                  {name.toLowerCase().replace(/\s+/g, '')}.dev
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {!generating && generatedNames.length === 0 && (
        <div style={{ 
          padding: '1.5rem', 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: '12px',
          textAlign: 'center',
          opacity: 0.7
        }}>
          Click "Generate Names" to create available .dev domain names
        </div>
      )}
    </div>
  );
}