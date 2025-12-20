import { KalasTimeVault } from '../../../lib/time-valuation';

export type DealComponent = 'CASH' | 'EQUITY' | 'ROYALTY' | 'CONSULTING' | 'IP_LICENSE';

export interface KalaDealPackage {
  id: string;
  assetId: string;
  components: DealComponent[];
  valuation: number; // From KalasTimeVault
  terms: Record<string, any>;
  auctionStrategy: {
    initialPrice: number;
    restartConditions: string[]; // Links to KalaAuctionEngine
    targetBuyerProfiles: ('VC' | 'STRATEGIC' | 'INDUSTRY' | 'COMPETITOR')[];
  };
}

export class DealArchitect {
  constructor(private timeVault: KalasTimeVault) {}

  createPackage(
    asset: { type: string; metadata: any },
    sellerPreferences: { minCash: number; openToEquity: boolean }
  ): KalaDealPackage {
    const baseValuation = this.timeVault.calculateMinimumValuation();
    
    return {
      id: `deal_${Date.now()}`,
      assetId: asset.metadata.id,
      components: this.determineComponents(sellerPreferences),
      valuation: this.calculateDealValuation(baseValuation, asset),
      terms: this.generateSmartContractTerms(asset),
      auctionStrategy: {
        initialPrice: baseValuation * 0.7, // Start below valuation to drive interest
        restartConditions: [
          'NO_BIDS_24H',
          'TOP_BID_BELOW_VALUATION',
          'LESS_THAN_THREE_BIDDERS'
        ],
        targetBuyerProfiles: this.identifyIdealBuyers(asset)
      }
    };
  }
  
  private determineComponents(prefs: { minCash: number; openToEquity: boolean }): DealComponent[] {
    const components: DealComponent[] = ['CASH'];
    if (prefs.openToEquity) {
      components.push('EQUITY');
    }
    // Always include royalty and IP license for tech assets
    components.push('ROYALTY', 'IP_LICENSE');
    // Add consulting if seller has expertise
    components.push('CONSULTING');
    return components;
  }
  
  private calculateDealValuation(baseValuation: number, asset: { type: string; metadata: any }): number {
    let multiplier = 1.0;
    // Adjust based on asset type
    if (asset.type === 'software') multiplier *= 1.5;
    if (asset.type === 'data') multiplier *= 2.0;
    if (asset.type === 'brand') multiplier *= 0.8;
    
    // Adjust based on market demand (simulated)
    const marketDemand = asset.metadata.demand || 1;
    multiplier *= marketDemand;
    
    return Math.round(baseValuation * multiplier);
  }
  
  private generateSmartContractTerms(asset: { type: string; metadata: any }): Record<string, any> {
    return {
      escrowRequired: true,
      paymentSchedule: {
        upfront: 0.3,
        milestone1: 0.3,
        milestone2: 0.2,
        final: 0.2
      },
      ipTransfer: 'upon_full_payment',
      nonCompete: asset.type === 'software' ? 24 : 12, // months
      disputeResolution: 'arbitration',
      governingLaw: 'Delaware, USA'
    };
  }
  
  private identifyIdealBuyers(asset: { type: string; metadata: any }): ('VC' | 'STRATEGIC' | 'INDUSTRY' | 'COMPETITOR')[] {
    const profiles: ('VC' | 'STRATEGIC' | 'INDUSTRY' | 'COMPETITOR')[] = [];
    if (asset.type === 'software') {
      profiles.push('VC', 'STRATEGIC', 'INDUSTRY');
    } else if (asset.type === 'data') {
      profiles.push('STRATEGIC', 'INDUSTRY');
    } else if (asset.type === 'brand') {
      profiles.push('STRATEGIC', 'COMPETITOR');
    }
    // Always include VC for high-growth potential
    if (!profiles.includes('VC')) profiles.push('VC');
    return profiles;
  }
}