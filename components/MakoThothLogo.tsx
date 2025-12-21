'use client';

import { motion } from 'framer-motion';

export default function MakoThothLogo() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 233, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(12px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main logo container */}
      <div className="relative w-full h-full">
        {/* SVG Logo */}
        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="rgba(99, 102, 241, 0.1)"
            strokeWidth="2"
          />

          {/* Shark fin (Mako) - animated drawing */}
          <motion.path
            d="M 80,80 L 128,40 L 176,80 L 160,160 L 128,200 L 96,160 Z"
            fill="none"
            stroke="url(#gradient-primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: 'easeInOut',
            }}
          />

          {/* Eye of Thoth / Nib */}
          <motion.path
            d="M 128,100 C 140,90 160,90 172,100 C 180,120 172,140 150,150 C 128,160 106,150 98,130 C 90,110 100,90 120,80"
            fill="none"
            stroke="url(#gradient-accent)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 1.5,
              ease: 'easeInOut',
            }}
          />

          {/* Inner pupil */}
          <motion.circle
            cx="128"
            cy="120"
            r="12"
            fill="url(#gradient-primary)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 2.5,
              type: 'spring',
              stiffness: 200,
            }}
          />

          {/* Digital scribe lines */}
          <motion.path
            d="M 100,180 L 156,180"
            stroke="rgba(139, 92, 246, 0.7)"
            strokeWidth="3"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              delay: 3,
            }}
          />
          <motion.path
            d="M 110,190 L 146,190"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="2"
            strokeDasharray="3,3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              delay: 3.2,
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

        {/* Floating animation container */}
        <motion.div
          className="absolute inset-0"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Glowing dots */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#00E5E9]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.2,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#FF6B35]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
        </motion.div>
      </div>

      {/* Text label */}
      <div className="absolute -bottom-12 left-0 right-0 text-center">
        <motion.div
          className="text-2xl font-black tracking-tighter"
          style={{
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          MAKO THOTH
        </motion.div>
        <motion.div
          className="text-sm text-gray-400 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
        >
          Predatory Intelligence
        </motion.div>
      </div>
    </div>
  );
}