'use client';

import { useState } from 'react';

export default function OneClickNames() {
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [source, setSource] = useState<string>('');

  const generateNames = async () => {
    setLoading(true);
    setNames([]);
    
    try {
      const response = await fetch('/api/ai-names');
      const data = await response.json();
      
      setNames(data.names || []);
      setSource(data.source || 'unknown');
    } catch (error) {
      setNames(['CodeShark', 'GitHunter', 'RepoValue', 'DevVault', 'BytePrice']);
      setSource('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      marginTop: '3rem',
      padding: '2rem',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '16px',
      border: '1px solid #333',
      textAlign: 'center'
    }}>
      <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
        🚀 AI Name Generator
      </h3>
      <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
        One click. 15 names. 7 AI investors analyzing.
      </p>
      
      <button
        onClick={generateNames}
        disabled={loading}
        style={{
          padding: '1rem 3rem',
          background: loading ? '#555' : 'linear-gradient(90deg, #FF6B35, #00E5E9)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          minWidth: '250px',
          marginBottom: '1.5rem'
        }}
      >
        {loading ? '🤖 7 AIs Thinking...' : 'Generate 15 Names →'}
      </button>
      
      {source && (
        <div style={{ 
          padding: '0.75rem', 
          background: source === 'OpenAI GPT-3.5' ? 'rgba(0,229,233,0.1)' : 'rgba(255,107,53,0.1)',
          border: `1px solid ${source === 'OpenAI GPT-3.5' ? '#00E5E9' : '#FF6B35'}`,
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {source === 'OpenAI GPT-3.5' ? '✅ Using your OpenAI key from Vercel' : '⚠️ Using fallback names'}
        </div>
      )}
      
      {names.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '1rem' }}>AI-Generated Names ({names.length})</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '0.75rem',
            textAlign: 'left'
          }}>
            {names.map((name, index) => (
              <a
                key={index}
                href={`https://www.namecheap.com/domains/registration/results/?domain=${name.toLowerCase()}.dev`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '500' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>
                  {name.toLowerCase()}.dev
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {!loading && names.length === 0 && (
        <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>
          Click button to generate names using 7 AI investor personas
        </div>
      )}
    </div>
  );
}