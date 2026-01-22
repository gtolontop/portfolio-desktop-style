'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Clock, X, FileText, Folder, Settings, Globe, ArrowRight } from 'lucide-react'
import { useSystemStore, formatRelativeTime } from '@/store/systemStore'
import { useAppStore } from '@/store/appStore'

interface SearchPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const { recentFiles, searchHistory, addSearchHistory, quickAccessFolders } = useSystemStore()
  const appsMap = useAppStore(state => state.apps)
  const openWindow = useAppStore(state => state.openWindow)
  const apps = Array.from(appsMap.values())

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
          inputRef.current?.focus()
        })
      })
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setSearchQuery('')
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Filter results based on search query
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFiles = recentFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFolders = quickAccessFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim())
    }
  }

  const handleAppClick = (appId: string) => {
    openWindow(appId)
    onClose()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="w-4 h-4 text-yellow-500" />
      case 'code': return <FileText className="w-4 h-4 text-blue-500" />
      case 'document': return <FileText className="w-4 h-4 text-gray-500" />
      case 'image': return <FileText className="w-4 h-4 text-purple-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  if (!isVisible) return null

  return (
    <div
      ref={panelRef}
      className="fixed"
      style={{
        bottom: '62px',
        left: '8px',
        width: '620px',
        height: '480px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        background: `
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0.75) 50%,
            rgba(245, 245, 250, 0.8) 100%
          )
        `,
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset,
          0 1px 0 rgba(255, 255, 255, 0.5) inset
        `,
        zIndex: 9999,
        transform: isAnimating
          ? 'translateY(0) scale(1)'
          : 'translateY(20px) scale(0.95)',
        opacity: isAnimating ? 1 : 0,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
        transformOrigin: 'bottom left',
        overflow: 'hidden'
      }}
    >
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for apps, files, settings, and more..."
            className="w-full h-12 pl-12 pr-12 rounded-lg text-[14px]
                     bg-white/80 hover:bg-white focus:bg-white
                     border border-gray-200/50
                     placeholder-gray-400 text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50
                     transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
        {searchQuery ? (
          // Search Results
          <div className="space-y-4">
            {/* Apps Results */}
            {filteredApps.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Apps</h3>
                <div className="space-y-1">
                  {filteredApps.slice(0, 4).map(app => {
                    const IconComponent = typeof app.icon === 'string' ? null : app.icon
                    return (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          {IconComponent ? (
                            <IconComponent className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-white text-xs">{app.icon as string}</span>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-700">{app.name}</div>
                          <div className="text-xs text-gray-500">App</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Files Results */}
            {filteredFiles.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Files</h3>
                <div className="space-y-1">
                  {filteredFiles.slice(0, 4).map(file => (
                    <button
                      key={file.id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 truncate">{file.name}</div>
                        <div className="text-xs text-gray-500 truncate">{file.path}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Folders Results */}
            {filteredFolders.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Folders</h3>
                <div className="space-y-1">
                  {filteredFolders.slice(0, 3).map(folder => (
                    <button
                      key={folder.id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Folder className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-700">{folder.name}</div>
                        <div className="text-xs text-gray-500">{folder.path}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Web Search Option */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Web</h3>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-700">Search &quot;{searchQuery}&quot; on the web</div>
                  <div className="text-xs text-gray-500">Bing Search</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            </div>

            {/* No results */}
            {filteredApps.length === 0 && filteredFiles.length === 0 && filteredFolders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No results found for &quot;{searchQuery}&quot;</p>
                <p className="text-xs mt-1">Try searching on the web instead</p>
              </div>
            )}
          </div>
        ) : (
          // Default View - Recent & Quick Access
          <div className="space-y-4">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 6).map((query, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(query)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Access Apps */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Access</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: '⚙️', name: 'Settings', id: 'settings' },
                  { icon: '📁', name: 'Files', id: 'explorer' },
                  { icon: '🌐', name: 'Edge', id: 'edge' },
                  { icon: '📝', name: 'Notepad', id: 'notepad' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-lg">
                      {app.icon}
                    </div>
                    <span className="text-xs text-gray-600">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Files */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Files</h3>
              <div className="space-y-1">
                {recentFiles.slice(0, 5).map(file => (
                  <button
                    key={file.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    <span className="text-lg">{file.icon}</span>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">{formatRelativeTime(file.lastOpened)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
