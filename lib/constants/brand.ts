// lib/constants/brand.ts
export const BRAND = {
  // Core Identity
  NAME: 'MAKO THOTH',
  TAGLINE: 'Sovereign Intelligence. Divine Code Valuation.',
  
  // Visual Identity
  COLORS: {
    primary: '#6366f1',    // Indigo for cyber-luxe
    accent: '#8b5cf6',     // Purple for energy
    background: '#0a0a0f', // Dark background
  },
  
  // Messages
  SLOGAN: 'Where GitHub repositories become high-value acquisition targets.',
  VALUE_PROP: 'Turn code into capital with AI-driven valuation.',
  DESCRIPTION: 'Sovereign intelligence meets divine code valuation. AI software brokerage specializing in GitHub repository acquisition.',
  
  // Legal
  COPYRIGHT: `© ${new Date().getFullYear()} MAKO THOTH. All intelligence reserved.`,
  
  // Defaults
  DEFAULT_TITLE: 'MAKO THOTH | Sovereign Intelligence. Divine Code Valuation.',
  DEFAULT_DESCRIPTION: 'Sovereign intelligence meets divine code valuation. AI software brokerage specializing in GitHub repository acquisition.',
} as const; // "as const" makes these values fixed

// Helper function to format titles
export function formatTitle(title?: string): string {
  return title ? `${title} | MAKO THOTH` : BRAND.DEFAULT_TITLE;
}