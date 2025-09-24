'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Search, Power, Settings, User } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { apps, openWindow } = useAppStore()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Check if click is on taskbar (to prevent closing when clicking start button)
        const taskbar = document.querySelector('.taskbar-start-button')
        if (taskbar && taskbar.contains(e.target as Node)) return
        
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleAppClick = (appId: string) => {
    openWindow(appId)
    onClose()
  }

  const filteredApps = Array.from(apps.values()).filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className={`
        absolute bottom-14 left-0 w-[600px] h-[700px]
        bg-gray-900/95 backdrop-blur-2xl
        rounded-t-xl border border-gray-700/50
        shadow-2xl shadow-black/50
        flex flex-col
        transition-all duration-300 ease-out origin-bottom-left
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}
      style={{
        background: `
          linear-gradient(
            135deg,
            rgba(17, 24, 39, 0.98) 0%,
            rgba(31, 41, 55, 0.95) 50%,
            rgba(17, 24, 39, 0.98) 100%
          )
        `
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
        <h2 className="text-xl font-light text-white">Start</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search"
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 
                     rounded-lg text-white placeholder-gray-400
                     focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70
                     transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Pinned Section */}
        <div className="w-1/2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Pinned</h3>
          <div className="grid grid-cols-3 gap-2 overflow-y-auto">
            {filteredApps.slice(0, 6).map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="flex flex-col items-center p-4 rounded-lg
                         hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center
                              bg-gray-800/50 rounded-lg group-hover:bg-gray-700/50
                              transition-colors">
                  {typeof app.icon === 'string' ? (
                    <span className="text-2xl">{app.icon}</span>
                  ) : (
                    <app.icon className="w-6 h-6 text-white/80" />
                  )}
                </div>
                <span className="text-xs text-white/80 text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* All Apps Section */}
        <div className="w-1/2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-400 mb-3">All apps</h3>
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                         hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center
                              bg-gray-800/30 rounded">
                  {typeof app.icon === 'string' ? (
                    <span className="text-lg">{app.icon}</span>
                  ) : (
                    <app.icon className="w-5 h-5 text-white/80" />
                  )}
                </div>
                <span className="text-sm text-white/80">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-700/30">
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg
                         hover:bg-white/10 transition-colors">
          <User className="w-5 h-5 text-white/70" />
          <span className="text-sm text-white/80">User</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-white/70" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Power className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  )
}