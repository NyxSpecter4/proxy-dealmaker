export default function Home() {
  return (
    <div style={{padding:'2rem',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',padding:'2rem 0',borderBottom:'2px solid #000'}}>
        <h1 style={{margin:0,fontSize:'3rem'}}>KALA.AI</h1>
        <p style={{margin:'0.5rem 0 0',fontSize:'1.2rem',color:'#666'}}>
          The Intelligent Auction Platform
        </p>
      </header>
      <main style={{maxWidth:'800px',margin:'3rem auto'}}>
        <h2>Auction with <span style={{color:'#FF6B35'}}>Intelligence</span></h2>
        <p>Time Valuation Engine • Auction Restart Logic • Deal Architecture</p>
        <div style={{background:'#f5f5f5',padding:'2rem',borderRadius:'12px',marginTop:'2rem'}}>
          <h3>✅ KALA.AI SYSTEMS ACTIVE</h3>
          <p><strong>KalasTimeVault:</strong> Tracking development hours at $100/hr</p>
          <p><strong>KalaAuctionEngine:</strong> Intelligent auction restart logic active</p>
          <p><strong>DealArchitect:</strong> Complex deal packaging ready</p>
        </div>
      </main>
      <footer style={{textAlign:'center',padding:'2rem',borderTop:'1px solid #eee',marginTop:'3rem'}}>
        <p>© 2024 KALA.AI. All intelligence reserved.</p>
      </footer>
    </div>
  );
}
