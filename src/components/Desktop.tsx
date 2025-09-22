'use client'

import { useState, useRef, useEffect } from 'react'
import Taskbar from './Taskbar'

interface SelectionBox {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function Desktop() {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start selection if clicking on the desktop area
    const target = e.target as HTMLElement
    if (target.classList.contains('desktop-area') || target === desktopRef.current) {
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
          className="fixed border border-pink-400/60 bg-pink-400/20 pointer-events-none"
          style={{
            ...getSelectionStyle(),
            zIndex: 100
          }}
        />
      )}

      {/* Desktop Area */}
      <div className="desktop-area absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
      </div>

      <Taskbar />
    </div>
  )
}