'use client'

import { useAppStore } from '@/store/appStore'
import DesktopIcon from './DesktopIcon'

interface DesktopIconsProps {
  selectedIconIds: Set<string>
  onIconClick: () => void
}

export default function DesktopIcons({ selectedIconIds, onIconClick }: DesktopIconsProps) {
  const { desktopIcons } = useAppStore()

  const handleSelectIcon = (id: string, multiSelect: boolean) => {
    // For now, just clear selection when an icon is clicked
    // You can enhance this later for multi-select with Ctrl
    onIconClick()
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onIconClick()
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
          isSelected={selectedIconIds.has(icon.id)}
          onSelect={handleSelectIcon}
        />
      ))}
    </div>
  )
}