'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [isClosing, setIsClosing] = useState(false)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [taskbarIconPosition, setTaskbarIconPosition] = useState({ x: 0, y: 0 })
  const [isRestoringFromDrag, setIsRestoringFromDrag] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const app = getApp(window.appId)
  const isActive = activeWindowId === window.id

  // Get taskbar icon position for minimize animation
  const getTaskbarIconPosition = () => {
    const taskbarIcon = document.querySelector(`[data-window-id="${window.id}"]`)
    if (taskbarIcon) {
      const rect = taskbarIcon.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
    }
    // Fallback to center bottom of screen
    return {
      x: globalThis.window?.innerWidth / 2 || 500,
      y: globalThis.window?.innerHeight - 30 || 700
    }
  }

  useEffect(() => {
    // Listen for minimize/restore events from taskbar
    const handleMinimizeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ windowId: string }>
      if (customEvent.detail.windowId === window.id) {
        setTaskbarIconPosition(getTaskbarIconPosition())
        setIsMinimizing(true)
      }
    }

    const globalWindow = globalThis.window
    if (globalWindow) {
      globalWindow.addEventListener('window-minimize', handleMinimizeEvent)
      return () => {
        globalWindow.removeEventListener('window-minimize', handleMinimizeEvent)
      }
    }
  }, [window.id])

  // Handle minimize animation completion
  useEffect(() => {
    if (isMinimizing) {
      const timer = setTimeout(() => {
        minimizeWindow(window.id)
        setIsMinimizing(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isMinimizing, window.id, minimizeWindow])

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      focusWindow(window.id)
      return
    }

    if (window.isMaximized) {
      const rect = windowRef.current?.getBoundingClientRect()
      if (!rect) return

      const clickPositionRatio = e.clientX / globalThis.window.innerWidth
      setIsRestoringFromDrag(true)

      const windowData = windows.get(window.id)
      if (!windowData?.previousState) return

      const restoredWidth = windowData.previousState.width
      const restoredHeight = windowData.previousState.height
      const screenWidth = globalThis.window.innerWidth
      const screenHeight = globalThis.window.innerHeight
      const taskbarHeight = 48

      let newX = e.clientX - (restoredWidth * clickPositionRatio)
      let newY = e.clientY - 40

      newX = Math.max(0, Math.min(newX, screenWidth - restoredWidth))
      newY = Math.max(0, newY)

      if (newY + restoredHeight > screenHeight - taskbarHeight) {
        newY = screenHeight - taskbarHeight - restoredHeight
      }

      restoreWindow(window.id)
      updateWindowPosition(window.id, newX, newY)

      setDragOffset({
        x: e.clientX - newX,
        y: e.clientY - newY
      })
      setIsDragging(true)

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
  }

  const handleMinimize = () => {
    setTaskbarIconPosition(getTaskbarIconPosition())
    setIsMinimizing(true)
  }

  const handleMaximize = () => {
    if (!app?.maximizable) return

    if (window.isMaximized) {
      restoreWindow(window.id)
    } else {
      maximizeWindow(window.id)
    }

    setTimeout(() => {
      globalThis.window.dispatchEvent(new CustomEvent('window-state-changed'))
    }, 0)
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

  // Calculate window center for animation origin
  const windowCenterX = window.isMaximized ? globalThis.window?.innerWidth / 2 : window.x + window.width / 2
  const windowCenterY = window.isMaximized ? globalThis.window?.innerHeight / 2 : window.y + window.height / 2

  // Calculate minimize animation target
  const minimizeOffsetX = taskbarIconPosition.x - windowCenterX
  const minimizeOffsetY = taskbarIconPosition.y - windowCenterY

  return (
    <AnimatePresence onExitComplete={() => isClosing && closeWindow(window.id)}>
      {!isClosing && (
        <motion.div
          ref={windowRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isMinimizing ? {
            scale: 0.1,
            opacity: 0,
            x: minimizeOffsetX,
            y: minimizeOffsetY,
            transition: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          } : {
            scale: 1,
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 30
            }
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
            transition: { duration: 0.2, ease: 'easeOut' }
          }}
          className={`
            absolute overflow-hidden cursor-move
            ${window.isMaximized ? '' : 'rounded-[7px]'}
            ${isActive ? 'shadow-2xl' : 'shadow-xl'}
            ${isDragging || isResizing ? 'select-none' : ''}
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
            WebkitBackdropFilter: 'blur(20px) saturate(100%)',
            transition: !isDragging && !isResizing && !isRestoringFromDrag && !isMinimizing
              ? 'left 0.3s ease-out, top 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out'
              : 'none'
          }}
          onMouseDown={handleWindowMouseDown}
        >
          {/* Title Bar */}
          <div className="h-10 flex items-center justify-between px-4">
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
