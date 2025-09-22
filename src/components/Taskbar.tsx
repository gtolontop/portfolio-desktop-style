'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import TaskbarApp from './TaskbarApp'

export default function Taskbar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { windows } = useAppStore()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-12 border-t shadow-lg"
      style={{
        zIndex: 1000,
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.3)'
      }}>
      <div className="h-full flex items-center px-1 gap-2.5">
        <div
          className="h-10 w-10 flex items-center justify-center rounded-lg"
          style={{
            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            transform: isClicked ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 100ms ease-out',
            position: 'relative',
            zIndex: 1001
          }}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onPointerDown={() => setIsClicked(true)}
          onPointerUp={() => setIsClicked(false)}
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        
        <div className="flex-1 flex gap-1 px-2.5 overflow-x-auto">
          {Array.from(windows.keys()).map((windowId) => (
            <TaskbarApp key={windowId} windowId={windowId} />
          ))}
        </div>
        
        <div className="px-3 text-[13px] text-white/80 font-medium">
          {currentTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  )
}