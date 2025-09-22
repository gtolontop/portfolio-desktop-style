'use client'

import Taskbar from './Taskbar'

export default function Desktop() {
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-b from-pink-400 to-pink-400">
      {/* Texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='1'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Desktop content will go here */}
      
      <Taskbar />
    </div>
  )
}