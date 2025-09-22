'use client'

import { useState } from 'react'
import Image from 'next/image'

interface DesktopIconProps {
  name: string
  icon: string
  onDoubleClick?: () => void
  position?: { x: number; y: number }
}

export default function DesktopIcon({ name, icon, onDoubleClick, position }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    setIsSelected(true)
  }

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick()
    }
  }

  return (
    <div
      className={`absolute flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer select-none transition-all ${
        isSelected ? 'bg-pink-200/30 border border-pink-300/50' : 'hover:bg-pink-100/20'
      }`}
      style={{
        left: position?.x || 20,
        top: position?.y || 20,
        width: '90px'
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setIsSelected(false)}
      tabIndex={0}
    >
      <div className="text-4xl mb-1">{icon}</div>
      <span className={`text-xs text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
        isSelected ? 'bg-pink-500/80 px-1 rounded' : ''
      }`}>
        {name}
      </span>
    </div>
  )
}