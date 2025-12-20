// lib/constants/brand.ts
export const BRAND = {
  // Core Identity
  NAME: 'KALA.AI',
  TAGLINE: 'The Intelligent Auction Platform',
  
  // Visual Identity
  COLORS: {
    primary: '#000000',    // Pure black for authority
    accent: '#FF6B35',     // Orange for energy/action
    background: '#FFFFFF', // Clean white
  },
  
  // Messages
  SLOGAN: 'Where time‑backed assets meet AI‑driven market intelligence.',
  VALUE_PROP: 'Auction with intelligence. Not just faster—smarter.',
  DESCRIPTION: 'The auction platform that learns from failure. Every restart makes your asset more valuable.',
  
  // Legal
  COPYRIGHT: `© ${new Date().getFullYear()} KALA.AI. All intelligence reserved.`,
  
  // Defaults
  DEFAULT_TITLE: 'KALA.AI | Intelligent Auction Platform',
  DEFAULT_DESCRIPTION: 'The auction platform that learns from failure. Every restart makes your asset more valuable.',
} as const; // "as const" makes these values fixed

// Helper function to format titles
export function formatTitle(title?: string): string {
  return title ? `${title} | KALA.AI` : BRAND.DEFAULT_TITLE;
}