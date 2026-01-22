'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Settings, FolderOpen, Clock, ChevronRight, MoreHorizontal, ChevronLeft, ChevronRight as Next, Play, Power, Music, SkipBack, SkipForward } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import './startmenu.css'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { apps, openWindow } = useAppStore()
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop overlay with blur */}
      <div
        className={`
          fixed inset-0 transition-opacity duration-200
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />

      {/* Start Menu */}
      <div
        ref={menuRef}
        className="start-menu-container fixed"
        style={{
          bottom: '56px',
          left: '8px',
          width: '680px',
          height: '480px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          background: `
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.85) 0%,
              rgba(255, 255, 255, 0.75) 50%,
              rgba(245, 245, 250, 0.8) 100%
            )
          `,
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 1px 0 rgba(255, 255, 255, 0.5) inset
          `,
          zIndex: 9999,
          transform: isAnimating
            ? 'translateY(0) scale(1)'
            : 'translateY(20px) scale(0.95)',
          opacity: isAnimating ? 1 : 0,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
          transformOrigin: 'bottom left',
          overflow: 'hidden'
        }}
      >
        {/* Navbar */}
        <div className="py-3 px-4 flex items-center justify-between" style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.2))',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          {/* Left Side - Search Bar */}
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, settings, files..."
                className="w-[300px] h-9 pl-10 pr-4 rounded-lg text-[13px]
                         bg-white/70 hover:bg-white/90 focus:bg-white
                         border border-gray-200/50
                         placeholder-gray-500 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Side - Profile and Icons */}
          <div className="flex items-center gap-3">
            {/* Profile with avatar and name */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-semibold">C</span>
              </div>
              <span className="text-[13px] font-medium text-gray-700">Concept Central</span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-0.5">
              <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                <FolderOpen className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
              >
                <Power className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Accent bar */}
        <div className="h-[2px]" style={{
          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.6) 0%, rgba(147, 51, 234, 0.4) 50%, transparent 100%)'
        }} />

        {/* Main Container - Two Columns */}
        <div className="flex" style={{ height: 'calc(100% - 58px)' }}>

          {/* Left Column - Apps */}
          <div className="w-[45%] p-4 flex flex-col" style={{ borderRight: '1px solid rgba(0,0,0,0.05)' }}>

            {/* Most Used Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Pinned</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                  All apps <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {/* Weather */}
                <button
                  onClick={() => handleAppClick('weather')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xl">☀️</span>
                  </div>
                  <span className="text-[11px] text-gray-700">Weather</span>
                </button>

                {/* Discord */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                  <span className="text-[11px] text-gray-700">Discord</span>
                </button>

                {/* File Explorer */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Files</span>
                </button>

                {/* Calendar */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">📅</span>
                  </div>
                  <span className="text-[11px] text-gray-700">Calendar</span>
                </button>

                {/* Settings */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Settings</span>
                </button>

                {/* Photos */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">🏞️</span>
                  </div>
                  <span className="text-[11px] text-gray-700">Photos</span>
                </button>

                {/* Edge */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">e</span>
                  </div>
                  <span className="text-[11px] text-gray-700">Edge</span>
                </button>

                {/* Clock */}
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Clock</span>
                </button>
              </div>
            </div>

            {/* Recommended Section */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Recommended</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                  More <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent space-y-0.5 pr-1">
                {/* Recent items */}
                {[
                  { name: 'Project.tsx', desc: 'Yesterday', icon: '📄', color: 'from-blue-400 to-blue-600' },
                  { name: 'Design System', desc: '2 days ago', icon: '🎨', color: 'from-pink-400 to-rose-500' },
                  { name: 'API Documentation', desc: '3 days ago', icon: '📚', color: 'from-emerald-400 to-teal-500' },
                  { name: 'Meeting Notes', desc: 'Last week', icon: '📝', color: 'from-amber-400 to-orange-500' },
                  { name: 'Screenshots', desc: 'Last week', icon: '📷', color: 'from-violet-400 to-purple-500' },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-[0.98]">
                    <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-sm`}>
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-medium text-gray-700">{item.name}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Widgets */}
          <div className="w-[55%] p-3 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="text-sm">☀️</span> Weather
                </h4>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>15 mph winds</div>
                  <div>Sunset at 7:58 PM</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light text-gray-800">60°F</div>
                  <div className="text-xs text-gray-500">Sunny</div>
                </div>
              </div>

              <div className="flex justify-between text-xs bg-black/5 rounded-lg p-2">
                {[
                  { temp: '60°', icon: '☀️', time: 'Now' },
                  { temp: '61°', icon: '☀️', time: '2PM' },
                  { temp: '62°', icon: '☀️', time: '3PM' },
                  { temp: '67°', icon: '🌤️', time: '4PM' },
                  { temp: '66°', icon: '☀️', time: '5PM' },
                  { temp: '64°', icon: '🌅', time: '6PM' },
                ].map((hour, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-gray-500 mb-0.5">{hour.time}</div>
                    <div className="text-sm">{hour.icon}</div>
                    <div className="text-gray-700 font-medium mt-0.5">{hour.temp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Player Widget - Full Width */}
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 shadow-lg">
              <div className="flex gap-3">
                {/* Album Art */}
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-md flex-shrink-0">
                  <Music className="w-8 h-8 text-white/80" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Track Info */}
                  <div className="mb-2">
                    <div className="text-sm font-medium text-white truncate">Daydream</div>
                    <div className="text-xs text-gray-400 truncate">Artist Name • Album</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full flex items-center gap-2 text-[10px] text-gray-400 mb-2">
                    <span>1:02</span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full relative group cursor-pointer">
                      <div className="absolute h-full w-1/3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                      <div className="absolute h-2.5 w-2.5 bg-white rounded-full -top-[3px] left-1/3 -translate-x-1/2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span>2:49</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                    >
                      <Play className={`w-4 h-4 text-gray-900 ${!isPlaying ? 'ml-0.5' : ''}`} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Two widgets side by side */}
            <div className="grid grid-cols-2 gap-2">
              {/* Discord Widget */}
              <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-2.5 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">D</span>
                    </div>
                    Discord
                  </h4>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">James</span>
                      <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">3</span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">Yuh I don&apos;t wanna be in...</div>
                  </div>

                  <div className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white" style={{fontSize: '7px'}}>C</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700">Concept Central</span>
                      </div>
                      <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">6</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Link in description</div>
                  </div>
                </div>
              </div>

              {/* Calendar Widget */}
              <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-2.5 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <span className="text-sm">📅</span> Calendar
                  </h4>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-lg font-light text-gray-800 mb-2">Jan 22</div>

                <div className="space-y-1.5">
                  <div className="flex gap-2 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer">
                    <div className="w-1 h-full bg-red-400 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-gray-800 truncate">Launch merch store</div>
                      <div className="text-[10px] text-gray-500">2:00 PM</div>
                    </div>
                  </div>

                  <div className="flex gap-2 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer">
                    <div className="w-1 h-full bg-purple-400 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-gray-800 truncate">Twitter update</div>
                      <div className="text-[10px] text-gray-500">5:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
