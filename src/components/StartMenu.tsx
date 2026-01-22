'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Settings, FolderOpen, ChevronRight, MoreHorizontal, Play, Pause, Power, Music, SkipBack, SkipForward, Moon, RefreshCw, LogOut, Globe, Clock, Image, Calendar, FileText } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useSystemStore, formatRelativeTime, formatTime } from '@/store/systemStore'
import Dropdown from './Dropdown'
import './startmenu.css'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onSleep?: () => void
  onRestart?: () => void
  onShutdown?: () => void
  onLock?: () => void
}

export default function StartMenu({ isOpen, onClose, onSleep, onRestart, onShutdown, onLock }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { apps, openWindow } = useAppStore()
  const menuRef = useRef<HTMLDivElement>(null)

  // Get real data from system store
  const {
    recentFiles,
    weather,
    calendarEvents,
    mediaPlayer,
    togglePlayPause,
    nextTrack,
    prevTrack,
    discord,
    userProfile,
    quickAccessFolders
  } = useSystemStore()

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

  // Get today's calendar events
  const todayEvents = calendarEvents.filter(e => {
    const today = new Date()
    const eventDate = new Date(e.date)
    return eventDate.toDateString() === today.toDateString()
  })

  // Get file icon based on type
  const getFileIcon = (type: string, icon: string) => {
    if (icon) return icon
    switch (type) {
      case 'folder': return '📁'
      case 'code': return '⚛️'
      case 'document': return '📄'
      case 'image': return '🖼️'
      case 'video': return '🎬'
      case 'audio': return '🎵'
      default: return '📄'
    }
  }

  // Get gradient color based on file type
  const getFileGradient = (type: string) => {
    switch (type) {
      case 'folder': return 'from-yellow-400 to-orange-500'
      case 'code': return 'from-blue-400 to-blue-600'
      case 'document': return 'from-gray-400 to-gray-600'
      case 'image': return 'from-purple-400 to-pink-500'
      case 'video': return 'from-red-400 to-rose-600'
      case 'audio': return 'from-green-400 to-emerald-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Start Menu */}
      <div
        ref={menuRef}
        className="start-menu-container fixed"
        style={{
          bottom: '62px',
          left: '8px',
          width: '680px',
          height: '520px',
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
                <span className="text-white text-xs font-semibold">{userProfile.avatar}</span>
              </div>
              <span className="text-[13px] font-medium text-gray-700">{userProfile.name}</span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleAppClick('explorer')}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                title="File Explorer"
              >
                <FolderOpen className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleAppClick('settings')}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <Dropdown
                trigger={
                  <button className="p-2 hover:bg-black/5 rounded-lg transition-colors" title="Power">
                    <Power className="w-5 h-5 text-gray-600" />
                  </button>
                }
                position="top-right"
                items={[
                  {
                    id: 'sleep',
                    label: 'Sleep',
                    icon: <Moon className="w-4 h-4" />,
                    onClick: onSleep
                  },
                  {
                    id: 'restart',
                    label: 'Restart',
                    icon: <RefreshCw className="w-4 h-4" />,
                    onClick: onRestart
                  },
                  { id: 'divider-1', label: '', divider: true },
                  {
                    id: 'lock',
                    label: 'Lock',
                    icon: <LogOut className="w-4 h-4" />,
                    onClick: onLock
                  },
                  {
                    id: 'shutdown',
                    label: 'Shut down',
                    icon: <Power className="w-4 h-4" />,
                    onClick: onShutdown,
                    danger: true
                  }
                ]}
              />
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

            {/* Pinned Apps Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Pinned</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                  All apps <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {/* File Explorer */}
                <button
                  onClick={() => handleAppClick('explorer')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Files</span>
                </button>

                {/* Edge */}
                <button
                  onClick={() => handleAppClick('edge')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 rounded-xl flex items-center justify-center shadow-sm">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Edge</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => handleAppClick('settings')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Settings</span>
                </button>

                {/* Photos */}
                <button
                  onClick={() => handleAppClick('photos')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Photos</span>
                </button>

                {/* Calendar */}
                <button
                  onClick={() => handleAppClick('calendar')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Calendar</span>
                </button>

                {/* Notepad */}
                <button
                  onClick={() => handleAppClick('notepad')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Notepad</span>
                </button>

                {/* Clock */}
                <button
                  onClick={() => handleAppClick('clock')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Clock</span>
                </button>

                {/* Music */}
                <button
                  onClick={() => handleAppClick('music')}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-95"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] text-gray-700">Music</span>
                </button>
              </div>
            </div>

            {/* Recommended Section - Recent Files */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Recommended</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
                  More <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent space-y-0.5 pr-1">
                {/* Recent files from system store */}
                {recentFiles.slice(0, 6).map((file) => (
                  <button
                    key={file.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-all duration-150 active:scale-[0.98]"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${getFileGradient(file.type)} rounded-lg flex items-center justify-center shadow-sm`}>
                      <span className="text-sm">{getFileIcon(file.type, file.icon)}</span>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700 truncate">{file.name}</div>
                      <div className="text-[10px] text-gray-500">{formatRelativeTime(file.lastOpened)}</div>
                    </div>
                    {file.pinned && (
                      <span className="text-[10px] text-blue-500 font-medium">Pinned</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Widgets */}
          <div className="w-[55%] p-3 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

            {/* Weather Widget - Real Data */}
            <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="text-sm">{weather.icon}</span> Weather
                </h4>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>{weather.windSpeed} mph winds</div>
                  <div>Sunset at {weather.sunset}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light text-gray-800">{weather.temperature}°F</div>
                  <div className="text-xs text-gray-500">{weather.condition}</div>
                </div>
              </div>

              <div className="flex justify-between text-xs bg-black/5 rounded-lg p-2">
                {weather.hourly.map((hour, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-gray-500 mb-0.5">{hour.time}</div>
                    <div className="text-sm">{hour.icon}</div>
                    <div className="text-gray-700 font-medium mt-0.5">{hour.temp}°</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Player Widget - Real Data */}
            <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-gray-600" />
                  Now Playing
                </h4>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {mediaPlayer.currentTrack ? (
                <div className="flex gap-3 items-center">
                  {/* Album Art */}
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-md flex-shrink-0">
                    <Music className="w-6 h-6 text-white/90" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Track Info */}
                    <div className="mb-1.5">
                      <div className="text-xs font-medium text-gray-800 truncate">{mediaPlayer.currentTrack.title}</div>
                      <div className="text-[10px] text-gray-500 truncate">{mediaPlayer.currentTrack.artist} • {mediaPlayer.currentTrack.album}</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{formatTime(mediaPlayer.currentTrack.currentTime)}</span>
                      <div className="flex-1 h-1 bg-gray-300/50 rounded-full relative group cursor-pointer">
                        <div
                          className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${(mediaPlayer.currentTrack.currentTime / mediaPlayer.currentTrack.duration) * 100}%` }}
                        />
                        <div
                          className="absolute h-2 w-2 bg-purple-500 rounded-full -top-[2px] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ left: `${(mediaPlayer.currentTrack.currentTime / mediaPlayer.currentTrack.duration) * 100}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>
                      <span>{formatTime(mediaPlayer.currentTrack.duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={prevTrack} className="text-gray-500 hover:text-gray-700 transition-colors p-1">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={togglePlayPause}
                      className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                    >
                      {mediaPlayer.isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                    <button onClick={nextTrack} className="text-gray-500 hover:text-gray-700 transition-colors p-1">
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No track playing
                </div>
              )}
            </div>

            {/* Two widgets side by side */}
            <div className="grid grid-cols-2 gap-2">
              {/* Discord Widget - Real Data */}
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
                  {discord.messages.slice(0, 2).map((msg) => (
                    <div key={msg.id} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">{msg.from}</span>
                        {msg.unread > 0 && (
                          <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                            {msg.unread}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Widget - Real Data */}
              <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-2.5 border border-white/50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <span className="text-sm">📅</span> Calendar
                  </h4>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-lg font-light text-gray-800 mb-2">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                <div className="space-y-1.5">
                  {todayEvents.length > 0 ? (
                    todayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="flex gap-2 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer">
                        <div className="w-1 h-full rounded-full flex-shrink-0" style={{ backgroundColor: event.color }}></div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-gray-800 truncate">{event.title}</div>
                          <div className="text-[10px] text-gray-500">{event.time}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-gray-500 text-center py-2">
                      No events today
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Access Folders */}
            <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-gray-600" />
                  Quick Access
                </h4>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {quickAccessFolders.slice(0, 6).map((folder) => (
                  <button
                    key={folder.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <span className="text-lg">{folder.icon}</span>
                    <span className="text-xs text-gray-700 truncate">{folder.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
