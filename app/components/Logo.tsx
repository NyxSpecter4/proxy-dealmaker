// app/components/Logo.tsx - FINAL
'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      {/* Specter ghost with '9' badge */}
      <div className="relative">
        {/* Ghost body */}
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
          {/* Circuit lines */}
          <div className="absolute top-3 left-2 right-2 h-0.5 bg-yellow-300/80 group-hover:bg-yellow-300 transition-colors"></div>
          <div className="absolute top-5 left-2 right-2 h-0.5 bg-yellow-300/80 group-hover:bg-yellow-300 transition-colors"></div>
          <div className="absolute top-7 left-2 right-2 h-0.5 bg-yellow-300/80 group-hover:bg-yellow-300 transition-colors"></div>
        </div>
        
        {/* '9' badge - prominent position */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border border-white group-hover:scale-110 transition-transform">
          9
        </div>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight group-hover:text-purple-600 transition-colors">
          Specter<span className="text-green-400 group-hover:text-emerald-400 transition-colors">9</span>Labs
        </span>
        <span className="text-xs text-gray-400 -mt-1 tracking-wider group-hover:text-gray-600 transition-colors">
          YOUR CREATIVE SOFTWARE ENGINE
        </span>
      </div>
    </Link>
  );
}