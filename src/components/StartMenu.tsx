'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Power, Settings, FolderOpen, Cloud, Calendar, Music, MessageCircle, User } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
}

// App descriptions
const appDescriptions: Record<string, string> = {
  'file-explorer': 'Browse and manage your files',
  'discord': 'Chat with friends and communities',
  'vscode': 'Code editor for developers',
  'chrome': 'Browse the web securely',
  'spotify': 'Listen to your favorite music'
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'most-used' | 'all-apps'>('most-used')
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
  
  const mostUsedApps = filteredApps.slice(0, 5)
  const allApps = filteredApps

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className={`
        absolute bottom-14 left-0 w-[800px] h-[600px]
        rounded-[7px] shadow-2xl
        flex flex-col overflow-hidden
        transition-all duration-300 ease-out origin-bottom-left
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}
      style={{
        border: '1px solid rgba(255, 255, 255, 0.35)',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px) saturate(100%)',
        WebkitBackdropFilter: 'blur(20px) saturate(100%)',
        background: `
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.4) 5%,
            rgba(255, 255, 255, 0.4) 95%,
            rgba(255, 255, 255, 0.35) 100%
          )
        `
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <h2 className="text-xl font-light text-gray-700">Start</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
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
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 
                     rounded-lg text-gray-700 placeholder-gray-500
                     focus:outline-none focus:border-blue-400/50 focus:bg-white/60
                     transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Pinned Section */}
        <div className="w-1/2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Pinned</h3>
          <div className="grid grid-cols-3 gap-2 overflow-y-auto">
            {filteredApps.slice(0, 6).map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="flex flex-col items-center p-4 rounded-lg
                         hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center
                              bg-white/40 rounded-lg group-hover:bg-white/60
                              transition-colors">
                  {typeof app.icon === 'string' ? (
                    <span className="text-2xl">{app.icon}</span>
                  ) : (
                    <app.icon className="w-6 h-6 text-gray-700" />
                  )}
                </div>
                <span className="text-xs text-gray-700 text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* All Apps Section */}
        <div className="w-1/2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-600 mb-3">All apps</h3>
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                         hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center
                              bg-white/30 rounded">
                  {typeof app.icon === 'string' ? (
                    <span className="text-lg">{app.icon}</span>
                  ) : (
                    <app.icon className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-white/20">
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg
                         hover:bg-white/10 transition-colors">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">User</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Power className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}