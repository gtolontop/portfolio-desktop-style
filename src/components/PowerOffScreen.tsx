'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Power } from 'lucide-react'

interface PowerOffScreenProps {
  isOff: boolean
  onPowerOn: () => void
}

export default function PowerOffScreen({ isOff, onPowerOn }: PowerOffScreenProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handlePowerOn = () => {
    setIsPressed(true)
    setTimeout(() => {
      onPowerOn()
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOff && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10003] flex flex-col items-center justify-center select-none cursor-pointer"
          style={{ backgroundColor: '#000' }}
          onClick={handlePowerOn}
        >
          {/* Power button hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Power button */}
            <motion.button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => {
                e.stopPropagation()
                handlePowerOn()
              }}
              animate={{
                scale: isPressed ? 0.9 : isHovered ? 1.1 : 1,
                boxShadow: isHovered
                  ? '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)'
                  : '0 0 20px rgba(255,255,255,0.1)'
              }}
              transition={{ duration: 0.2 }}
              className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 hover:border-white/40 transition-colors"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)'
              }}
            >
              <Power className="w-8 h-8 text-white/50" />
            </motion.button>

            {/* Text */}
            <motion.p
              animate={{
                opacity: isHovered ? 1 : 0.5
              }}
              className="text-white/50 text-sm font-light"
            >
              Cliquez pour allumer
            </motion.p>
          </motion.div>

          {/* Subtle ambient animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 50%)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
