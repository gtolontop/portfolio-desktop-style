'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus, Square, Maximize } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { AppWindow } from '@/types/app.types'

interface WindowProps {
  window: AppWindow
  children: React.ReactNode
}

export default function Window({ window, children }: WindowProps) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId,
    getApp
  } = useAppStore()

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isOpening, setIsOpening] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isRestoringFromDrag, setIsRestoringFromDrag] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const app = getApp(window.appId)
  const isActive = activeWindowId === window.id

  useEffect(() => {
    // Remove opening animation after component mounts
    const timer = setTimeout(() => {
      setIsOpening(false)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Handle restore animation when window is un-minimized
    if (!window.isMinimized && isMinimizing) {
      setIsMinimizing(false)
      setIsRestoring(true)
      const timer = setTimeout(() => {
        setIsRestoring(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [window.isMinimized, isMinimizing])

  useEffect(() => {
    // Listen for minimize/restore events from taskbar
    const handleMinimizeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string }>
      if (customEvent.detail.windowId === window.id) {
        setIsMinimizing(true)
        setTimeout(() => {
          minimizeWindow(window.id)
        }, 300)
      }
    }

    const handleRestoreEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string }>
      if (customEvent.detail.windowId === window.id) {
        setIsRestoring(true)
        setTimeout(() => {
          setIsRestoring(false)
        }, 300)
      }
    }

    // Use global window object
    const globalWindow = globalThis.window
    if (globalWindow) {
      globalWindow.addEventListener('window-minimize', handleMinimizeEvent)
      globalWindow.addEventListener('window-restore', handleRestoreEvent)

      return () => {
        globalWindow.removeEventListener('window-minimize', handleMinimizeEvent)
        globalWindow.removeEventListener('window-restore', handleRestoreEvent)
      }
    }
  }, [window.id, minimizeWindow])

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on buttons or interactive elements
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      focusWindow(window.id)
      return
    }

    // If window is maximized and user tries to drag, restore it
    if (window.isMaximized) {
      // Get the click position relative to the window
      const rect = windowRef.current?.getBoundingClientRect()
      if (!rect) return
      
      // Calculate where the mouse clicked on the title bar (0-1 range)
      const clickPositionRatio = e.clientX / globalThis.window.innerWidth
      
      // Disable transitions for smooth dragging
      setIsRestoringFromDrag(true)
      
      // Get the window's previous state before restoring
      const windowData = windows.get(window.id)
      if (!windowData?.previousState) return
      
      // Calculate where to position the window so the mouse stays at the same relative position
      const restoredWidth = windowData.previousState.width
      const restoredHeight = windowData.previousState.height
      const screenWidth = globalThis.window.innerWidth
      const screenHeight = globalThis.window.innerHeight
      const taskbarHeight = 48
      
      // Calculate initial position based on mouse
      let newX = e.clientX - (restoredWidth * clickPositionRatio)
      
      // For vertical position, keep the window centered around current mouse position
      // but ensure it stays within bounds
      let newY = e.clientY - 40 // Default offset for title bar height
      
      // Ensure window stays within screen bounds
      // Don't let it go off the left or right
      newX = Math.max(0, Math.min(newX, screenWidth - restoredWidth))
      
      // Don't let it go above the top
      newY = Math.max(0, newY)
      
      // Don't let it go below the taskbar
      if (newY + restoredHeight > screenHeight - taskbarHeight) {
        newY = screenHeight - taskbarHeight - restoredHeight
      }
      
      // Restore window
      restoreWindow(window.id)
      
      // Position the window immediately
      updateWindowPosition(window.id, newX, newY)
      
      // Set drag offset based on where the mouse is on the restored window
      setDragOffset({
        x: e.clientX - newX,
        y: e.clientY - newY
      })
      setIsDragging(true)
      
      // Re-enable transitions after a short delay
      setTimeout(() => {
        setIsRestoringFromDrag(false)
      }, 100)
      
      return
    }

    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
    focusWindow(window.id)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.isMaximized || !app?.resizable) return

    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.width,
      height: window.height
    })
    setIsResizing(true)
    focusWindow(window.id)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      closeWindow(window.id)
    }, 300)
  }

  const handleMinimize = () => {
    setIsMinimizing(true)
    setTimeout(() => {
      minimizeWindow(window.id)
    }, 300)
  }

  const handleMaximize = () => {
    if (!app?.maximizable) return

    if (window.isMaximized) {
      restoreWindow(window.id)
    } else {
      maximizeWindow(window.id)
    }
  }


  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const newX = e.clientX - dragOffset.x
      const newY = Math.max(0, e.clientY - dragOffset.y)
      updateWindowPosition(window.id, newX, newY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = ''
    }

    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset, window.id, updateWindowPosition])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      const newWidth = Math.max(400, resizeStart.width + deltaX)
      const newHeight = Math.max(300, resizeStart.height + deltaY)

      updateWindowSize(window.id, newWidth, newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.userSelect = ''
    }

    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isResizing, resizeStart, window.id, updateWindowSize])

  if (window.isMinimized && !isMinimizing) return null

  const windowContent = (
    <div
      ref={windowRef}
      className={`
        absolute overflow-hidden cursor-move
        ${window.isMaximized ? '' : 'rounded-[7px]'}
        ${isActive ? 'shadow-2xl' : 'shadow-xl'}
        ${isDragging || isResizing ? 'select-none' : ''}
        ${!isDragging && !isResizing && !isRestoringFromDrag ? 'transition-all duration-300 ease-out' : ''}
        ${isOpening ? 'scale-95 opacity-0' : ''}
        ${isClosing ? 'scale-95 opacity-0' : ''}
        ${isMinimizing ? 'scale-90 opacity-0 translate-y-20' : ''}
        ${isRestoring && !isRestoringFromDrag ? 'animate-restore' : ''}
        ${!isOpening && !isClosing && !isMinimizing && !isRestoring ? 'scale-100 opacity-100' : ''}
      `}
      style={{
        left: window.isMaximized ? 0 : `${window.x}px`,
        top: window.isMaximized ? 0 : `${window.y}px`,
        width: window.isMaximized ? '100%' : `${window.width}px`,
        height: window.isMaximized ? 'calc(100% - 48px)' : `${window.height}px`,
        zIndex: window.zIndex,
        borderRadius: window.isMaximized ? '0' : '7px',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px) saturate(100%)',
        WebkitBackdropFilter: 'blur(20px) saturate(100%)'
      }}
      onMouseDown={handleWindowMouseDown}
    >
      {/* Title Bar */}
      <div
        className="h-10 flex items-center justify-between px-4"
      >
        {/* Title */}
        <span className="text-sm font-medium select-none text-white/90">
          {window.title}
        </span>

        {/* Window Controls */}
        <div className="flex items-center gap-2">
          {app?.minimizable !== false && (
            <button
              onClick={handleMinimize}
              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded text-white/80"
            >
              <Minus className="w-3 h-3" />
            </button>
          )}
          {app?.maximizable !== false && (
            <button
              onClick={handleMaximize}
              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded text-white/80"
            >
              {window.isMaximized ? (
                <Square className="w-3 h-3" />
              ) : (
                <Maximize className="w-3 h-3" />
              )}
            </button>
          )}
          <button
            onClick={handleClose}
            className="w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white rounded text-white/80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      {app?.resizable !== false && !window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  )

  return windowContent
}