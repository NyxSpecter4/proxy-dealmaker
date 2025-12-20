// app/layout.tsx - SAFE, minimal version
import type { Metadata } from 'next';
import { BRAND, formatTitle } from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: BRAND.DEFAULT_TITLE,
  description: BRAND.DEFAULT_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: BRAND.COLORS.background,
        color: '#111',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER - Simple and clean */}
        <header style={{
          padding: '1.5rem 2rem',
          borderBottom: `2px solid ${BRAND.COLORS.primary}`,
          background: BRAND.COLORS.background,
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: '900',
              color: BRAND.COLORS.primary,
              letterSpacing: '-0.02em'
            }}>
              {BRAND.NAME}
            </h1>
            <p style={{
              margin: '0.25rem 0 0',
              fontSize: '0.95rem',
              color: '#666',
              fontWeight: '500'
            }}>
              {BRAND.TAGLINE}
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {children}
        </main>

        {/* FOOTER - Simple and professional */}
        <footer style={{
          padding: '1.5rem 2rem',
          borderTop: `1px solid #eee`,
          background: '#fafafa',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p style={{ margin: 0 }}>
              {BRAND.COPYRIGHT} | {BRAND.SLOGAN}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
              Built with intelligence. Every hour valued.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
