'use client'

import { useState, useEffect } from 'react'

interface MarkdownViewerProps {
  content?: string
  filePath?: string
  title?: string
}

export default function MarkdownViewer({ content, filePath, title }: MarkdownViewerProps) {
  const [markdown, setMarkdown] = useState(content || '')

  useEffect(() => {
    if (filePath) {
      fetch(filePath)
        .then(res => res.text())
        .then(text => setMarkdown(text))
        .catch(err => console.error('Error loading markdown:', err))
    }
  }, [filePath])

  return (
    <div className="h-full w-full flex flex-col bg-gray-950">
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <h2 className="text-white font-medium">{title}</h2>
        </div>
      )}
      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-300">
            {markdown}
          </div>
        </div>
      </div>
    </div>
  )
}