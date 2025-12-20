/**
 * SECRET: Never commit real hours to git. This calculates your asset's base value.
 * RULE: 1 hour of your time = $100 minimum valuation multiplier
 */

export class KalasTimeVault {
  private static instance: KalasTimeVault;
  private hoursLogged: Map<string, number> = new Map();
  private hourlyRate: number = 100;
  
  private constructor() {} // Singleton - your time is unique
  
  static getInstance(): KalasTimeVault {
    if (!KalasTimeVault.instance) {
      KalasTimeVault.instance = new KalasTimeVault();
    }
    return KalasTimeVault.instance;
  }
  
  // Call this discreetly after each work session
  logHours(activity: 'development' | 'research' | 'negotiation', hours: number): void {
    const current = this.hoursLogged.get(activity) || 0;
    this.hoursLogged.set(activity, current + hours);
    
    // Encrypt and store locally only
    this.encryptToLocalStorage();
  }
  
  calculateMinimumValuation(multiplier: number = 2.5): number {
    const totalHours = Array.from(this.hoursLogged.values())
      .reduce((sum, hours) => sum + hours, 0);
    
    return totalHours * this.hourlyRate * multiplier;
  }
  
  generateTimeBackedProposal(): string {
    const valuation = this.calculateMinimumValuation();
    return `
      KALA.AI ASSET VALUATION
      ------------------------
      Time-Invested: ${this.getTotalHours()} hours
      Hourly Rate: $${this.hourlyRate}
      Minimum Viable Price: $${valuation}
      
      "Each hour woven into this code has been measured.
       The price reflects the mortality of time well spent."
    `;
  }
  
  private getTotalHours(): number {
    return Array.from(this.hoursLogged.values()).reduce((a, b) => a + b, 0);
  }
  
  private encryptToLocalStorage(): void {
    // Simple obfuscation - consider actual encryption for production
    const data = JSON.stringify(Array.from(this.hoursLogged.entries()));
    const encoded = btoa(data);
    localStorage.setItem('kala_time_vault', encoded);
  }
}