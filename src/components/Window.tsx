'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus, Minimize2, Maximize } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { AppWindow } from '@/types/app.types'

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
  const windowRef = useRef<HTMLDivElement>(null)

  const app = getApp(window.appId)
  const isActive = activeWindowId === window.id

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return

    // Don't start dragging if clicking on buttons or interactive elements
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.closest('button')) return

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
    closeWindow(window.id)
  }

  const handleMinimize = () => {
    minimizeWindow(window.id)
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

  if (window.isMinimized) return null

  const windowContent = (
    <div
      ref={windowRef}
      className={`
        absolute overflow-hidden rounded-[7px] cursor-move
        ${isActive ? 'shadow-2xl' : 'shadow-xl'}
        ${isDragging || isResizing ? 'select-none' : ''}
      `}
      style={{
        left: window.isMaximized ? 0 : `${window.x}px`,
        top: window.isMaximized ? 0 : `${window.y}px`,
        width: window.isMaximized ? '100%' : `${window.width}px`,
        height: window.isMaximized ? 'calc(100% - 48px)' : `${window.height}px`,
        zIndex: window.zIndex,
        borderRadius: '7px',
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
                <Minimize2 className="w-3 h-3" />
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