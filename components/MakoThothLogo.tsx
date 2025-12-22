'use client'
import { motion } from 'framer-motion'
export default function MakoThothLogo() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" initial="hidden" animate="visible">
        <motion.path d="M40 140C40 140 60 40 100 40C140 40 160 140 160 140L100 120L40 140Z" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 2.5, ease: "easeInOut" } } }} />
        <motion.circle cx="100" cy="85" r="10" stroke="#f59e0b" strokeWidth="2" variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { delay: 2, duration: 0.5 } } }} />
        <circle cx="100" cy="85" r="30" fill="url(#goldGlow)" fillOpacity="0.2" />
        <defs><radialGradient id="goldGlow"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="transparent" /></radialGradient></defs>
      </motion.svg>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} style={{ fontSize: '5rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '-0.05em', textShadow: '0 0 30px rgba(245, 158, 11, 0.5)' }}>MAKO THOTH</motion.h1>
    </div>
  )
}