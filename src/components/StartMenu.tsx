'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Mail, Share2, Settings, FolderOpen, Clock, ChevronRight, MoreHorizontal, ChevronLeft, ChevronRight as Next, Pause, Play } from 'lucide-react'
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
        const taskbar = document.querySelector('.taskbar-start-button')
        if (taskbar && taskbar.contains(e.target as Node)) return
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleAppClick = (appId: string) => {
    openWindow(appId)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className={`
        absolute bottom-14 left-0 w-[900px] h-[600px]
        rounded-xl overflow-hidden
        transition-all duration-300 ease-out origin-bottom-left
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}
      style={{
        backgroundColor: 'rgba(250, 251, 252, 0.85)',
        backdropFilter: 'blur(60px) saturate(150%)',
        WebkitBackdropFilter: 'blur(60px) saturate(150%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}
    >
      {/* Main Container - Two Columns */}
      <div className="h-full flex">
        
        {/* Left Column */}
        <div className="w-[55%] p-6 pr-4 flex flex-col">
          
          {/* Search and User Section */}
          <div className="flex items-center gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything"
                className="w-full h-10 pl-11 pr-4 rounded-full text-sm
                         bg-white/60 backdrop-blur-sm
                         border border-gray-200/50
                         placeholder-gray-400 text-gray-700
                         focus:outline-none focus:bg-white/80 focus:border-gray-300/50
                         transition-all"
              />
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-blue-500 text-lg font-bold">∞</span>
              </div>
              <span className="text-sm font-medium text-gray-800">Concept Central</span>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors">
                <Mail className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Most Used Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Most used</h3>
              <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                All apps <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-1">
              {/* Weather */}
              <button 
                onClick={() => handleAppClick('weather')}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">☀️</span>
                </div>
                <span className="text-sm text-gray-700">Weather</span>
              </button>
              
              {/* Discord */}
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">D</span>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-700">Discord</div>
                  <div className="text-xs text-gray-500">Concept Central</div>
                </div>
              </button>
              
              {/* File Explorer */}
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700">File Explorer</span>
              </button>
              
              {/* Calendar */}
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📅</span>
                </div>
                <span className="text-sm text-gray-700">Calendar</span>
              </button>
              
              {/* Clock */}
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700">Clock</span>
              </button>
            </div>
          </div>

          {/* Recommended Section */}
          <div className="mt-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recommended</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Settings */}
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-gray-600">Settings</span>
              </button>
              
              {/* Media Player */}
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">▶</span>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Media Player</div>
                  <div className="text-xs text-gray-400">Now playing - Daydream</div>
                </div>
              </button>
              
              {/* Photos */}
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏞️</span>
                </div>
                <span className="text-xs text-gray-600">Photos</span>
              </button>
              
              {/* Edge */}
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">E</span>
                </div>
                <span className="text-xs text-gray-600">Edge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gray-200/50"></div>

        {/* Right Column - Widgets */}
        <div className="flex-1 p-6 pl-4 flex flex-col gap-3">
          
          {/* Weather Widget */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <span>☀️</span> Weather
              </h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between items-start mb-3">
              <div className="text-xs text-gray-500">
                <div>15mph winds</div>
                <div>Sunset at 7:58</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">60° F</div>
                <span className="text-2xl">☀️</span>
              </div>
            </div>
            
            <div className="flex justify-between text-xs">
              {[
                { temp: '60°', icon: '☀️' },
                { temp: '61°', icon: '☀️' },
                { temp: '62°', icon: '☀️' },
                { temp: '62°', icon: '☀️' },
                { temp: '67°', icon: '🌤️' },
                { temp: '66°', icon: '☀️' },
                { temp: '69°', icon: '☀️' }
              ].map((day, i) => (
                <div key={i} className="text-center">
                  <div>{day.icon}</div>
                  <div className="text-gray-600 mt-1">{day.temp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two widgets side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Discord Widget */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">D</span>
                  </div>
                  Discord
                </h4>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">James</span>
                    <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                  </div>
                  <div className="text-xs text-gray-500">Yuh I don't wanna be in</div>
                  <div className="text-xs text-gray-500">ur video pls don't add me</div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white" style={{fontSize: '8px'}}>C</span>
                      </div>
                      <span className="text-xs font-medium text-gray-700">Concept Central</span>
                    </div>
                    <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">6</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Link in description</div>
                </div>
              </div>
            </div>

            {/* Media Player Widget */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">Media Player</h4>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-2">
                <div className="flex items-center gap-3 mb-3">
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                    <Play className="w-6 h-6 text-gray-800 ml-0.5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Next className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="w-full flex items-center gap-2 text-xs text-gray-500">
                  <span>1:02</span>
                  <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                    <div className="absolute h-full w-1/3 bg-orange-400 rounded-full"></div>
                    <div className="absolute h-3 w-3 bg-orange-400 rounded-full -top-1 left-1/3 -translate-x-1/2"></div>
                  </div>
                  <span>2:49</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <span className="text-blue-500">📅</span> Calendar
              </h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-2xl font-light text-gray-800 mb-4">5/21/22</div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-medium text-gray-800">Launch merch store</div>
                  <div className="text-xs text-gray-500">Community-designed merch!</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-medium text-gray-800">Give update to Twitter</div>
                  <div className="text-xs text-gray-500">@Concept_Central</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}