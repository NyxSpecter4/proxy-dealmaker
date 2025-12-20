// Test script for market intelligence integration
import { MarketIntelligenceEngine } from './lib/intelligence/market-analyzer';

async function testMarketIntelligence() {
  console.log('Testing Market Intelligence Engine...\n');
  
  // Test case 1: Gaming project
  const gamingProject = {
    name: 'bountywarz',
    description: 'A competitive gaming platform with tournament features',
    category: 'gaming',
    githubData: {
      stargazers_count: 150,
      updated_at: '2024-12-01T00:00:00Z',
      open_issues_count: 5,
      has_wiki: true
    }
  };
  
  console.log('Test 1: Gaming Project (bountywarz)');
  const gamingIntel = await MarketIntelligenceEngine.analyzeProject(gamingProject);
  console.log('Total Addressable Market:', gamingIntel.totalAddressableMarket.estimate, 'Billion');
  console.log('Growth Rate:', gamingIntel.totalAddressableMarket.growthRate, '%');
  console.log('Competitors:', gamingIntel.competitiveLandscape.directCompetitors.length);
  console.log('Market Share Estimate:', gamingIntel.competitiveLandscape.marketShareEstimate.toFixed(2), '%');
  console.log('Willingness to Pay:', gamingIntel.nicheAnalysis.willingnessToPay);
  console.log('Technical Risk:', gamingIntel.riskAssessment.technicalRisk);
  console.log('Strategic Buyers:', gamingIntel.valueExtraction.strategicBuyers.slice(0, 2));
  console.log('---\n');
  
  // Test case 2: AI/ML project
  const aiProject = {
    name: 'ml-pipeline',
    description: 'Machine learning pipeline for data processing',
    category: 'ai-ml',
    githubData: {
      stargazers_count: 500,
      updated_at: '2024-11-15T00:00:00Z',
      open_issues_count: 2,
      has_wiki: true
    }
  };
  
  console.log('Test 2: AI/ML Project');
  const aiIntel = await MarketIntelligenceEngine.analyzeProject(aiProject);
  console.log('Total Addressable Market:', aiIntel.totalAddressableMarket.estimate, 'Billion');
  console.log('Growth Rate:', aiIntel.totalAddressableMarket.growthRate, '%');
  console.log('Monetization Models:', aiIntel.valueExtraction.monetizationModels.map(m => m.model));
  console.log('Acquisition Multiples:', aiIntel.valueExtraction.acquisitionMultiples);
  console.log('---\n');
  
  // Test case 3: Property-tech project
  const propTechProject = {
    name: 'RWS-CC',
    description: 'Property management system with AI features',
    category: 'property-tech',
    githubData: {
      stargazers_count: 80,
      updated_at: '2024-10-01T00:00:00Z',
      open_issues_count: 12,
      has_wiki: false
    }
  };
  
  console.log('Test 3: Property-Tech Project (RWS-CC)');
  const propIntel = await MarketIntelligenceEngine.analyzeProject(propTechProject);
  console.log('Total Addressable Market:', propIntel.totalAddressableMarket.estimate, 'Billion');
  console.log('Growth Rate:', propIntel.totalAddressableMarket.growthRate, '%');
  console.log('Target Segment:', propIntel.nicheAnalysis.targetSegment);
  console.log('Segment Size:', propIntel.nicheAnalysis.segmentSize.toFixed(2), 'Billion');
  console.log('Pain Points:', propIntel.nicheAnalysis.painPoints.slice(0, 2));
  console.log('Risk Assessment:', {
    technical: propIntel.riskAssessment.technicalRisk,
    market: propIntel.riskAssessment.marketRisk,
    execution: propIntel.riskAssessment.executionRisk
  });
  
  console.log('\n✅ Market intelligence engine tests completed successfully!');
}

testMarketIntelligence().catch(console.error);