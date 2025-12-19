// app/components/Logo.tsx - CodeMidas
'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizes = {
    small: 'w-8 h-8 text-base',
    default: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-3xl'
  };

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      {/* Midas Circuit Symbol */}
      <div className={`${sizes[size]} relative bg-gradient-to-br from-amber-700 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30`}>
        {/* Circuit M */}
        <div className="relative w-2/3 h-2/3">
          {/* Left vertical */}
          <div className="absolute left-0 top-0 w-1 h-full bg-white"></div>
          {/* Diagonal 1 */}
          <div className="absolute left-1 top-0 w-3 h-1 bg-white transform rotate-45 origin-top-left"></div>
          {/* Diagonal 2 */}
          <div className="absolute left-1 bottom-0 w-3 h-1 bg-white transform -rotate-45 origin-bottom-left"></div>
          {/* Right vertical */}
          <div className="absolute right-0 top-0 w-1 h-full bg-white"></div>
        </div>
        
        {/* AI sparkle */}
        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-200" />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-bold ${size === 'large' ? 'text-3xl' : size === 'small' ? 'text-xl' : 'text-2xl'} tracking-tight`}>
          Code<span className="text-amber-400">Midas</span>
        </span>
        <span className="text-xs text-gray-400 -mt-1 tracking-wider">
          TURNING CODE TO CAPITAL
        </span>
      </div>
    </Link>
  );
}