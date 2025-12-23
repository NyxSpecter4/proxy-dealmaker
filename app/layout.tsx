// app/layout.tsx - Minimal layout
import type { Metadata } from 'next';
import { BRAND } from '@/lib/constants/brand';

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
        color: '#fff',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}
