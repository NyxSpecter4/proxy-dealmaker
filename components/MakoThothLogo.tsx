'use client';

import { motion } from 'framer-motion';

export default function MakoThothLogo() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Main logo container with enhanced glow */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow effect container */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Single fluid path: Mako Shark silhouette transitioning to Thoth profile */}
          <motion.path
            d="M 48,80 
               C 48,60 80,40 96,32 
               C 112,24 144,24 160,32 
               C 176,40 208,60 208,80 
               C 208,100 192,120 176,136 
               C 160,152 128,168 128,168 
               C 128,168 96,152 80,136 
               C 64,120 48,100 48,80 Z"
            fill="none"
            stroke="url(#gradient-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          />

          {/* Thoth's Ibis beak (transition from dorsal fin) */}
          <motion.path
            d="M 160,32 
               C 180,28 200,40 208,60 
               L 192,80 
               C 184,68 172,56 160,52 
               Z"
            fill="url(#gradient-gold)"
            stroke="url(#gradient-gold)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              delay: 1,
              ease: "easeInOut",
            }}
          />

          {/* Eye of Thoth - Glowing concentric circles */}
          <motion.circle
            cx="128"
            cy="104"
            r="32"
            fill="none"
            stroke="url(#gradient-accent)"
            strokeWidth="3"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0, scale: 0 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{
              duration: 2,
              delay: 1.5,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="128"
            cy="104"
            r="20"
            fill="none"
            stroke="url(#gradient-primary)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0, scale: 0 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{
              duration: 1.5,
              delay: 2,
              ease: "easeInOut",
            }}
          />

          {/* Pupil with divine glow */}
          <motion.circle
            cx="128"
            cy="104"
            r="8"
            fill="url(#gradient-gold)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 2.5,
              type: "spring",
              stiffness: 200,
            }}
          />

          {/* Divine signature line */}
          <motion.path
            d="M 80,180 L 176,180"
            stroke="rgba(245, 158, 11, 0.7)"
            strokeWidth="2"
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 3,
              ease: "easeInOut",
            }}
          />

          <defs>
            {/* Electric Blue to Ancient Gold gradient */}
            <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            
            <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5E9" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            
            <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Breathing animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* Brand name with enhanced typography */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <div className="text-4xl font-black tracking-tighter italic">
          <span className="bg-gradient-to-r from-[#6366f1] via-[#f59e0b] to-[#8b5cf6] bg-clip-text text-transparent">
            MAKO THOTH
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-2 font-serif">
          Sovereign Intelligence • Divine Code
        </div>
      </motion.div>
    </div>
  );
}