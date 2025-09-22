'use client'

import { useState } from 'react'

export default function Taskbar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-pink-50/85 backdrop-blur-xl border-t border-pink-200/20 shadow-lg shadow-pink-200/15">
      <div className="h-full flex items-center px-1 gap-2.5">
        <div
          className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-md transition-all duration-75 ease-out"
          style={{
            backgroundColor: isHovered ? 'rgba(249, 168, 212, 0.4)' : 'transparent'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsClicked(true)}
          onMouseUp={() => setIsClicked(false)}
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain transition-transform duration-75"
            style={{
              transform: isClicked ? 'scale(0.75)' : 'scale(1)'
            }}
          />
        </div>
        
        <div className="flex-1 flex gap-1 px-2.5">
          {/* App buttons will go here */}
        </div>
        
        <div className="px-3 text-[13px] text-gray-600 font-medium">
          {new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}