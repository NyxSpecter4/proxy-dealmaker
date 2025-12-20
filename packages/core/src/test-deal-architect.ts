// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  const localStorageMock = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key] || null;
    },
    setItem(key: string, value: string) {
      this.store[key] = value;
    },
    clear() {
      this.store = {};
    }
  };
  (global as any).localStorage = localStorageMock;
  (global as any).btoa = (str: string) => Buffer.from(str).toString('base64');
}

import { DealArchitect } from './deal-architect';
import { KalasTimeVault } from '../../../lib/time-valuation';

function testDealArchitect() {
  console.log('Testing DealArchitect...');
  
  const vault = KalasTimeVault.getInstance();
  // Log some hours to have a valuation
  vault.logHours('development', 40);
  vault.logHours('research', 20);
  
  const architect = new DealArchitect(vault);
  
  const asset = {
    type: 'software',
    metadata: { id: 'asset_123', demand: 1.2 }
  };
  
  const sellerPrefs = {
    minCash: 50000,
    openToEquity: true
  };
  
  const dealPackage = architect.createPackage(asset, sellerPrefs);
  
  console.log('Created deal package:');
  console.log('ID:', dealPackage.id);
  console.log('Asset ID:', dealPackage.assetId);
  console.log('Components:', dealPackage.components);
  console.log('Valuation:', dealPackage.valuation);
  console.log('Initial Price:', dealPackage.auctionStrategy.initialPrice);
  console.log('Target Buyers:', dealPackage.auctionStrategy.targetBuyerProfiles);
  console.log('Terms:', JSON.stringify(dealPackage.terms, null, 2));
  
  // Validate structure
  if (!dealPackage.id.startsWith('deal_')) {
    throw new Error('Invalid deal ID');
  }
  if (dealPackage.components.length < 3) {
    throw new Error('Missing deal components');
  }
  if (dealPackage.valuation <= 0) {
    throw new Error('Invalid valuation');
  }
  
  console.log('All tests passed!');
}

try {
  testDealArchitect();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}