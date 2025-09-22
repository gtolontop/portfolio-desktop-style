'use client'

export default function Taskbar() {
  return (
    <div className="taskbar">
      <div className="taskbar-content">
        <div className="logo-container">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="logo-img"
          />
        </div>
        
        <div className="taskbar-apps">
          {/* App buttons will go here */}
        </div>
        
        <div className="taskbar-time">
          {new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}