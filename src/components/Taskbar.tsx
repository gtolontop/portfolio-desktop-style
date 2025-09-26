'use client'

import { useState, useEffect } from 'react'
import { Search, Layers, ChevronUp, Menu } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import TaskbarApp from './TaskbarApp'

interface TaskbarProps {
  onStartClick?: () => void
}

export default function Taskbar({ onStartClick }: TaskbarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const windows = useAppStore(state => state.windows)
  const [, forceUpdate] = useState({})
  
  // Subscribe directly to windows changes for immediate updates
  const hasMaximizedWindow = Array.from(windows.values()).some(w => w.isMaximized)
  
  // Force re-render when window state changes
  useEffect(() => {
    const checkMaximizedState = () => {
      forceUpdate({})
    }
    
    // Listen for custom events that might affect maximize state
    window.addEventListener('window-state-changed', checkMaximizedState)
    
    return () => {
      window.removeEventListener('window-state-changed', checkMaximizedState)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  const taskbarStyle = {
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(14px) saturate(180%)',
    WebkitBackdropFilter: 'blur(14px) saturate(180%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
    background: `
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.2) 5%,
        rgba(255, 255, 255, 0.2) 95%,
        rgba(255, 255, 255, 0.15) 100%
      )
    `
  }

  return (
    <div className={`absolute bottom-0 left-0 right-0 flex items-center transition-all duration-200`} style={{ height: '5.8vh', gap: hasMaximizedWindow ? '0' : '0.3vh' }}>
      {/* Left Taskbar Section */}
      <div className="h-full flex items-center" style={{
        gap: '0.5vh',
        padding: '0 0.5vh',
        width: '16.5vh',
        ...taskbarStyle,
        borderRadius: hasMaximizedWindow ? '0' : '0 8px 0 0',
        transition: 'all 200ms ease-in-out'
      }}>
        {/* Start Button */}
        <button
          className="taskbar-start-button flex items-center justify-center hover:bg-white/15 transition-all"
          style={{
            width: '4.5vh',
            height: '4.5vh',
            borderRadius: '0.8vh'
          }}
          onClick={onStartClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsClicked(true)}
          onMouseUp={() => setIsClicked(false)}
          style={{
            transform: isClicked ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          <img
            src="/images/home.png"
            alt="Start"
            style={{ width: '2.8vh', height: '2.8vh' }}
            className="object-contain"
          />
        </button>

        {/* Search Button */}
        <button className="flex items-center justify-center hover:bg-white/15 transition-all" style={{ width: '4.5vh', height: '4.5vh', borderRadius: '0.8vh' }}>
          <Search className="text-white/80" style={{ width: '2.3vh', height: '2.3vh' }} />
        </button>

        {/* Task View Button */}
        <button className="flex items-center justify-center hover:bg-white/15 transition-all" style={{ width: '4.5vh', height: '4.5vh', borderRadius: '0.8vh' }}>
          <Layers className="text-white/80" style={{ width: '2.3vh', height: '2.3vh' }} />
        </button>
      </div>

      {/* Center Taskbar Section */}
      <div className="flex-1 flex items-center justify-center h-full overflow-x-auto" style={{
        gap: '0.5vh',
        padding: '0 1vh',
        ...taskbarStyle,
        borderRadius: hasMaximizedWindow ? '0' : '8px 8px 0 0',
        transition: 'all 200ms ease-in-out'
      }}>
        {Array.from(windows.keys()).map((windowId) => (
          <TaskbarApp key={windowId} windowId={windowId} />
        ))}
      </div>

      {/* Right Taskbar Section */}
      <div className="h-full flex items-center" style={{
        gap: '0.5vh',
        padding: '0 0.5vh',
        width: '16vh',
        ...taskbarStyle,
        borderRadius: hasMaximizedWindow ? '0' : '8px 0 0 0',
        transition: 'all 200ms ease-in-out'
      }}>
        {/* Show Desktop Button */}
        <button className="flex items-center justify-center hover:bg-white/15 transition-all" style={{ width: '4.5vh', height: '4.5vh', borderRadius: '0.8vh' }}>
          <ChevronUp className="text-white/80" style={{ width: '2vh', height: '2vh' }} />
        </button>

        {/* Menu Button */}
        <button className="flex items-center justify-center hover:bg-white/15 transition-all" style={{ width: '4.5vh', height: '4.5vh', borderRadius: '0.8vh' }}>
          <Menu className="text-white/80" style={{ width: '2.3vh', height: '2.3vh' }} />
        </button>

        {/* Time and Date */}
        <div className="flex flex-col items-end justify-center" style={{ paddingLeft: '0.5vh', paddingRight: '0.5vh', minWidth: '8vh' }}>
          <div className="text-white/90 font-medium" style={{ fontSize: '1.4vh', lineHeight: '1.6vh' }}>
            {currentTime.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="text-white/70" style={{ fontSize: '1vh', lineHeight: '1.2vh' }}>
            {currentTime.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}