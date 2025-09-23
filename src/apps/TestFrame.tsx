'use client'

import AppTemplate from './templates/AppTemplate'

export default function TestFrame() {
  return (
    <AppTemplate>
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
    </AppTemplate>
  )
}