'use client';

import { motion } from 'framer-motion';

export default function MakoThothLogo() {
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Main logo container with enhanced glow */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Liquid gold shimmer background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Thoth's Ibis Head / Shark Body - Main silhouette */}
          <motion.path
            d="M 80,160 
               C 80,120 100,80 140,60 
               C 180,40 220,40 260,60 
               C 300,80 320,120 320,160 
               C 320,200 300,240 260,260 
               C 220,280 180,280 140,260 
               C 100,240 80,200 80,160 Z"
            fill="none"
            stroke="url(#gold-shimmer)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          />

          {/* Thoth's Beak / Shark Belly - Curved elegant transition */}
          <motion.path
            d="M 140,60 
               C 160,50 180,50 200,60 
               L 220,100 
               C 200,120 180,140 160,150 
               C 140,140 120,120 100,100 
               L 120,60 
               C 125,55 132,52 140,60 Z"
            fill="url(#gold-gradient)"
            fillOpacity="0.3"
            stroke="url(#gold-shimmer)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.5,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />

          {/* Shark Dorsal Fin / Thoth's Headdress */}
          <motion.path
            d="M 160,40 
               C 165,20 175,10 190,5 
               C 205,0 220,5 230,15 
               C 240,25 245,40 240,55 
               C 235,70 220,80 205,85 
               C 190,90 170,90 155,85 
               C 140,80 125,70 120,55 
               C 115,40 120,25 130,15 
               C 140,5 155,0 170,5 
               C 185,10 195,20 200,40"
            fill="none"
            stroke="url(#electric-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.8,
              delay: 1,
              ease: "easeInOut",
            }}
          />

          {/* Eye of Thoth - Divine concentric circles */}
          <motion.circle
            cx="160"
            cy="160"
            r="40"
            fill="none"
            stroke="url(#gold-shimmer)"
            strokeWidth="2"
            strokeDasharray="3,3"
            initial={{ pathLength: 0, opacity: 0, scale: 0 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{
              duration: 2,
              delay: 1.5,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="160"
            cy="160"
            r="25"
            fill="none"
            stroke="url(#electric-blue)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0, scale: 0 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{
              duration: 1.5,
              delay: 2,
              ease: "easeInOut",
            }}
          />

          {/* Divine Pupil with liquid gold shimmer */}
          <motion.circle
            cx="160"
            cy="160"
            r="10"
            fill="url(#gold-gradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              default: {
                duration: 1,
                delay: 2.5,
                type: "spring",
                stiffness: 200,
              }
            }}
          />

          {/* Integrated Text: MAKO THOTH */}
          <motion.path
            d="M 60,280 
               C 80,270 100,265 120,270 
               C 140,275 155,285 160,300 
               C 165,285 180,275 200,270 
               C 220,265 240,270 260,280"
            fill="none"
            stroke="url(#gold-shimmer)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              delay: 3,
              ease: "easeInOut",
            }}
          />

          {/* M Letter */}
          <motion.path
            d="M 70,290 L 70,310 L 85,295 L 100,310 L 100,290"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 3.2,
              ease: "easeInOut",
            }}
          />

          {/* A Letter */}
          <motion.path
            d="M 110,310 L 120,290 L 130,310 M 115,300 L 125,300"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 3.4,
              ease: "easeInOut",
            }}
          />

          {/* K Letter */}
          <motion.path
            d="M 140,290 L 140,310 M 140,300 L 155,290 M 140,300 L 155,310"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 3.6,
              ease: "easeInOut",
            }}
          />

          {/* O Letter */}
          <motion.path
            d="M 165,295 
               C 165,290 170,285 175,285 
               C 180,285 185,290 185,295 
               C 185,300 180,305 175,305 
               C 170,305 165,300 165,295 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 3.8,
              ease: "easeInOut",
            }}
          />

          {/* T Letter (first) */}
          <motion.path
            d="M 195,290 L 210,290 M 202.5,290 L 202.5,310"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 4,
              ease: "easeInOut",
            }}
          />

          {/* H Letter */}
          <motion.path
            d="M 220,290 L 220,310 M 235,290 L 235,310 M 220,300 L 235,300"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 4.2,
              ease: "easeInOut",
            }}
          />

          {/* O Letter (second) */}
          <motion.path
            d="M 245,295 
               C 245,290 250,285 255,285 
               C 260,285 265,290 265,295 
               C 265,300 260,305 255,305 
               C 250,305 245,300 245,295 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 4.4,
              ease: "easeInOut",
            }}
          />

          {/* T Letter (second) */}
          <motion.path
            d="M 270,290 L 285,290 M 277.5,290 L 277.5,310"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 4.6,
              ease: "easeInOut",
            }}
          />

          {/* H Letter (final) */}
          <motion.path
            d="M 290,290 L 290,310 M 305,290 L 305,310 M 290,300 L 305,300"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 4.8,
              ease: "easeInOut",
            }}
          />

          <defs>
            {/* Liquid Gold Shimmer Gradient */}
            <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B">
                <animate
                  attributeName="stop-color"
                  values="#F59E0B;#FFD700;#F59E0B;#FFB347;#F59E0B"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#FFD700">
                <animate
                  attributeName="stop-color"
                  values="#FFD700;#F59E0B;#FFD700;#F59E0B;#FFD700"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#FFB347">
                <animate
                  attributeName="stop-color"
                  values="#FFB347;#FFD700;#FFB347;#F59E0B;#FFB347"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Solid Gold Gradient */}
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>

            {/* Electric Blue */}
            <linearGradient id="electric-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#00E5E9" />
            </linearGradient>

            {/* Glow filter for shimmer effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Continuous shimmer animation overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2), transparent 60%)',
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5, duration: 1 }}
      >
        <div className="text-sm text-silver font-serif tracking-widest">
          SOVEREIGN INTELLIGENCE • DIVINE CODE
        </div>
      </motion.div>
    </div>
  );
}