'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  danger?: boolean
  divider?: boolean
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

export default function Dropdown({ trigger, items, position = 'bottom-right', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Calculate menu position based on trigger element
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const menuWidth = 180
    const menuHeight = items.filter(i => !i.divider).length * 44 + items.filter(i => i.divider).length * 9 + 12

    let top = 0
    let left = 0

    switch (position) {
      case 'top-left':
        top = triggerRect.top - menuHeight - 8
        left = triggerRect.left
        break
      case 'top-right':
        top = triggerRect.top - menuHeight - 8
        left = triggerRect.right - menuWidth
        break
      case 'bottom-left':
        top = triggerRect.bottom + 8
        left = triggerRect.left
        break
      case 'bottom-right':
        top = triggerRect.bottom + 8
        left = triggerRect.right - menuWidth
        break
    }

    // Keep menu within viewport
    if (left < 8) left = 8
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8
    if (top < 8) top = triggerRect.bottom + 8
    if (top + menuHeight > window.innerHeight - 8) top = triggerRect.top - menuHeight - 8

    setMenuPosition({ top, left })
  }, [isOpen, position, items])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return
    setIsOpen(false)
    // Small delay to let animation play
    setTimeout(() => {
      item.onClick?.()
    }, 100)
  }

  const menuContent = typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{
            opacity: 0,
            scale: 0.95,
            y: position.startsWith('top') ? 8 : -8
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: position.startsWith('top') ? 8 : -8
          }}
          transition={{
            duration: 0.15,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="fixed min-w-[180px] py-1.5 rounded-xl border border-white/50 overflow-hidden"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            zIndex: 99999,
            transformOrigin: position.startsWith('top') ? 'bottom center' : 'top center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,252,0.95) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5) inset'
          }}
        >
          {items.map((item, index) => (
            item.divider ? (
              <div key={`divider-${index}`} className="h-px bg-gray-200/70 my-1.5 mx-3" />
            ) : (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left
                  transition-all duration-100
                  ${item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : item.danger
                      ? 'hover:bg-red-500/10'
                      : 'hover:bg-black/5'
                  }
                  active:scale-[0.98]
                `}
              >
                {item.icon && (
                  <span className={`w-5 h-5 flex items-center justify-center ${item.danger ? 'text-red-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                )}
                <span className={`text-[13px] font-medium ${item.danger ? 'text-red-600' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </button>
            )
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null

  return (
    <div ref={triggerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown Menu - Rendered via Portal */}
      {menuContent}
    </div>
  )
}
