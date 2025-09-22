'use client'

import Taskbar from './Taskbar'

export default function Desktop() {
  return (
    <div className="w-screen h-screen relative overflow-hidden desktop-gradient">
      
      {/* Desktop content will go here */}
      
      <Taskbar />
    </div>
  )
}