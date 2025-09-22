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
    <button
      onClick={handleClick}
      className={`
        px-3 py-2 rounded-lg transition-all
        flex items-center gap-2 min-w-[150px] max-w-[200px]
        ${isActive
          ? 'bg-pink-600/30 border border-pink-500/50'
          : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
        }
      `}
    >
      <span className="text-lg">
        {app.icon.startsWith('http') || app.icon.startsWith('/') ? (
          <img src={app.icon} alt={app.name} className="w-5 h-5" />
        ) : (
          app.icon
        )}
      </span>
      <span className="text-sm text-white truncate">
        {app.name}
      </span>
    </button>
  )
}