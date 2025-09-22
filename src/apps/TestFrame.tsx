'use client'

import { useState } from 'react'

export default function TestFrame() {
  const [config, setConfig] = useState({
    titleBar: {
      height: 40,
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      showMinimize: true,
      showMaximize: true,
      showClose: true,
      buttonStyle: 'default'
    },
    window: {
      borderRadius: 8,
      borderColor: '#374151',
      borderWidth: 1,
      backgroundColor: '#030712',
      padding: 0,
      shadow: 'shadow-2xl'
    },
    content: {
      backgroundColor: '#111827',
      padding: 16
    }
  })

  return (
    <div className="h-full w-full p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Frame Configuration Test</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Config Panel */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Title Bar</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-300">
                  Height: {config.titleBar.height}px
                  <input
                    type="range"
                    min="30"
                    max="60"
                    value={config.titleBar.height}
                    onChange={(e) => setConfig({
                      ...config,
                      titleBar: { ...config.titleBar, height: parseInt(e.target.value) }
                    })}
                    className="w-full mt-1"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Background Color
                  <input
                    type="color"
                    value={config.titleBar.backgroundColor}
                    onChange={(e) => setConfig({
                      ...config,
                      titleBar: { ...config.titleBar, backgroundColor: e.target.value }
                    })}
                    className="w-full mt-1 h-8"
                  />
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={config.titleBar.showMinimize}
                      onChange={(e) => setConfig({
                        ...config,
                        titleBar: { ...config.titleBar, showMinimize: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    Minimize
                  </label>
                  <label className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={config.titleBar.showMaximize}
                      onChange={(e) => setConfig({
                        ...config,
                        titleBar: { ...config.titleBar, showMaximize: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    Maximize
                  </label>
                  <label className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={config.titleBar.showClose}
                      onChange={(e) => setConfig({
                        ...config,
                        titleBar: { ...config.titleBar, showClose: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    Close
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Window</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-300">
                  Border Radius: {config.window.borderRadius}px
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={config.window.borderRadius}
                    onChange={(e) => setConfig({
                      ...config,
                      window: { ...config.window, borderRadius: parseInt(e.target.value) }
                    })}
                    className="w-full mt-1"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Background Color
                  <input
                    type="color"
                    value={config.window.backgroundColor}
                    onChange={(e) => setConfig({
                      ...config,
                      window: { ...config.window, backgroundColor: e.target.value }
                    })}
                    className="w-full mt-1 h-8"
                  />
                </label>

                <label className="block text-sm text-gray-300">
                  Shadow
                  <select
                    value={config.window.shadow}
                    onChange={(e) => setConfig({
                      ...config,
                      window: { ...config.window, shadow: e.target.value }
                    })}
                    className="w-full mt-1 bg-gray-700 text-white rounded px-2 py-1"
                  >
                    <option value="shadow-none">None</option>
                    <option value="shadow-md">Medium</option>
                    <option value="shadow-lg">Large</option>
                    <option value="shadow-xl">Extra Large</option>
                    <option value="shadow-2xl">2X Large</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Export Config</h3>
              <pre className="bg-gray-900 p-2 rounded text-xs text-gray-400 overflow-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Preview</h3>
            <div className="bg-gray-700 p-8 rounded">
              <div
                className={`${config.window.shadow} overflow-hidden`}
                style={{
                  borderRadius: `${config.window.borderRadius}px`,
                  border: `${config.window.borderWidth}px solid ${config.window.borderColor}`,
                  backgroundColor: config.window.backgroundColor
                }}
              >
                {/* Title Bar Preview */}
                <div
                  className="flex items-center justify-between px-3"
                  style={{
                    height: `${config.titleBar.height}px`,
                    backgroundColor: config.titleBar.backgroundColor
                  }}
                >
                  <span style={{ color: config.titleBar.textColor }}>Test Application</span>
                  <div className="flex items-center gap-2">
                    {config.titleBar.showMinimize && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    )}
                    {config.titleBar.showMaximize && (
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    )}
                    {config.titleBar.showClose && (
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <div
                  style={{
                    backgroundColor: config.content.backgroundColor,
                    padding: `${config.content.padding}px`,
                    minHeight: '200px'
                  }}
                >
                  <p className="text-gray-300">Content area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}