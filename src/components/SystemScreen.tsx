'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SystemState = 'none' | 'shutdown' | 'restart' | 'sleep'

interface SystemScreenProps {
  state: SystemState
  onComplete: () => void
}

const messages = {
  shutdown: [
    'Fermeture en cours...',
    'Enregistrement de vos paramètres...',
    'Fermeture des applications...',
    'À bientôt !'
  ],
  restart: [
    'Redémarrage en cours...',
    'Enregistrement de vos paramètres...',
    'Fermeture des applications...',
    'Préparation du redémarrage...',
    'Redémarrage...'
  ],
  sleep: [
    'Mise en veille...'
  ]
}

export default function SystemScreen({ state, onComplete }: SystemScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showSpinner, setShowSpinner] = useState(true)

  useEffect(() => {
    if (state === 'none') return

    const messageList = messages[state] || []
    let messageIndex = 0

    const interval = setInterval(() => {
      messageIndex++
      if (messageIndex < messageList.length) {
        setCurrentMessage(messageIndex)
      } else {
        clearInterval(interval)
        setShowSpinner(false)

        // Complete after final message
        setTimeout(() => {
          onComplete()
        }, 1000)
      }
    }, state === 'sleep' ? 1500 : 1200)

    return () => clearInterval(interval)
  }, [state, onComplete])

  // Reset state when opening
  useEffect(() => {
    if (state !== 'none') {
      setCurrentMessage(0)
      setShowSpinner(true)
    }
  }, [state])

  if (state === 'none') return null

  const messageList = messages[state] || []

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[10001] flex flex-col items-center justify-center select-none"
        style={{
          backgroundColor: '#0a0a0a'
        }}
      >
        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Windows-style spinner */}
          {showSpinner && (
            <div className="mb-8">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: 'rgba(255,255,255,0.8)',
                  borderRightColor: 'rgba(255,255,255,0.3)'
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </div>
          )}

          {/* Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-white/90 text-xl font-light tracking-wide"
            >
              {messageList[currentMessage]}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots for shutdown/restart */}
          {state !== 'sleep' && (
            <div className="flex gap-2 mt-8">
              {messageList.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index <= currentMessage ? 'bg-white/80' : 'bg-white/20'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: index === currentMessage ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
