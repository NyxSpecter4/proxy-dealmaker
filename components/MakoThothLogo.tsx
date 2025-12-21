'use client';

import { motion } from 'framer-motion';

export default function MakoThothLogo() {
  return (
    <div className="relative mx-auto mb-12">
      {/* Logo Container - No massive invisible box */}
      <div className="relative w-64 h-64 mx-auto">
        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Thoth's Ibis Head / Mako Shark Body - Sharp profile */}
          <motion.path
            d="M 50,150 
               C 50,100 80,60 120,40 
               C 160,20 200,20 240,40 
               C 280,60 310,100 310,150 
               C 310,200 280,240 240,260 
               C 200,280 160,280 120,260 
               C 80,240 50,200 50,150 Z"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Thoth's Beak - Long, curved, elegant */}
          <motion.path
            d="M 120,40 
               C 140,30 160,30 180,40 
               L 200,80 
               C 180,100 160,120 140,130 
               C 120,120 100,100 80,80 
               L 100,40 
               C 105,35 112,32 120,40 Z"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="4,2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />

          {/* Shark Dorsal Fin - Sharp, triangular */}
          <motion.path
            d="M 140,30 
               L 160,10 
               L 180,30 
               L 170,60 
               L 150,70 
               L 130,60 
               Z"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
          />

          {/* Eye of Thoth - Simple, divine */}
          <motion.circle
            cx="180"
            cy="120"
            r="8"
            fill="#F59E0B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.8, type: "spring" }}
          />

          {/* Divine signature line */}
          <motion.path
            d="M 80,200 L 240,200"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Text: MAKO THOTH - Separate, massive, clean, high-contrast Bold White */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white">
          MAKO THOTH
        </h1>
        <div className="text-lg text-silver font-serif mt-2">
          SOVEREIGN INTELLIGENCE • DIVINE CODE VALUATION
        </div>
      </motion.div>
    </div>
  );
}