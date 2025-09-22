'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import DesktopIcon from './DesktopIcon'

export default function DesktopIcons() {
  const { desktopIcons } = useAppStore()
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set())

  const handleSelectIcon = (id: string, multiSelect: boolean) => {
    setSelectedIcons(prev => {
      const newSelection = new Set(prev)
      if (multiSelect) {
        if (newSelection.has(id)) {
          newSelection.delete(id)
        } else {
          newSelection.add(id)
        }
      } else {
        newSelection.clear()
        newSelection.add(id)
      }
      return newSelection
    })
  }

  const handleDesktopClick = () => {
    setSelectedIcons(new Set())
  }

  return (
    <div
      className="absolute inset-0"
      onClick={handleDesktopClick}
    >
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          isSelected={selectedIcons.has(icon.id)}
          onSelect={handleSelectIcon}
        />
      ))}
    </div>
  )
}