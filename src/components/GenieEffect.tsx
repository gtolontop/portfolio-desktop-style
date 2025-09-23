'use client'

import { useEffect, useRef } from 'react'

interface GenieEffectProps {
  children: React.ReactNode
  isAnimating: boolean
  animationType: 'minimize' | 'restore' | 'open' | 'close'
  targetPosition?: { x: number; y: number }
  onAnimationEnd?: () => void
  duration?: number
}

export default function GenieEffect({
  children,
  isAnimating,
  animationType,
  targetPosition,
  onAnimationEnd,
  duration = 600
}: GenieEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const slicesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!isAnimating || !containerRef.current || !contentRef.current) return

    const container = containerRef.current
    const content = contentRef.current
    const rect = container.getBoundingClientRect()
    
    // Create slices
    const sliceCount = 30
    const sliceHeight = rect.height / sliceCount
    
    // Clear previous slices
    slicesRef.current.forEach(slice => slice?.remove())
    slicesRef.current = []

    // Hide original content during animation
    content.style.opacity = '0'

    // Create slice elements
    for (let i = 0; i < sliceCount; i++) {
      const slice = document.createElement('div')
      slice.style.position = 'absolute'
      slice.style.left = '0'
      slice.style.width = '100%'
      slice.style.height = `${sliceHeight}px`
      slice.style.top = `${i * sliceHeight}px`
      slice.style.overflow = 'hidden'
      slice.style.transformOrigin = 'center bottom'
      
      // Clone content for each slice
      const clonedContent = content.cloneNode(true) as HTMLElement
      clonedContent.style.position = 'absolute'
      clonedContent.style.left = '0'
      clonedContent.style.top = `-${i * sliceHeight}px`
      clonedContent.style.width = '100%'
      clonedContent.style.opacity = '1'
      
      slice.appendChild(clonedContent)
      container.appendChild(slice)
      slicesRef.current.push(slice)
    }

    // Calculate target position
    const targetX = targetPosition?.x ?? rect.left + rect.width / 2
    const targetY = targetPosition?.y ?? window.innerHeight - 24

    // Animate each slice
    const isMinimizing = animationType === 'minimize' || animationType === 'close'
    
    slicesRef.current.forEach((slice, index) => {
      const progress = index / sliceCount
      const reverseProgress = 1 - progress
      
      // Stagger the animation start
      const delay = isMinimizing ? progress * 150 : reverseProgress * 150
      
      // Calculate transformation values
      const scaleX = isMinimizing ? 
        1 - (progress * 0.95) : // Bottom slices shrink more
        0.05 + (reverseProgress * 0.95) // Top slices expand more
      
      const translateX = (targetX - rect.left - rect.width / 2) * progress
      const translateY = (targetY - rect.top - rect.height) * Math.pow(progress, 1.5)
      
      // Create curved path using skew
      const skewAngle = Math.sin(progress * Math.PI) * 15
      
      // Apply animations
      const keyframes = isMinimizing ? [
        { 
          transform: 'scaleX(1) translateX(0) translateY(0) skew(0deg)',
          opacity: 1,
          filter: 'blur(0px)'
        },
        { 
          transform: `scaleX(${0.5 + scaleX * 0.5}) translateX(${translateX * 0.3}px) translateY(${translateY * 0.2}px) skew(${skewAngle * 0.5}deg)`,
          opacity: 1,
          filter: 'blur(0px)',
          offset: 0.3
        },
        { 
          transform: `scaleX(${scaleX}) translateX(${translateX}px) translateY(${translateY}px) skew(${skewAngle}deg)`,
          opacity: progress < 0.2 ? 1 : 1 - (progress - 0.2),
          filter: `blur(${progress * 3}px)`
        }
      ] : [
        { 
          transform: `scaleX(${scaleX}) translateX(${translateX}px) translateY(${translateY}px) skew(${skewAngle}deg)`,
          opacity: progress < 0.2 ? 1 : 1 - (progress - 0.2),
          filter: `blur(${progress * 3}px)`
        },
        { 
          transform: `scaleX(${0.5 + scaleX * 0.5}) translateX(${translateX * 0.3}px) translateY(${translateY * 0.2}px) skew(${skewAngle * 0.5}deg)`,
          opacity: 1,
          filter: 'blur(0px)',
          offset: 0.7
        },
        { 
          transform: 'scaleX(1) translateX(0) translateY(0) skew(0deg)',
          opacity: 1,
          filter: 'blur(0px)'
        }
      ]

      const animation = slice.animate(keyframes, {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
        fill: 'forwards'
      })

      // Handle animation end
      if (index === sliceCount - 1) {
        animation.onfinish = () => {
          // Clean up slices
          slicesRef.current.forEach(s => s?.remove())
          slicesRef.current = []
          
          // Show original content
          if (contentRef.current) {
            contentRef.current.style.opacity = '1'
          }
          
          onAnimationEnd?.()
        }
      }
    })

    return () => {
      // Cleanup on unmount
      slicesRef.current.forEach(slice => slice?.remove())
      slicesRef.current = []
      if (contentRef.current) {
        contentRef.current.style.opacity = '1'
      }
    }
  }, [isAnimating, animationType, targetPosition, duration, onAnimationEnd])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div ref={contentRef} className="w-full h-full">
        {children}
      </div>
    </div>
  )
}