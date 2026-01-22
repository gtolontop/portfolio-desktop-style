'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Bell, ChevronRight, Trash2, Settings } from 'lucide-react'
import { useSystemStore, formatRelativeTime } from '@/store/systemStore'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const { notifications, markNotificationRead, clearNotifications } = useSystemStore()

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

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isVisible) return null

  return (
    <div
      ref={panelRef}
      className="fixed"
      style={{
        bottom: '62px',
        right: '8px',
        width: '380px',
        maxHeight: '500px',
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
        transformOrigin: 'bottom right',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200/50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearNotifications}
            className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-black/5 rounded-lg transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-2">
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`
                  p-3 rounded-lg transition-all duration-150 cursor-pointer group
                  ${notification.read
                    ? 'bg-white/30 hover:bg-white/50'
                    : 'bg-white/60 hover:bg-white/80 border-l-2 border-blue-500'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl flex-shrink-0">{notification.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-gray-500">{notification.app}</span>
                      <span className="text-[10px] text-gray-400">{formatRelativeTime(notification.time)}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 truncate">{notification.title}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">{notification.message}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Would remove notification
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs text-gray-400">You&apos;re all caught up!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200/50 flex-shrink-0">
        <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 py-1">
          Notification settings <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
