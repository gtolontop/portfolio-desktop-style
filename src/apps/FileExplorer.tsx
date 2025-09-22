'use client'

import { useState } from 'react'
import { Folder, File, ChevronRight, ChevronDown, FileText, Image, Code } from 'lucide-react'
import BaseApp from './templates/BaseApp'

interface FileNode {
  name: string
  type: 'folder' | 'file'
  children?: FileNode[]
  content?: string
  icon?: React.ReactNode
}

const fileSystem: FileNode = {
  name: 'Portfolio',
  type: 'folder',
  children: [
    {
      name: 'Documents',
      type: 'folder',
      children: [
        { name: 'CV.pdf', type: 'file', icon: <FileText className="w-4 h-4" /> },
        { name: 'Lettre de motivation.pdf', type: 'file', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      name: 'Projets',
      type: 'folder',
      children: [
        {
          name: 'E-commerce',
          type: 'folder',
          children: [
            { name: 'README.md', type: 'file', icon: <FileText className="w-4 h-4" /> },
            { name: 'package.json', type: 'file', icon: <Code className="w-4 h-4" /> },
            { name: 'src', type: 'folder', children: [] }
          ]
        },
        {
          name: 'Chat App',
          type: 'folder',
          children: [
            { name: 'server.js', type: 'file', icon: <Code className="w-4 h-4" /> },
            { name: 'client.js', type: 'file', icon: <Code className="w-4 h-4" /> }
          ]
        }
      ]
    },
    {
      name: 'Images',
      type: 'folder',
      children: [
        { name: 'profile.jpg', type: 'file', icon: <Image className="w-4 h-4" /> },
        { name: 'screenshot1.png', type: 'file', icon: <Image className="w-4 h-4" /> },
        { name: 'screenshot2.png', type: 'file', icon: <Image className="w-4 h-4" /> }
      ]
    }
  ]
}

function FileTreeNode({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 px-2 py-1 hover:bg-gray-800 cursor-pointer
          ${level > 0 ? 'ml-' + (level * 4) : ''}
        `}
        onClick={() => node.type === 'folder' && setIsOpen(!isOpen)}
      >
        {node.type === 'folder' && (
          <span className="text-gray-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-yellow-500" />
        ) : (
          node.icon || <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-sm text-gray-300">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeNode key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileExplorer() {
  return (
    <BaseApp title="Explorateur de fichiers">
      <div className="flex h-full">
        <div className="w-64 border-r border-gray-800 bg-gray-950 p-2">
          <FileTreeNode node={fileSystem} />
        </div>
        <div className="flex-1 p-4 text-gray-400">
          <p>Sélectionnez un fichier pour l'afficher</p>
        </div>
      </div>
    </BaseApp>
  )
}