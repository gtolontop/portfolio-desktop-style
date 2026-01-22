'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Music, MoreHorizontal, Plus, ChevronRight, Bell, Newspaper, TrendingUp, Cloud, Calendar, MessageSquare } from 'lucide-react'
import { useSystemStore, formatRelativeTime, formatTime } from '@/store/systemStore'

interface WidgetsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function WidgetsPanel({ isOpen, onClose }: WidgetsPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const {
    weather,
    mediaPlayer,
    togglePlayPause,
    nextTrack,
    prevTrack,
    discord,
    calendarEvents,
    notifications
  } = useSystemStore()

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const todayEvents = calendarEvents.filter(e => {
    const today = new Date()
    const eventDate = new Date(e.date)
    return eventDate.toDateString() === today.toDateString()
  })

  const unreadNotifications = notifications.filter(n => !n.read).length

  if (!isVisible) return null

  return (
    <div
      ref={panelRef}
      className="fixed overflow-hidden"
      style={{
        bottom: '62px',
        left: '8px',
        width: '380px',
        height: '580px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        background: `
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.85) 50%,
            rgba(248, 248, 252, 0.9) 100%
          )
        `,
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset
        `,
        zIndex: 9999,
        transform: isAnimating
          ? 'translateY(0) scale(1)'
          : 'translateY(20px) scale(0.95)',
        opacity: isAnimating ? 1 : 0,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
        transformOrigin: 'bottom left'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Widgets</h2>
        <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Widgets Grid */}
      <div className="p-3 overflow-y-auto space-y-3" style={{ height: 'calc(100% - 65px)' }}>

        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              <span className="font-medium">{weather.location}</span>
            </div>
            <button className="text-white/70 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-5xl font-light">{weather.temperature}°</div>
              <div className="text-white/80 text-sm">{weather.condition}</div>
            </div>
            <div className="text-6xl">{weather.icon}</div>
          </div>

          <div className="flex justify-between text-xs bg-white/20 rounded-lg p-2">
            {weather.hourly.map((hour, i) => (
              <div key={i} className="text-center">
                <div className="text-white/70 mb-1">{hour.time}</div>
                <div className="text-xl mb-1">{hour.icon}</div>
                <div className="font-medium">{hour.temp}°</div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between text-xs text-white/70">
            <span>Wind: {weather.windSpeed} mph</span>
            <span>Humidity: {weather.humidity}%</span>
            <span>Sunset: {weather.sunset}</span>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Today</span>
            </div>
            <button className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="text-2xl font-light text-gray-800 mb-3">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          {todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map(event => (
                <div key={event.id} className="flex gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                  <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }}></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 truncate">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No events scheduled for today
            </div>
          )}
        </div>

        {/* Media Player Widget */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              <span className="font-medium">Now Playing</span>
            </div>
            <button className="text-white/70 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {mediaPlayer.currentTrack ? (
            <>
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Music className="w-8 h-8 text-white/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{mediaPlayer.currentTrack.title}</div>
                  <div className="text-white/70 text-sm truncate">{mediaPlayer.currentTrack.artist}</div>
                  <div className="text-white/50 text-xs truncate">{mediaPlayer.currentTrack.album}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="w-full h-1.5 bg-white/30 rounded-full relative group cursor-pointer">
                  <div
                    className="absolute h-full bg-white rounded-full"
                    style={{ width: `${(mediaPlayer.currentTrack.currentTime / mediaPlayer.currentTrack.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>{formatTime(mediaPlayer.currentTrack.currentTime)}</span>
                  <span>{formatTime(mediaPlayer.currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button onClick={prevTrack} className="text-white/70 hover:text-white transition-colors p-2">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {mediaPlayer.isPlaying ? (
                    <Pause className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                  )}
                </button>
                <button onClick={nextTrack} className="text-white/70 hover:text-white transition-colors p-2">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-white/70">
              No track playing
            </div>
          )}
        </div>

        {/* Two widgets side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Discord Widget */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">Discord</span>
              </div>
              {discord.messages.reduce((acc, m) => acc + m.unread, 0) > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {discord.messages.reduce((acc, m) => acc + m.unread, 0)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {discord.messages.slice(0, 2).map(msg => (
                <div key={msg.id} className="p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{msg.from}</span>
                    {msg.unread > 0 && (
                      <span className="bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {msg.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Widget */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800 text-sm">Alerts</span>
              </div>
              {unreadNotifications > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadNotifications}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {notifications.slice(0, 2).map(notif => (
                <div key={notif.id} className="p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{notif.icon}</span>
                    <span className="text-xs font-medium text-gray-700 truncate">{notif.title}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 truncate ml-6">{notif.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Widget */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Top Stories</span>
            </div>
            <button className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700">
              More <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Tech Industry Sees Major Growth in AI Sector', source: 'TechNews', time: '2h ago' },
              { title: 'New Study Reveals Benefits of Remote Work', source: 'Business Daily', time: '4h ago' },
            ].map((news, i) => (
              <div key={i} className="p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                <div className="text-sm font-medium text-gray-800 line-clamp-2">{news.title}</div>
                <div className="text-xs text-gray-500 mt-1">{news.source} • {news.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stocks Widget */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-800">Markets</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { symbol: 'AAPL', name: 'Apple Inc.', price: '$178.42', change: '+1.23%', up: true },
              { symbol: 'MSFT', name: 'Microsoft', price: '$378.91', change: '+0.89%', up: true },
              { symbol: 'GOOGL', name: 'Alphabet', price: '$141.80', change: '-0.45%', up: false },
            ].map((stock, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{stock.symbol}</div>
                  <div className="text-xs text-gray-500">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{stock.price}</div>
                  <div className={`text-xs ${stock.up ? 'text-green-600' : 'text-red-600'}`}>{stock.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
