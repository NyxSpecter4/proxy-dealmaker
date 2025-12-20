/**
 * The core of KALA.AI's brilliance: Failed auctions become learning opportunities
 */

export interface AuctionBid {
  id: string;
  amount: number;
  bidderProfile: {
    type: 'vc' | 'strategic' | 'competitor' | 'unknown';
    previousDeals: string[];
    riskTolerance: number; // 1-10
  };
  timestamp: Date;
  notes: string;
}

export class KalaAuctionEngine {
  private restartCount: number = 0;
  private bids: AuctionBid[] = [];
  private minimumPrice: number;
  
  constructor(minimumPrice: number) {
    this.minimumPrice = minimumPrice;
  }
  
  // Each failed auction makes the next one smarter
  processBid(bid: AuctionBid): 'ACCEPTED' | 'RESTART_WITH_ENHANCEMENTS' {
    this.bids.push(bid);
    
    // Rule 1: No bid meets minimum valuation
    if (bid.amount < this.minimumPrice) {
      return this.prepareRestart('PRICE_TOO_LOW', bid);
    }
    
    // Rule 2: Suspicious bid clustering (possible collusion)
    if (this.detectBidCollusion()) {
      return this.prepareRestart('SUSPICIOUS_PATTERNS', bid);
    }
    
    // Rule 3: Only one bidder (no competition)
    if (this.bids.length <= 1) {
      return this.prepareRestart('NO_COMPETITION', bid);
    }
    
    return 'ACCEPTED';
  }
  
  private prepareRestart(reason: string, lastBid: AuctionBid): 'RESTART_WITH_ENHANCEMENTS' {
    this.restartCount++;
    
    // Learn from the failed bid
    const enhancements = this.generateEnhancements(lastBid);
    
    // Update minimum price based on market feedback
    this.minimumPrice = this.recalculateMinimumPrice();
    
    // Log the intelligence gained
    console.log(`
      🔄 KALA.AI AUCTION RESTART #${this.restartCount}
      Reason: ${reason}
      Intelligence Gained:
      ${enhancements.map(e => `  • ${e}`).join('\n')}
      New Minimum: $${this.minimumPrice}
    `);
    
    return 'RESTART_WITH_ENHANCEMENTS';
  }
  
  private generateEnhancements(lastBid: AuctionBid): string[] {
    const enhancements = [];
    
    // Enhancement 1: Add features bidder wanted
    if (lastBid.notes.includes('feature')) {
      enhancements.push('Added requested features from bidder feedback');
    }
    
    // Enhancement 2: Target different buyer profile
    if (lastBid.bidderProfile.riskTolerance < 5) {
      enhancements.push('Now targeting higher risk-tolerance investors');
    }
    
    // Enhancement 3: Package restructuring
    if (lastBid.amount < this.minimumPrice * 0.7) {
      enhancements.push('Created tiered pricing packages');
    }
    
    return enhancements;
  }
  
  private detectBidCollusion(): boolean {
    // Analyze bid timing and amounts for patterns
    if (this.bids.length < 3) return false;
    
    const amounts = this.bids.map(b => b.amount);
    const avg = amounts.reduce((a, b) => a + b) / amounts.length;
    
    // If all bids cluster within 10%, suspicious
    const variance = amounts.map(a => Math.abs(a - avg) / avg);
    return variance.every(v => v < 0.1);
  }
  
  private recalculateMinimumPrice(): number {
    // KALA.AI magic: Each restart increases value based on intelligence
    const intelligenceMultiplier = 1 + (this.restartCount * 0.15);
    return this.minimumPrice * intelligenceMultiplier;
  }
}