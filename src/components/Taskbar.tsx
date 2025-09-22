'use client'

import { useState } from 'react'

export default function Taskbar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-pink-50/85 backdrop-blur-xl border-t border-pink-200/20 shadow-lg shadow-pink-200/15">
      <div className="h-full flex items-center px-1 gap-2.5">
        <button
          className="h-10 w-10 flex items-center justify-center rounded-md transition-all duration-75 ease-out bg-transparent hover:bg-pink-300/40 active:scale-90"
          onMouseEnter={() => {
            setIsHovered(true)
            console.log('Hover in')
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            console.log('Hover out')
          }}
          onClick={() => console.log('Clicked!')}
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain pointer-events-none"
          />
        </button>
        
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