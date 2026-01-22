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
      // Dispatch custom event for restore animation
      globalThis.window.dispatchEvent(new CustomEvent('window-restore', { 
        detail: { windowId } 
      }))
      restoreWindow(windowId)
      focusWindow(windowId)
    } else if (isActive) {
      // Dispatch custom event for minimize animation
      globalThis.window.dispatchEvent(new CustomEvent('window-minimize', { 
        detail: { windowId } 
      }))
    } else {
      focusWindow(windowId)
    }
  }

  return (
    <div className="relative group" data-window-id={windowId}>
      <button
        onClick={handleClick}
        className={`
          w-11 h-11 rounded-lg transition-all relative
          flex items-center justify-center
          ${isActive
            ? 'bg-white/25 backdrop-blur-md shadow-lg shadow-white/20'
            : 'bg-white/10 hover:bg-white/15 backdrop-blur-md'
          }
        `}
      >
        {typeof app.icon === 'string' ? (
          <span className="text-xl">{app.icon}</span>
        ) : (
          <app.icon className="w-6 h-6 text-white" />
        )}
        
        {/* Active indicator */}
        <div className={`
          absolute bottom-0 left-1/2 -translate-x-1/2 transition-all
          ${isActive ? 'w-8 h-0.5' : 'w-2 h-0.5'}
          bg-white/80 rounded-full
        `} />
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