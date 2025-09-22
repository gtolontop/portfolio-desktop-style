'use client'

export default function TestFrame() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">Test Frame</h1>
        <p className="text-2xl text-gray-300">Fullscreen Application Window</p>
        <p className="text-lg text-gray-400 mt-4">Cette fenêtre s'ouvre en plein écran</p>
      </div>
    </div>
  )
}