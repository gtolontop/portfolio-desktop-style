'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import { DesktopIcon as DesktopIconType } from '@/types/app.types'

interface DesktopIconProps {
  icon: DesktopIconType
  isSelected?: boolean
  onSelect?: (id: string, multiSelect: boolean) => void
}

export default function DesktopIcon({ icon, isSelected, onSelect }: DesktopIconProps) {
  const { getApp, openWindow, updateIconPosition } = useAppStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const iconRef = useRef<HTMLDivElement>(null)
  const app = getApp(icon.appId)

  if (!app) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    onSelect?.(icon.id, e.ctrlKey || e.metaKey)

    if (e.button === 0) {
      const rect = iconRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
        setIsDragging(true)
      }
    }
  }

  const handleDoubleClick = () => {
    openWindow(icon.appId)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      const maxX = window.innerWidth - 80
      const maxY = window.innerHeight - 100 - 48

      const clampedX = Math.max(0, Math.min(newX, maxX))
      const clampedY = Math.max(0, Math.min(newY, maxY))

      updateIconPosition(icon.id, clampedX, clampedY)
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
  }, [isDragging, dragOffset, icon.id, updateIconPosition])

  return (
    <div
      ref={iconRef}
      className={`
        absolute flex flex-col items-center justify-center
        w-20 h-24 p-2 cursor-pointer select-none
        transition-all duration-150
        ${isSelected ? 'bg-pink-400/20 rounded-lg border border-pink-400/40' : ''}
        ${isDragging ? 'opacity-70' : 'hover:bg-white/10 hover:rounded-lg'}
      `}
      style={{
        left: `${icon.position.x}px`,
        top: `${icon.position.y}px`,
        zIndex: isDragging ? 9999 : 10
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="w-12 h-12 mb-1 flex items-center justify-center">
        {app.icon.startsWith('http') || app.icon.startsWith('/') ? (
          <img
            src={app.icon}
            alt={app.name}
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="text-4xl">{app.icon}</div>
        )}
      </div>
      <span className="text-xs text-white text-center w-full truncate px-1
                       drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {app.name}
      </span>
    </div>
  )
}