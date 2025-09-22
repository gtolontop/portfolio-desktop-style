'use client'

import { useState, useRef, useEffect } from 'react'
import Taskbar from './Taskbar'
import DesktopIcon from './DesktopIcon'
import BootAnimation from './BootAnimation'

interface SelectionBox {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function Desktop() {
  const [showBoot, setShowBoot] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start selection if clicking on the desktop itself (not on icons or taskbar)
    if (e.target === desktopRef.current) {
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

  if (showBoot) {
    return <BootAnimation onComplete={() => setShowBoot(false)} />
  }

  return (
    <div
      ref={desktopRef}
      className="w-screen h-screen relative overflow-hidden desktop-gradient select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* Selection Box */}
      {isSelecting && selectionBox && (
        <div
          className="fixed border border-pink-400 bg-pink-300/30 pointer-events-none z-50"
          style={getSelectionStyle()}
        />
      )}

      {/* Desktop Icons */}
      <div className="relative w-full h-full">
        <DesktopIcon
          name="À propos"
          icon="👤"
          position={{ x: 30, y: 30 }}
          onDoubleClick={() => console.log('Ouvrir À propos')}
        />
        <DesktopIcon
          name="Projets"
          icon="💼"
          position={{ x: 30, y: 140 }}
          onDoubleClick={() => console.log('Ouvrir Projets')}
        />
        <DesktopIcon
          name="Contact"
          icon="📧"
          position={{ x: 30, y: 250 }}
          onDoubleClick={() => console.log('Ouvrir Contact')}
        />
        <DesktopIcon
          name="CV"
          icon="📄"
          position={{ x: 30, y: 360 }}
          onDoubleClick={() => console.log('Ouvrir CV')}
        />
        <DesktopIcon
          name="GitHub"
          icon="🐙"
          position={{ x: 140, y: 30 }}
          onDoubleClick={() => window.open('https://github.com', '_blank')}
        />
        <DesktopIcon
          name="LinkedIn"
          icon="💼"
          position={{ x: 140, y: 140 }}
          onDoubleClick={() => window.open('https://linkedin.com', '_blank')}
        />
        <DesktopIcon
          name="Jeux"
          icon="🎮"
          position={{ x: 140, y: 250 }}
          onDoubleClick={() => console.log('Ouvrir Jeux')}
        />
        <DesktopIcon
          name="Musique"
          icon="🎵"
          position={{ x: 250, y: 30 }}
          onDoubleClick={() => console.log('Ouvrir Musique')}
        />
        <DesktopIcon
          name="Photos"
          icon="🖼️"
          position={{ x: 250, y: 140 }}
          onDoubleClick={() => console.log('Ouvrir Photos')}
        />
        <DesktopIcon
          name="Corbeille"
          icon="🗑️"
          position={{ x: 30, y: 470 }}
          onDoubleClick={() => console.log('Ouvrir Corbeille')}
        />
      </div>

      <Taskbar />
    </div>
  )
}