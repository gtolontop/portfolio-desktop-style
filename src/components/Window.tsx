'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus, Square, Maximize2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { AppWindow } from '@/types/app.types'
import GenieEffect from './GenieEffect'

interface WindowProps {
  window: AppWindow
  children: React.ReactNode
}

export default function Window({ window, children }: WindowProps) {
  const {
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
  const [genieAnimation, setGenieAnimation] = useState<{
    isAnimating: boolean
    type: 'minimize' | 'restore' | 'open' | 'close'
    targetPosition?: { x: number; y: number }
  } | null>(() => {
    if (window.openedFromPosition) {
      return {
        isAnimating: true,
        type: 'open',
        targetPosition: window.openedFromPosition
      }
    }
    return null
  })
  const [isClosing, setIsClosing] = useState(false)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isSlowMotion, setIsSlowMotion] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const app = getApp(window.appId)
  const isActive = activeWindowId === window.id

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return

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
    setGenieAnimation({
      isAnimating: true,
      type: 'close',
      targetPosition: window.openedFromPosition
    })
  }

  const handleMinimize = () => {
    setIsMinimizing(true)
    const taskbarHeight = 48
    setGenieAnimation({
      isAnimating: true,
      type: 'minimize',
      targetPosition: {
        x: window.x + window.width / 2,
        y: typeof globalThis !== 'undefined' && globalThis.window ? globalThis.window.innerHeight - taskbarHeight / 2 : 1080 - taskbarHeight / 2
      }
    })
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
    // Handle shift key for slow motion
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsSlowMotion(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsSlowMotion(false)
    }
    
    globalThis.addEventListener('keydown', handleKeyDown)
    globalThis.addEventListener('keyup', handleKeyUp)
    
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown)
      globalThis.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    // Handle restore from minimize
    if (!window.isMinimized && isMinimizing) {
      setIsMinimizing(false)
      const taskbarHeight = 48
      setGenieAnimation({
        isAnimating: true,
        type: 'restore',
        targetPosition: {
          x: window.x + window.width / 2,
          y: typeof globalThis !== 'undefined' && globalThis.window ? globalThis.window.innerHeight - taskbarHeight / 2 : 1080 - taskbarHeight / 2
        }
      })
    }
  }, [window.isMinimized, isMinimizing, window.x, window.width])

  const handleAnimationEnd = () => {
    if (genieAnimation?.type === 'minimize') {
      minimizeWindow(window.id)
    } else if (genieAnimation?.type === 'close') {
      closeWindow(window.id)
    }
    setGenieAnimation(null)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x
      const newY = Math.max(0, e.clientY - dragOffset.y)
      updateWindowPosition(window.id, newX, newY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, window.id, updateWindowPosition])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      const newWidth = Math.max(400, resizeStart.width + deltaX)
      const newHeight = Math.max(300, resizeStart.height + deltaY)

      updateWindowSize(window.id, newWidth, newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeStart, window.id, updateWindowSize])

  if (window.isMinimized && !genieAnimation) return null

  const windowContent = (
    <div
      ref={windowRef}
      className={`
        absolute rounded-xl overflow-hidden
        ${isActive ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-black/30'}
        ${isDragging || isResizing ? 'select-none' : ''}
      `}
      style={{
        left: window.isMaximized ? 0 : `${window.x}px`,
        top: window.isMaximized ? 0 : `${window.y}px`,
        width: window.isMaximized ? '100%' : `${window.width}px`,
        height: window.isMaximized ? 'calc(100% - 48px)' : `${window.height}px`,
        zIndex: window.zIndex,
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar - macOS Style */}
      <div
        className="h-11 flex items-center px-4 cursor-move"
        style={{
          background: 'linear-gradient(to bottom, rgba(60, 60, 60, 0.8), rgba(45, 45, 45, 0.8))',
          borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
        }}
        onMouseDown={handleTitleBarMouseDown}
      >
        {/* Traffic Lights */}
        <div className="flex items-center gap-2 mr-4">
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors group relative"
          >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <X className="w-2 h-2 text-red-900" strokeWidth={3} />
            </span>
          </button>
          {app?.minimizable !== false && (
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors group relative"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Minus className="w-2 h-2 text-yellow-900" strokeWidth={3} />
              </span>
            </button>
          )}
          {app?.maximizable !== false && (
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors group relative"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                {window.isMaximized ? (
                  <Square className="w-2 h-2 text-green-900" strokeWidth={3} />
                ) : (
                  <Maximize2 className="w-2 h-2 text-green-900" strokeWidth={3} />
                )}
              </span>
            </button>
          )}
        </div>

        {/* Title */}
        <span className="flex-1 text-center text-sm font-medium text-white/90 select-none">
          {window.title}
        </span>

        {/* Spacer for balance */}
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="h-[calc(100%-44px)] overflow-auto" style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)' }}>
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

  if (genieAnimation?.isAnimating) {
    return (
      <GenieEffect
        isAnimating={genieAnimation.isAnimating}
        animationType={genieAnimation.type}
        targetPosition={genieAnimation.targetPosition}
        duration={isSlowMotion ? 2000 : 600}
        onAnimationEnd={handleAnimationEnd}
      >
        {windowContent}
      </GenieEffect>
    )
  }

  return windowContent
}