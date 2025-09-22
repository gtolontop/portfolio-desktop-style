'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, RefreshCw, Home, Search } from 'lucide-react'

export default function Browser() {
  const [url, setUrl] = useState('https://google.com')
  const [currentUrl, setCurrentUrl] = useState('https://google.com')

  const handleNavigate = () => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setCurrentUrl('https://' + url)
      setUrl('https://' + url)
    } else {
      setCurrentUrl(url)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate()
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-3 py-2">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-gray-800 text-gray-400">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-800 text-gray-400">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-800 text-gray-400">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-800 text-gray-400">
            <Home className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center bg-gray-800 rounded-lg px-3 py-1.5">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-sm text-gray-300"
              placeholder="Entrez une URL..."
            />
            <button
              onClick={handleNavigate}
              className="ml-2 text-gray-400 hover:text-gray-300"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <iframe
          src={currentUrl}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}