// lib/constants/brand.ts
export const BRAND = {
  // Core Identity
  NAME: 'KALA.AI',
  TAGLINE: 'Intelligent Systems Development',
  
  // Visual Identity
  COLORS: {
    primary: '#000000',    // Pure black for authority
    accent: '#FF6B35',     // Orange for energy/action
    background: '#FFFFFF', // Clean white
  },
  
  // Messages
  SLOGAN: 'Where time‑backed assets meet AI‑driven market intelligence.',
  VALUE_PROP: 'Building proprietary technology with measurable value.',
  DESCRIPTION: 'Intelligent systems development company specializing in time-based valuation and proprietary architecture.',
  
  // Legal
  COPYRIGHT: `© ${new Date().getFullYear()} KALA.AI. All intelligence reserved.`,
  
  // Defaults
  DEFAULT_TITLE: 'KALA.AI | Intelligent Systems Development',
  DEFAULT_DESCRIPTION: 'Intelligent systems development company specializing in time-based valuation and proprietary architecture.',
} as const; // "as const" makes these values fixed

// Helper function to format titles
export function formatTitle(title?: string): string {
  return title ? `${title} | KALA.AI` : BRAND.DEFAULT_TITLE;
}