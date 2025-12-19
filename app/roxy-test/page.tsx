'use client';

import { useState } from 'react';
import { RoxyVoice } from '@/app/lib/roxy/voice';

export default function RoxyTestPage() {
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const testVoice = async () => {
    setPlaying(true);
    const roxy = new RoxyVoice();
    const url = await roxy.speak("Hey. I'm Roxy. Let's make a deal.");
    setAudioUrl(url);
    setPlaying(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Roxy Voice</h1>
      <button 
        onClick={testVoice}
        disabled={playing}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: playing ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: playing ? 'not-allowed' : 'pointer',
        }}
      >
        {playing ? 'Speaking...' : 'Hear Roxy'}
      </button>

      {audioUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Audio Player</h3>
          <audio controls src={audioUrl} autoPlay />
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Roxy says: &ldquo;Hey. I'm Roxy. Let's make a deal.&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}