export interface MarketIntelligenceData {
  codeHealth: {
    technicalGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    topStrengths: string[];
    weaknesses: string[];
    overallScore: number;
  };
  marketValue: {
    estimatedAcquisitionValue: number;
    costToRebuild: number;
    ourPrice: number;
    valueGap: number; // ourPrice vs acquisition value
    roiMultiple: number;
  };
  targetBuyers: {
    industries: string[];
    companyTypes: string[];
    acquisitionCases: string[];
    fitScore: number; // 0-100
  };
  competitiveEdge: {
    marketMoat: string;
    whyThisWins: string[];
    competitiveAdvantages: string[];
    marketPosition: 'leader' | 'contender' | 'niche' | 'emerging';
  };
}

export interface DealAnalysisModule {
  id: string;
  title: string;
  description: string;
  data: any;
  color: string;
  icon: string;
}

export function generateMarketIntelligence(analysisData: any): MarketIntelligenceData {
  const metrics = analysisData.metrics || {};
  const valuation = analysisData.valuation || { estimatedValue: { medium: 0 } };
  const technicalSummary = analysisData.technicalSummary || {};
  
  // Calculate technical grade based on code health score
  const codeHealthScore = metrics.codeHealth?.score || 50;
  const technicalGrade = getTechnicalGrade(codeHealthScore);
  
  // Generate top strengths
  const topStrengths = generateTopStrengths(analysisData);
  
  // Calculate market value metrics
  const estimatedValue = valuation.estimatedValue?.medium || 100000;
  const costToRebuild = calculateCostToRebuild(technicalSummary);
  const ourPrice = Math.round(estimatedValue * 0.85); // 15% discount for quick deal
  const valueGap = ourPrice - costToRebuild;
  const roiMultiple = estimatedValue / costToRebuild;
  
  // Generate target buyer analysis
  const targetBuyers = generateTargetBuyers(analysisData);
  
  // Generate competitive edge analysis
  const competitiveEdge = generateCompetitiveEdge(analysisData);
  
  return {
    codeHealth: {
      technicalGrade,
      topStrengths,
      weaknesses: generateWeaknesses(analysisData),
      overallScore: codeHealthScore
    },
    marketValue: {
      estimatedAcquisitionValue: estimatedValue,
      costToRebuild,
      ourPrice,
      valueGap,
      roiMultiple: parseFloat(roiMultiple.toFixed(2))
    },
    targetBuyers: {
      industries: targetBuyers.industries,
      companyTypes: targetBuyers.companyTypes,
      acquisitionCases: targetBuyers.acquisitionCases,
      fitScore: targetBuyers.fitScore
    },
    competitiveEdge: {
      marketMoat: competitiveEdge.marketMoat,
      whyThisWins: competitiveEdge.whyThisWins,
      competitiveAdvantages: competitiveEdge.competitiveAdvantages,
      marketPosition: competitiveEdge.marketPosition
    }
  };
}

function getTechnicalGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function generateTopStrengths(analysisData: any): string[] {
  const strengths = [];
  const metrics = analysisData.metrics || {};
  const technicalSummary = analysisData.technicalSummary || {};
  
  if (metrics.codeHealth?.score > 70) {
    strengths.push('Clean, maintainable architecture');
  }
  
  if (technicalSummary.contributors > 3) {
    strengths.push('Multiple contributor support');
  }
  
  if (technicalSummary.stars > 50) {
    strengths.push('Strong community validation');
  }
  
  if (technicalSummary.totalLinesOfCode > 10000) {
    strengths.push('Comprehensive feature set');
  }
  
  if (metrics.activity?.score > 70) {
    strengths.push('Active development lifecycle');
  }
  
  // Ensure we have at least 3 strengths
  while (strengths.length < 3) {
    const defaultStrengths = [
      'Modern technology stack',
      'Scalable architecture',
      'Good documentation practices'
    ];
    strengths.push(...defaultStrengths.slice(0, 3 - strengths.length));
    break;
  }
  
  return strengths.slice(0, 3);
}

function generateWeaknesses(analysisData: any): string[] {
  const weaknesses = [];
  const metrics = analysisData.metrics || {};
  const technicalSummary = analysisData.technicalSummary || {};
  
  if (metrics.community?.score < 40) {
    weaknesses.push('Limited community engagement');
  }
  
  if (technicalSummary.contributors < 2) {
    weaknesses.push('Single maintainer risk');
  }
  
  if (metrics.activity?.score < 40) {
    weaknesses.push('Low recent activity');
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push('Minor technical debt');
    weaknesses.push('Documentation could be improved');
  }
  
  return weaknesses.slice(0, 2);
}

function calculateCostToRebuild(technicalSummary: any): number {
  const linesOfCode = technicalSummary.totalLinesOfCode || 10000;
  const contributors = technicalSummary.contributors || 1;
  const stars = technicalSummary.stars || 0;
  
  // Rough estimate: $50 per line of code for complex software
  const baseCost = linesOfCode * 50;
  
  // Adjust for team size (more contributors = higher coordination cost)
  const teamMultiplier = 1 + (contributors * 0.1);
  
  // Adjust for complexity (more stars = more features/quality)
  const qualityMultiplier = 1 + (stars / 1000);
  
  return Math.round(baseCost * teamMultiplier * qualityMultiplier);
}

function generateTargetBuyers(analysisData: any): {
  industries: string[];
  companyTypes: string[];
  acquisitionCases: string[];
  fitScore: number;
} {
  const technicalSummary = analysisData.technicalSummary || {};
  const language = (technicalSummary.primaryLanguage || '').toLowerCase();
  const name = (analysisData.name || '').toLowerCase();
  
  const industries = [];
  const companyTypes = [];
  const acquisitionCases = [];
  
  // Determine industries based on technology
  if (language.includes('js') || language.includes('ts') || language.includes('web')) {
    industries.push('Web Development', 'SaaS', 'Digital Agencies');
    companyTypes.push('Tech Startups', 'Digital Agencies', 'Enterprise IT');
    acquisitionCases.push('Talent acquisition for frontend teams', 'Technology stack enhancement');
  }
  
  if (language.includes('python') || name.includes('data') || name.includes('ai')) {
    industries.push('Data Science', 'AI/ML', 'Analytics');
    companyTypes.push('Data-driven Companies', 'AI Startups', 'Research Institutions');
    acquisitionCases.push('AI capability acceleration', 'Data pipeline enhancement');
  }
  
  if (language.includes('java') || language.includes('enterprise')) {
    industries.push('Enterprise Software', 'Financial Services', 'Healthcare IT');
    companyTypes.push('Large Enterprises', 'Government Contractors', 'System Integrators');
    acquisitionCases.push('Legacy system modernization', 'Enterprise capability expansion');
  }
  
  // Add some defaults
  if (industries.length === 0) {
    industries.push('Technology', 'Software Development', 'Digital Transformation');
    companyTypes.push('Tech Companies', 'Software Agencies', 'Product Teams');
    acquisitionCases.push('Strategic technology acquisition', 'Team and IP acquisition');
  }
  
  // Calculate fit score based on various factors
  const stars = technicalSummary.stars || 0;
  const contributors = technicalSummary.contributors || 0;
  const fitScore = Math.min(100, Math.round(
    (stars > 100 ? 30 : stars > 50 ? 20 : 10) +
    (contributors > 5 ? 40 : contributors > 2 ? 30 : 20) +
    (industries.length * 10)
  ));
  
  return {
    industries: industries.slice(0, 3),
    companyTypes: companyTypes.slice(0, 3),
    acquisitionCases: acquisitionCases.slice(0, 2),
    fitScore
  };
}

function generateCompetitiveEdge(analysisData: any): {
  marketMoat: string;
  whyThisWins: string[];
  competitiveAdvantages: string[];
  marketPosition: 'leader' | 'contender' | 'niche' | 'emerging';
} {
  const metrics = analysisData.metrics || {};
  const technicalSummary = analysisData.technicalSummary || {};
  
  const businessScore = metrics.businessPotential?.score || 50;
  const communityScore = metrics.community?.score || 50;
  const codeHealthScore = metrics.codeHealth?.score || 50;
  
  // Determine market position
  let marketPosition: 'leader' | 'contender' | 'niche' | 'emerging' = 'emerging';
  if (businessScore > 80 && communityScore > 70) {
    marketPosition = 'leader';
  } else if (businessScore > 60 || communityScore > 60) {
    marketPosition = 'contender';
  } else if (technicalSummary.stars > 100 || technicalSummary.forks > 50) {
    marketPosition = 'niche';
  }
  
  // Generate market moat description
  const marketMoat = generateMarketMoat(analysisData);
  
  // Generate why this wins points
  const whyThisWins = [
    `Superior code quality (${codeHealthScore}/100 score)`,
    `Active community with ${technicalSummary.stars || 0} stars`,
    `${technicalSummary.contributors || 1} contributor${technicalSummary.contributors !== 1 ? 's' : ''} ensures continuity`,
    businessScore > 70 ? 'Strong market demand alignment' : 'Unique market positioning'
  ];
  
  // Generate competitive advantages
  const competitiveAdvantages = [];
  
  if (codeHealthScore > 70) {
    competitiveAdvantages.push('Technical excellence');
  }
  
  if (technicalSummary.stars > 50) {
    competitiveAdvantages.push('Community validation');
  }
  
  if (technicalSummary.contributors > 2) {
    competitiveAdvantages.push('Team expertise');
  }
  
  if (businessScore > 60) {
    competitiveAdvantages.push('Market relevance');
  }
  
  if (competitiveAdvantages.length === 0) {
    competitiveAdvantages.push('Solid foundation', 'Growth potential');
  }
  
  return {
    marketMoat,
    whyThisWins: whyThisWins.slice(0, 3),
    competitiveAdvantages: competitiveAdvantages.slice(0, 3),
    marketPosition
  };
}

function generateMarketMoat(analysisData: any): string {
  const technicalSummary = analysisData.technicalSummary || {};
  const metrics = analysisData.metrics || {};
  
  const stars = technicalSummary.stars || 0;
  const contributors = technicalSummary.contributors || 0;
  const linesOfCode = technicalSummary.totalLinesOfCode || 0;
  const businessScore = metrics.businessPotential?.score || 50;
  
  if (stars > 1000) {
    return 'Strong network effects with massive community adoption creating high switching costs';
  } else if (stars > 100) {
    return 'Community-driven development creates organic growth and user loyalty';
  } else if (contributors > 5) {
    return 'Distributed expertise across multiple maintainers reduces key-person risk';
  } else if (linesOfCode > 50000) {
    return 'Significant technical investment required to replicate functionality';
  } else if (businessScore > 70) {
    return 'Alignment with high-demand market needs creates sustainable advantage';
  }
  
  return 'Technical specialization and focused feature set create barriers to entry';
}