'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Share2, Settings, FolderOpen, Clock, ChevronRight, MoreHorizontal, ChevronLeft, ChevronRight as Next, Pause, Play, Power } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import './startmenu.css'

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
        fixed bottom-14 left-2 w-[90vw] max-w-[600px] h-[80vh] max-h-[500px]
        rounded-[7px] shadow-2xl
        flex flex-col overflow-hidden
        transition-all duration-300 ease-out origin-bottom-left
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        pointer-events-auto
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
        `,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        zIndex: 9999
      }}
    >
      {/* Navbar */}
      <div className="py-3 px-3 flex items-center justify-between bg-white/10" style={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        {/* Left Side - Search Bar */}
        <div className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything"
              className="w-[280px] h-8 pl-10 pr-4 rounded-md text-[13px]
                       bg-white/80
                       border border-gray-300/50
                       placeholder-gray-600 text-gray-800
                       focus:outline-none focus:bg-white focus:border-blue-400/50
                       transition-all"
            />
          </div>
        </div>

        {/* Right Side - Profile and Icons */}
        <div className="flex items-center gap-3">
          {/* Profile with avatar and name */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
            <span className="text-[13px] font-medium text-gray-800">Concept Central</span>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-black/5 rounded-md transition-colors">
              <FolderOpen className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1.5 hover:bg-black/5 rounded-md transition-colors">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-black/5 rounded-md transition-colors"
            >
              <Power className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Blue accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500/70 via-blue-400/50 to-transparent"></div>

      {/* Main Container - Two Columns */}
      <div className="flex-1 flex">

        {/* Left Column */}
        <div className="w-[55%] p-4 pr-3 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

          {/* Most Used Section */}
          <div className="mb-4">
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
                className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
                  <span className="text-lg">☀️</span>
                </div>
                <span className="text-xs text-gray-700">Weather</span>
              </button>
              
              {/* Discord */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">D</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-700">Discord</div>
                  <div className="text-[10px] text-gray-500">Concept Central</div>
                </div>
              </button>
              
              {/* File Explorer */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-gray-700">File Explorer</span>
              </button>
              
              {/* Calendar */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <span className="text-xs text-gray-700">Calendar</span>
              </button>
              
              {/* Clock */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-gray-700">Clock</span>
              </button>
            </div>
          </div>

          {/* Recommended Section */}
          <div className="mt-6">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Recommended</h3>
            <div className="space-y-1">
              {/* Settings */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-gray-700">Settings</span>
              </button>

              {/* Media Player */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">▶</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-700">Media Player</div>
                  <div className="text-[10px] text-gray-500">Now playing - Daydream</div>
                </div>
              </button>

              {/* Photos */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🏞️</span>
                </div>
                <span className="text-xs text-gray-700">Photos</span>
              </button>

              {/* Edge */}
              <button className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <span className="text-xs text-gray-700">Edge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Widgets */}
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border-l border-gray-200/30">
          
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