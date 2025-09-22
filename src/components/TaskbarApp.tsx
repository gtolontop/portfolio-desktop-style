'use client'

import { useAppStore } from '@/store/appStore'

interface TaskbarAppProps {
  windowId: string
}

export default function TaskbarApp({ windowId }: TaskbarAppProps) {
  const { windows, getApp, focusWindow, minimizeWindow, restoreWindow, activeWindowId } = useAppStore()
  const window = windows.get(windowId)

  if (!window) return null

  const app = getApp(window.appId)
  if (!app) return null

  const isActive = activeWindowId === windowId

  const handleClick = () => {
    if (window.isMinimized) {
      restoreWindow(windowId)
      focusWindow(windowId)
    } else if (isActive) {
      minimizeWindow(windowId)
    } else {
      focusWindow(windowId)
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`
          w-11 h-11 rounded-lg transition-all
          flex items-center justify-center
          ${isActive
            ? 'bg-white/20 backdrop-blur-md'
            : 'bg-white/5 hover:bg-white/15 backdrop-blur-md'
          }
        `}
      >
        {typeof app.icon === 'string' ? (
          <span className="text-xl">{app.icon}</span>
        ) : (
          <app.icon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      pointer-events-none whitespace-nowrap">
        <div className="bg-gray-900/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
          {app.name}
        </div>
      </div>
    </div>
  )
}