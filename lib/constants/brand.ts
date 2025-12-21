// lib/constants/brand.ts
export const BRAND = {
  // Core Identity
  NAME: 'GENESIS',
  TAGLINE: 'Tier-1 AI Software Brokerage',
  
  // Visual Identity
  COLORS: {
    primary: '#6366f1',    // Indigo for cyber-luxe
    accent: '#8b5cf6',     // Purple for energy
    background: '#0a0a0f', // Dark background
  },
  
  // Messages
  SLOGAN: 'Where GitHub repositories become high-value acquisition targets.',
  VALUE_PROP: 'Turn code into capital with AI-driven valuation.',
  DESCRIPTION: 'Tier-1 AI software brokerage specializing in GitHub repository valuation and acquisition.',
  
  // Legal
  COPYRIGHT: `© ${new Date().getFullYear()} GENESIS ENGINE. All intelligence reserved.`,
  
  // Defaults
  DEFAULT_TITLE: 'GENESIS ENGINE | AI Software Brokerage',
  DEFAULT_DESCRIPTION: 'Tier-1 AI software brokerage specializing in GitHub repository valuation and acquisition.',
} as const; // "as const" makes these values fixed

// Helper function to format titles
export function formatTitle(title?: string): string {
  return title ? `${title} | GENESIS` : BRAND.DEFAULT_TITLE;
}