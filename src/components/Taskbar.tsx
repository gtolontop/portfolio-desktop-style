'use client'

import { useState, useEffect } from 'react'
import { Search, Layers, ChevronUp, Menu } from 'lucide-react'
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
      className="absolute bottom-0 left-0 right-0 h-12"
      style={{
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(14px) saturate(180%)',
        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.25)',
        background: `
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.2) 5%,
            rgba(255, 255, 255, 0.2) 95%,
            rgba(255, 255, 255, 0.15) 100%
          )
        `
      }}>
      <div className="h-full flex items-center gap-2 px-2">
        {/* Left Section - Start Menu, Search, Task View */}
        <div className="flex items-center gap-1 px-3 h-10 rounded-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
          {/* Start Button */}
          <button
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/20 transition-all"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => setIsClicked(false)}
            style={{
              transform: isClicked ? 'scale(0.95)' : 'scale(1)',
            }}
          >
            <img
              src="/images/logo.png"
              alt="Start"
              className="w-6 h-6 object-contain"
            />
          </button>

          {/* Search Button */}
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/20 transition-all">
            <Search className="w-4 h-4 text-white/80" />
          </button>

          {/* Task View Button */}
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/20 transition-all">
            <Layers className="w-4 h-4 text-white/80" />
          </button>
        </div>

        {/* Center Section - App Icons */}
        <div className="flex-1 flex items-center justify-center gap-1 px-3 h-10 rounded-lg overflow-x-auto"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
          {Array.from(windows.keys()).map((windowId) => (
            <TaskbarApp key={windowId} windowId={windowId} />
          ))}
        </div>

        {/* Right Section - System Tray */}
        <div className="flex items-center gap-1 px-3 h-10 rounded-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
          {/* Show Desktop Button */}
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/20 transition-all">
            <ChevronUp className="w-4 h-4 text-white/80" />
          </button>

          {/* Menu Button */}
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/20 transition-all">
            <Menu className="w-4 h-4 text-white/80" />
          </button>

          {/* Time and Date */}
          <div className="flex flex-col items-end justify-center px-1 min-w-[70px]">
            <div className="text-[12px] text-white/90 font-medium leading-tight">
              {currentTime.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="text-[10px] text-white/70 leading-tight">
              {currentTime.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}