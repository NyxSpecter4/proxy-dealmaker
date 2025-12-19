// app/components/Logo.tsx
'use client';

import { Code, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizes = {
    small: 'w-8 h-8 text-lg',
    default: 'w-10 h-10 text-2xl',
    large: 'w-12 h-12 text-3xl'
  };

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      {/* Logo Icon */}
      <div className={`${sizes[size]} bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20`}>
        <Code className="w-1/2 h-1/2 text-white" />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`font-bold ${size === 'large' ? 'text-3xl' : size === 'small' ? 'text-lg' : 'text-2xl'} tracking-tight`}>
          Proxy<span className="text-cyan-300">Deal</span>Maker
        </span>
        {size !== 'small' && (
          <span className="text-xs text-gray-400 -mt-1 tracking-wider">
            AI-POWERED ACQUISITIONS
          </span>
        )}
      </div>
    </Link>
  );
}