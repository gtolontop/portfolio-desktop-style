'use client'

export default function TestFrame() {
  return (
    <div className="h-full w-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
      <div className="text-center space-y-6">
        <div className="inline-block p-6 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
          <h1 className="text-6xl font-bold text-white mb-4">Test Application</h1>
          <p className="text-xl text-white/90">macOS Style Window</p>
          <div className="mt-8 flex gap-4 justify-center">
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all">
              Button 1
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all">
              Button 2
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}