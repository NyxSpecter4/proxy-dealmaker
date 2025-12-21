export default function KalaLogo() {
  return (
    <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 2rem' }}>
      {/* Outer ring - animated */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #FF6B35, #00E5E9, #FF6B35)',
        animation: 'spin 3s linear infinite',
        filter: 'blur(0px)'
      }} />
      
      {/* Middle ring */}
      <div style={{
        position: 'absolute',
        width: '85%',
        height: '85%',
        top: '7.5%',
        left: '7.5%',
        borderRadius: '50%',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* AI Symbol */}
        <div style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          background: 'linear-gradient(45deg, #FF6B35, #00E5E9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-3px'
        }}>
          AI
        </div>
      </div>
      
      {/* KALA text around */}
      <div style={{
        position: 'absolute',
        width: '130%',
        height: '130%',
        top: '-15%',
        left: '-15%',
        animation: 'orbit 8s linear infinite'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#FF6B35'
        }}>K</div>
        <div style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#00E5E9'
        }}>A</div>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#FF6B35'
        }}>L</div>
        <div style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#00E5E9'
        }}>A</div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}