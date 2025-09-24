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
        absolute bottom-14 left-0 w-[700px] h-[500px]
        rounded-2xl shadow-2xl
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
      {/* Navbar */}
      <div className="h-14 flex items-center px-6 bg-white/5">
        <div className="flex-1 flex items-center">
          {/* Search Bar */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything"
              className="w-full pl-9 pr-4 py-1.5 bg-white/20 
                       rounded-md text-sm text-gray-700 placeholder-gray-400
                       focus:outline-none focus:bg-white/30
                       transition-all"
            />
          </div>
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Z</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Concept Central</span>
        </div>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
            <FolderOpen className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Power className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Section - Apps */}
        <div className="flex-1 flex flex-col p-4">
          {/* Section Title */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Most used</h3>
            <button className="text-xs text-gray-500 hover:text-gray-700">All apps &gt;</button>
          </div>

          {/* Apps List */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {mostUsedApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="w-full flex items-center gap-3 p-2 rounded-lg
                         hover:bg-white/20 transition-all text-left group"
              >
                <div className="w-10 h-10 flex items-center justify-center
                              bg-white/20 rounded-lg group-hover:bg-white/30
                              transition-colors">
                  {typeof app.icon === 'string' ? (
                    <span className="text-xl">{app.icon}</span>
                  ) : (
                    <app.icon className="w-6 h-6 text-gray-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700">{app.name}</div>
                  {appDescriptions[app.id] && (
                    <div className="text-xs text-gray-500 truncate">{appDescriptions[app.id]}</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Recommended</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/20 text-left">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/20 text-left">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-700">Media Player</div>
                  <div className="text-xs text-gray-500">Now playing - Daydream</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Widgets */}
        <div className="w-80 p-3 space-y-2">
          {/* Weather Widget - Large Rectangle */}
          <div className="bg-white/15 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">☀️</span>
                <h3 className="text-sm font-medium text-gray-700">Weather</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-sm">•••</span>
              </button>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-500">15mph winds</div>
                <div className="text-xs text-gray-500">Sunset at 7:58</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-700">60° F</div>
                <div className="text-2xl">☀️</div>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="text-center">
                <div>☀️</div>
                <div className="text-gray-600 mt-1">60°</div>
              </div>
              <div className="text-center">
                <div>☁️</div>
                <div className="text-gray-600 mt-1">61°</div>
              </div>
              <div className="text-center">
                <div>☀️</div>
                <div className="text-gray-600 mt-1">62°</div>
              </div>
              <div className="text-center">
                <div>☀️</div>
                <div className="text-gray-600 mt-1">62°</div>
              </div>
              <div className="text-center">
                <div>🌤️</div>
                <div className="text-gray-600 mt-1">67°</div>
              </div>
              <div className="text-center">
                <div>☀️</div>
                <div className="text-gray-600 mt-1">66°</div>
              </div>
              <div className="text-center">
                <div>☀️</div>
                <div className="text-gray-600 mt-1">69°</div>
              </div>
            </div>
          </div>

          {/* Row with Discord and Media Player */}
          <div className="grid grid-cols-2 gap-3">
            {/* Discord Widget */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Discord</h3>
                </div>
                <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <span className="text-gray-500 text-xs">•••</span>
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-gray-700">James</div>
                  <div className="text-xs text-gray-500">Yuh i don't wanna be in...</div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                    <div className="text-xs font-medium text-gray-700">Concept Central</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Link in description</div>
                </div>
              </div>
            </div>

            {/* Media Player Widget */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Media Player</h3>
                <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <span className="text-gray-500 text-xs">•••</span>
                </button>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-gray-600">Now playing - Daydream</div>
                <div className="flex items-center justify-center gap-3 my-4">
                  <button className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                    <span className="text-gray-700">⏮</span>
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                    <span className="text-gray-700 text-lg">‖</span>
                  </button>
                  <button className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                    <span className="text-gray-700">⏭</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>1:02</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-orange-400 rounded-full"></div>
                  </div>
                  <span>2:49</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Widget - Large Square */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-medium text-gray-700">Calendar</h3>
              </div>
              <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <span className="text-gray-500 text-xs">•••</span>
              </button>
            </div>
            <div className="text-2xl font-light text-gray-800 mb-2">5/21/22</div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-1"></div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Launch merch store</div>
                  <div className="text-xs text-gray-500">Community designed merch!</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-1"></div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Give update to Twitter</div>
                  <div className="text-xs text-gray-500">@Concept_Central</div>
                </div>
              </div>
            </div>
            <button className="mt-3 text-center w-full">
              <span className="text-2xl text-gray-400">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}