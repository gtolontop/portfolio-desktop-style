'use client'

import { useState, useRef, useEffect } from 'react'
import Taskbar from './Taskbar'
import DesktopIcons from './DesktopIcons'
import WindowManager from './WindowManager'
import StartMenu from './StartMenu'
import { useAppStore } from '@/store/appStore'
import { defaultApps } from '@/config/apps.registry'

interface SelectionBox {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function Desktop() {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)
  const [selectedIconIds, setSelectedIconIds] = useState<Set<string>>(new Set())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const { registerApp, addDesktopIcon, desktopIcons } = useAppStore()

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializedRef.current) return
    initializedRef.current = true

    // Register all default apps
    defaultApps.forEach(app => {
      registerApp(app)
      // Add desktop icons for internal apps
      if (app.type === 'internal' || app.type === 'link') {
        addDesktopIcon(app.id)
      }
    })
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start selection if left mouse button is clicked on desktop area (not on windows)
    const target = e.target as HTMLElement
    const isDesktopArea = target.closest('.desktop-area') || target === desktopRef.current
    const isWindow = target.closest('[style*="zIndex"]') && !target.closest('.desktop-area')
    
    if (e.button === 0 && isDesktopArea && !isWindow) {
      e.preventDefault()
      setIsSelecting(true)
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && selectionBox) {
      setSelectionBox({
        ...selectionBox,
        endX: e.clientX,
        endY: e.clientY
      })
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
    setSelectionBox(null)
  }

  // Check which icons are in the selection box
  useEffect(() => {
    if (!selectionBox || !isSelecting) return

    const selected = new Set<string>()
    const selectionRect = {
      left: Math.min(selectionBox.startX, selectionBox.endX),
      right: Math.max(selectionBox.startX, selectionBox.endX),
      top: Math.min(selectionBox.startY, selectionBox.endY),
      bottom: Math.max(selectionBox.startY, selectionBox.endY)
    }

    // Check each icon
    desktopIcons.forEach(icon => {
      const iconCenterX = icon.position.x + 40 // Icon width / 2
      const iconCenterY = icon.position.y + 40 // Icon height / 2

      if (
        iconCenterX >= selectionRect.left &&
        iconCenterX <= selectionRect.right &&
        iconCenterY >= selectionRect.top &&
        iconCenterY <= selectionRect.bottom
      ) {
        selected.add(icon.id)
      }
    })

    setSelectedIconIds(selected)
  }, [selectionBox, isSelecting, desktopIcons])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsSelecting(false)
      setSelectionBox(null)
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  const getSelectionStyle = () => {
    if (!selectionBox) return {}

    const left = Math.min(selectionBox.startX, selectionBox.endX)
    const top = Math.min(selectionBox.startY, selectionBox.endY)
    const width = Math.abs(selectionBox.endX - selectionBox.startX)
    const height = Math.abs(selectionBox.endY - selectionBox.startY)

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    }
  }

  return (
    <div
      ref={desktopRef}
      className="w-screen h-screen relative overflow-hidden select-none"
      style={{
        backgroundImage: 'url(/images/background-pink.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* Selection Box */}
      {isSelecting && selectionBox && (
        <div
          className="fixed border border-pink-400/60 bg-pink-400/20 pointer-events-none"
          style={{
            ...getSelectionStyle(),
            zIndex: 100
          }}
        />
      )}

      {/* Selection Overlay - captures mouse events when selecting */}
      {isSelecting && (
        <div 
          className="absolute inset-0 z-50" 
        />
      )}

      {/* Desktop Area */}
      <div className="desktop-area absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <DesktopIcons selectedIconIds={selectedIconIds} onIconClick={() => setSelectedIconIds(new Set())} />
      </div>

      {/* Window Manager */}
      <WindowManager />

      {/* Start Menu - Above everything */}
      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />

      <Taskbar onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)} />
    </div>
  )
}