'use client'

import { useEffect, useRef } from 'react'

interface GenieEffect2Props {
  isAnimating: boolean
  type: 'open' | 'close' | 'minimize' | 'restore'
  sourceRect?: DOMRect // Rectangle de l'icône source
  targetRect?: DOMRect // Rectangle de la fenêtre cible
  onComplete?: () => void
  duration?: number
}

export default function GenieEffect2({
  isAnimating,
  type,
  sourceRect,
  targetRect,
  onComplete,
  duration = 600
}: GenieEffect2Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isAnimating || !canvasRef.current || !sourceRect || !targetRect) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to cover the entire viewport
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '99999'

    const startTime = performance.now()
    const isOpening = type === 'open' || type === 'restore'

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      let progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      progress = isOpening ? 
        1 - Math.pow(1 - progress, 3) : // ease-out for opening
        Math.pow(progress, 3) // ease-in for closing

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate positions
      const iconX = sourceRect.left + sourceRect.width / 2
      const iconY = sourceRect.top + sourceRect.height / 2
      const windowX = targetRect.left
      const windowY = targetRect.top
      const windowWidth = targetRect.width
      const windowHeight = targetRect.height

      // Draw the morphing shape
      ctx.save()
      ctx.globalAlpha = isOpening ? progress : 1 - progress

      // Create gradient for depth
      const gradient = ctx.createLinearGradient(
        windowX, windowY,
        windowX, windowY + windowHeight
      )
      gradient.addColorStop(0, 'rgba(30, 30, 30, 0.95)')
      gradient.addColorStop(1, 'rgba(20, 20, 20, 0.95)')
      ctx.fillStyle = gradient

      // Calculate the morphing path
      ctx.beginPath()

      if (isOpening) {
        // Opening: from icon to window
        const topWidth = sourceRect.width + (windowWidth - sourceRect.width) * progress
        const bottomWidth = sourceRect.width * (1 - progress * 0.8) + windowWidth * (progress * 0.8)
        const height = sourceRect.height + (windowHeight - sourceRect.height) * progress
        
        const x = iconX + (windowX - iconX) * progress
        const y = iconY + (windowY - iconY) * progress

        // Top edge
        ctx.moveTo(x - topWidth/2, y - height/2)
        ctx.lineTo(x + topWidth/2, y - height/2)
        
        // Right curve
        const rightControlY = y + height * 0.3
        ctx.bezierCurveTo(
          x + topWidth/2 + (1-progress) * 20, rightControlY,
          x + bottomWidth/2 + (1-progress) * 10, y + height/2 - height * 0.1,
          x + bottomWidth/2, y + height/2
        )
        
        // Bottom edge
        ctx.lineTo(x - bottomWidth/2, y + height/2)
        
        // Left curve
        ctx.bezierCurveTo(
          x - bottomWidth/2 - (1-progress) * 10, y + height/2 - height * 0.1,
          x - topWidth/2 - (1-progress) * 20, rightControlY,
          x - topWidth/2, y - height/2
        )
      } else {
        // Closing: from window to icon
        const p = 1 - progress // Reverse progress for closing
        const topWidth = sourceRect.width + (windowWidth - sourceRect.width) * p
        const bottomWidth = sourceRect.width * (1 - p * 0.8) + windowWidth * (p * 0.8)
        const height = sourceRect.height + (windowHeight - sourceRect.height) * p
        
        const x = iconX + (windowX - iconX) * p
        const y = iconY + (windowY - iconY) * p

        // Same path drawing but with reversed progress
        ctx.moveTo(x - topWidth/2, y - height/2)
        ctx.lineTo(x + topWidth/2, y - height/2)
        
        const rightControlY = y + height * 0.3
        ctx.bezierCurveTo(
          x + topWidth/2 + progress * 20, rightControlY,
          x + bottomWidth/2 + progress * 10, y + height/2 - height * 0.1,
          x + bottomWidth/2, y + height/2
        )
        
        ctx.lineTo(x - bottomWidth/2, y + height/2)
        
        ctx.bezierCurveTo(
          x - bottomWidth/2 - progress * 10, y + height/2 - height * 0.1,
          x - topWidth/2 - progress * 20, rightControlY,
          x - topWidth/2, y - height/2
        )
      }

      ctx.closePath()
      ctx.fill()

      // Add border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Add shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetY = 5

      ctx.restore()

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Clean up
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, type, sourceRect, targetRect, duration, onComplete])

  if (!isAnimating) return null

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }} />
}