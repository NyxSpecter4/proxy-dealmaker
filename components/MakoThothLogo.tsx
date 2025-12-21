'use client';

import { motion } from 'framer-motion';

export default function MakoThothLogo() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Main logo container with glow filter */}
      <motion.div
        className="relative w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 8px #6366f1)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          width="192"
          height="192"
          viewBox="0 0 192 192"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shark Fin (Mako) - Sharp triangular shape */}
          <motion.path
            d="M 48,48 L 96,24 L 144,48 L 120,120 L 96,144 L 72,120 Z"
            fill="none"
            stroke="url(#gradient-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          />

          {/* Eye of Thoth - Concentric circles */}
          <motion.circle
            cx="96"
            cy="96"
            r="36"
            fill="none"
            stroke="url(#gradient-accent)"
            strokeWidth="3"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              delay: 0.8,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="96"
            cy="96"
            r="24"
            fill="none"
            stroke="url(#gradient-primary)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: 1.2,
              ease: "easeInOut",
            }}
          />

          {/* Pupil - Stylized center */}
          <motion.circle
            cx="96"
            cy="96"
            r="8"
            fill="url(#gradient-primary)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 2,
              type: "spring",
              stiffness: 200,
            }}
          />

          {/* Divine signature line */}
          <motion.path
            d="M 60,150 L 132,150"
            stroke="rgba(139, 92, 246, 0.7)"
            strokeWidth="2"
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 2.5,
              ease: "easeInOut",
            }}
          />

          <defs>
            <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5E9" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle floating animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Brand name */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <div className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          MAKO THOTH
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Predatory Intelligence • Divine Code
        </div>
      </motion.div>
    </div>
  );
}