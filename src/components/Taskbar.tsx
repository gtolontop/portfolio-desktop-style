'use client'

import { useState, useEffect } from 'react'
import { Search, Layers, ChevronUp, Wifi, Volume2, BatteryFull, Bell, LayoutGrid } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useSystemStore } from '@/store/systemStore'
import TaskbarApp from './TaskbarApp'
import SearchPanel from './SearchPanel'
import WidgetsPanel from './WidgetsPanel'
import QuickSettings from './QuickSettings'
import NotificationCenter from './NotificationCenter'
import CalendarPanel from './CalendarPanel'

interface TaskbarProps {
  onStartClick?: () => void
}

export default function Taskbar({ onStartClick }: TaskbarProps) {
  const [isClicked, setIsClicked] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Panel states
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false)
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const windows = useAppStore(state => state.windows)
  const [, forceUpdate] = useState({})

  const notifications = useSystemStore(state => state.notifications)
  const unreadCount = notifications.filter(n => !n.read).length

  // Subscribe directly to windows changes for immediate updates
  const hasMaximizedWindow = Array.from(windows.values()).some(w => w.isMaximized)

  // Close all panels helper
  const closeAllPanels = () => {
    setIsSearchOpen(false)
    setIsWidgetsOpen(false)
    setIsQuickSettingsOpen(false)
    setIsNotificationsOpen(false)
    setIsCalendarOpen(false)
  }

  // Force re-render when window state changes
  useEffect(() => {
    const checkMaximizedState = () => {
      forceUpdate({})
    }

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

  const handleStartClick = () => {
    closeAllPanels()
    onStartClick?.()
  }

  const handleSearchClick = () => {
    const newState = !isSearchOpen
    closeAllPanels()
    setIsSearchOpen(newState)
  }

  const handleWidgetsClick = () => {
    const newState = !isWidgetsOpen
    closeAllPanels()
    setIsWidgetsOpen(newState)
  }

  const handleQuickSettingsClick = () => {
    const newState = !isQuickSettingsOpen
    closeAllPanels()
    setIsQuickSettingsOpen(newState)
  }

  const handleNotificationsClick = () => {
    const newState = !isNotificationsOpen
    closeAllPanels()
    setIsNotificationsOpen(newState)
  }

  const handleCalendarClick = () => {
    const newState = !isCalendarOpen
    closeAllPanels()
    setIsCalendarOpen(newState)
  }

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
    <>
      {/* Panels */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WidgetsPanel isOpen={isWidgetsOpen} onClose={() => setIsWidgetsOpen(false)} />
      <QuickSettings isOpen={isQuickSettingsOpen} onClose={() => setIsQuickSettingsOpen(false)} />
      <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <CalendarPanel isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />

      <div className={`absolute bottom-0 left-0 right-0 flex items-center transition-all duration-200`} style={{ height: '5.8vh', gap: hasMaximizedWindow ? '0' : '1vh' }}>
        {/* Left Taskbar Section - Main Actions */}
        <div className="h-full flex items-center" style={{
          gap: '0.3vh',
          padding: '0 0.8vh',
          width: '17vh',
          ...taskbarStyle,
          borderRadius: hasMaximizedWindow ? '0' : '0 8px 0 0',
          transition: 'all 200ms ease-in-out'
        }}>
          {/* Start Button */}
          <button
            className="taskbar-start-button flex items-center justify-center hover:bg-white/15 transition-all"
            style={{
              width: '4.2vh',
              height: '4.2vh',
              borderRadius: '0.8vh',
              transform: isClicked ? 'scale(0.95)' : 'scale(1)'
            }}
            onClick={handleStartClick}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => setIsClicked(false)}
            title="Start"
          >
            {/* Windows 11 style logo */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              style={{ width: '2.2vh', height: '2.2vh' }}
              className="text-white/90"
            >
              <rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor" />
              <rect x="13" y="2" width="9" height="9" rx="1.5" fill="currentColor" />
              <rect x="2" y="13" width="9" height="9" rx="1.5" fill="currentColor" />
              <rect x="13" y="13" width="9" height="9" rx="1.5" fill="currentColor" />
            </svg>
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className={`flex items-center justify-center transition-all ${isSearchOpen ? 'bg-white/25' : 'hover:bg-white/15'}`}
            style={{ width: '4.2vh', height: '4.2vh', borderRadius: '0.8vh' }}
            title="Search"
          >
            <Search className="text-white/80" style={{ width: '2.1vh', height: '2.1vh' }} />
          </button>

          {/* Task View Button */}
          <button
            className="flex items-center justify-center hover:bg-white/15 transition-all"
            style={{ width: '4.2vh', height: '4.2vh', borderRadius: '0.8vh' }}
            title="Task View"
          >
            <Layers className="text-white/80" style={{ width: '2.1vh', height: '2.1vh' }} />
          </button>

          {/* Widgets Button */}
          <button
            onClick={handleWidgetsClick}
            className={`flex items-center justify-center transition-all ${isWidgetsOpen ? 'bg-white/25' : 'hover:bg-white/15'}`}
            style={{ width: '4.2vh', height: '4.2vh', borderRadius: '0.8vh' }}
            title="Widgets"
          >
            <LayoutGrid className="text-white/80" style={{ width: '2.1vh', height: '2.1vh' }} />
          </button>
        </div>

        {/* Center Taskbar Section - Open Windows */}
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

        {/* Right Taskbar Section - System Tray */}
        <div className="h-full flex items-center" style={{
          gap: '0.3vh',
          padding: '0 0.8vh',
          width: '22vh',
          ...taskbarStyle,
          borderRadius: hasMaximizedWindow ? '0' : '8px 0 0 0',
          transition: 'all 200ms ease-in-out'
        }}>
          {/* System Tray Icons */}
          <button
            className="flex items-center justify-center hover:bg-white/15 transition-all"
            style={{ width: '3.5vh', height: '3.5vh', borderRadius: '0.6vh' }}
            title="Show hidden icons"
          >
            <ChevronUp className="text-white/70" style={{ width: '1.8vh', height: '1.8vh' }} />
          </button>

          {/* System Icons Group - Quick Settings */}
          <button
            onClick={handleQuickSettingsClick}
            className={`flex items-center gap-0.5 px-1 py-1 rounded-lg transition-colors cursor-pointer ${isQuickSettingsOpen ? 'bg-white/25' : 'hover:bg-white/10'}`}
            title="Quick Settings"
          >
            <Wifi className="text-white/80" style={{ width: '1.8vh', height: '1.8vh' }} />
            <Volume2 className="text-white/80" style={{ width: '1.8vh', height: '1.8vh' }} />
            <BatteryFull className="text-white/80" style={{ width: '1.8vh', height: '1.8vh' }} />
          </button>

          {/* Notifications */}
          <button
            onClick={handleNotificationsClick}
            className={`flex items-center justify-center transition-all relative ${isNotificationsOpen ? 'bg-white/25' : 'hover:bg-white/15'}`}
            style={{ width: '3.5vh', height: '3.5vh', borderRadius: '0.6vh' }}
            title="Notifications"
          >
            <Bell className="text-white/80" style={{ width: '1.8vh', height: '1.8vh' }} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[8px] rounded-full min-w-[14px] h-[14px] flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Time and Date */}
          <button
            onClick={handleCalendarClick}
            className={`flex flex-col items-end justify-center rounded-lg transition-colors px-1.5 py-0.5 ${isCalendarOpen ? 'bg-white/25' : 'hover:bg-white/10'}`}
            style={{ minWidth: '7vh' }}
            title="Calendar"
          >
            <div className="text-white/90 font-medium" style={{ fontSize: '1.3vh', lineHeight: '1.5vh' }}>
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
            <div className="text-white/70" style={{ fontSize: '1vh', lineHeight: '1.2vh' }}>
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
