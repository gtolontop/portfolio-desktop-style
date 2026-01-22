'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BootScreenProps {
  isBooting: boolean
  onBootComplete: () => void
}

export default function BootScreen({ isBooting, onBootComplete }: BootScreenProps) {
  const [bootPhase, setBootPhase] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    if (!isBooting) {
      setBootPhase(0)
      setShowLogo(false)
      return
    }

    // Boot sequence
    const sequence = async () => {
      // Phase 1: Show logo
      await new Promise(r => setTimeout(r, 500))
      setShowLogo(true)
      setBootPhase(1)

      // Phase 2: Loading dots
      await new Promise(r => setTimeout(r, 2500))
      setBootPhase(2)

      // Phase 3: Almost done
      await new Promise(r => setTimeout(r, 1000))
      setBootPhase(3)

      // Complete
      await new Promise(r => setTimeout(r, 500))
      onBootComplete()
    }

    sequence()
  }, [isBooting, onBootComplete])

  if (!isBooting) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[10002] flex flex-col items-center justify-center select-none"
      style={{ backgroundColor: '#000' }}
    >
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              className="mb-12"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {/* Windows-style logo */}
              <svg
                viewBox="0 0 88 88"
                className="w-24 h-24"
              >
                <motion.rect
                  x="4" y="4" width="36" height="36" rx="4"
                  fill="#0078D4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                />
                <motion.rect
                  x="48" y="4" width="36" height="36" rx="4"
                  fill="#0078D4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                />
                <motion.rect
                  x="4" y="48" width="36" height="36" rx="4"
                  fill="#0078D4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                />
                <motion.rect
                  x="48" y="48" width="36" height="36" rx="4"
                  fill="#0078D4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                />
              </svg>
            </motion.div>

            {/* Loading spinner - Windows style dots */}
            {bootPhase >= 1 && bootPhase < 3 && (
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Welcome text */}
            {bootPhase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-white/60 text-sm font-light"
              >
                Préparation de Windows...
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
