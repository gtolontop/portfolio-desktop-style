'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LockScreenProps {
  isLocked: boolean
  onUnlock: () => void
}

export default function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleUnlock = () => {
    setIsUnlocking(true)
    setTimeout(() => {
      onUnlock()
      setIsUnlocking(false)
    }, 500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center cursor-pointer select-none"
          style={{
            backgroundImage: 'url(/images/background-pink.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={handleUnlock}
        >
          {/* Glass overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(30px) saturate(150%)',
              WebkitBackdropFilter: 'blur(30px) saturate(150%)'
            }}
          />

          {/* Top left info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-8 left-8 z-10"
          >
            <div className="text-white text-5xl font-light tracking-tight mb-1" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
              {formatTime(currentTime)}
            </div>
            <div className="text-white/80 text-lg font-light capitalize" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              {formatDate(currentTime)}
            </div>
          </motion.div>

          {/* Centered content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`relative z-10 flex flex-col items-center transition-all duration-500 ${isUnlocking ? 'scale-95 opacity-0' : ''}`}
          >
            {/* User avatar */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-5 shadow-2xl">
              <span className="text-white text-4xl font-semibold">C</span>
            </div>
            <div className="text-white text-xl font-medium" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              Concept Central
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
