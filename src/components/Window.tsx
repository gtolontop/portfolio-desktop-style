'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Minus, Square, Maximize2 } from 'lucide-react'
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

  if (window.isMinimized) return null

  return (
    <div
      ref={windowRef}
      className={`
        absolute bg-gray-900 rounded-lg overflow-hidden
        shadow-2xl border border-gray-700
        ${isActive ? 'ring-2 ring-pink-500/50' : ''}
        ${isDragging || isResizing ? 'select-none' : ''}
      `}
      style={{
        left: window.isMaximized ? 0 : `${window.x}px`,
        top: window.isMaximized ? 0 : `${window.y}px`,
        width: window.isMaximized ? '100%' : `${window.width}px`,
        height: window.isMaximized ? 'calc(100% - 48px)' : `${window.height}px`,
        zIndex: window.zIndex
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-gray-800 flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleTitleBarMouseDown}
      >
        <span className="text-sm text-white font-medium select-none">
          {window.title}
        </span>
        <div className="flex items-center gap-2">
          {app?.minimizable !== false && (
            <button
              onClick={() => minimizeWindow(window.id)}
              className="w-6 h-6 rounded hover:bg-gray-700 flex items-center justify-center"
            >
              <Minus className="w-3 h-3 text-gray-300" />
            </button>
          )}
          {app?.maximizable !== false && (
            <button
              onClick={handleMaximize}
              className="w-6 h-6 rounded hover:bg-gray-700 flex items-center justify-center"
            >
              {window.isMaximized ? (
                <Square className="w-3 h-3 text-gray-300" />
              ) : (
                <Maximize2 className="w-3 h-3 text-gray-300" />
              )}
            </button>
          )}
          <button
            onClick={() => closeWindow(window.id)}
            className="w-6 h-6 rounded hover:bg-red-600 flex items-center justify-center"
          >
            <X className="w-3 h-3 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] bg-gray-950 overflow-auto">
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
}