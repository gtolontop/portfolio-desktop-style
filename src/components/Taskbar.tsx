'use client'

export default function Taskbar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-pink-50/85 backdrop-blur-xl border-t border-pink-200/20 shadow-lg shadow-pink-200/15">
      <div className="h-full flex items-center px-2.5 gap-2.5">
        <div className="h-10 w-10 flex items-center justify-center cursor-pointer">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
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