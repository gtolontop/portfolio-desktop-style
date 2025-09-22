'use client'

import { useState, useRef, useEffect } from 'react'

export default function Terminal() {
  const [history, setHistory] = useState<string[]>([
    '> Terminal Portfolio v1.0.0',
    '> Tapez "help" pour voir les commandes disponibles'
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands: Record<string, () => string | string[]> = {
    help: () => [
      'Commandes disponibles:',
      '  help     - Afficher cette aide',
      '  about    - À propos de moi',
      '  skills   - Mes compétences',
      '  projects - Mes projets',
      '  contact  - Me contacter',
      '  clear    - Effacer le terminal',
      '  date     - Afficher la date'
    ],
    about: () => 'Développeur Full Stack passionné par les nouvelles technologies.',
    skills: () => [
      'Frontend: React, Next.js, TypeScript, Vue.js',
      'Backend: Node.js, Python, Express, FastAPI',
      'Database: PostgreSQL, MongoDB, Redis',
      'DevOps: Docker, AWS, CI/CD'
    ],
    projects: () => [
      '1. E-commerce Platform - Next.js + Stripe',
      '2. Task Management App - React + Node.js',
      '3. Real-time Chat - Socket.io + Redis',
      '4. Data Visualization Dashboard - D3.js + Python'
    ],
    contact: () => [
      'Email: john.doe@example.com',
      'GitHub: github.com/johndoe',
      'LinkedIn: linkedin.com/in/johndoe'
    ],
    clear: () => {
      setHistory([])
      return ''
    },
    date: () => new Date().toLocaleString('fr-FR')
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const newHistory = [...history, `> ${cmd}`]

    if (trimmedCmd in commands) {
      const result = commands[trimmedCmd]()
      if (Array.isArray(result)) {
        newHistory.push(...result)
      } else if (result) {
        newHistory.push(result)
      }
    } else if (trimmedCmd === '') {
      // Empty command, do nothing
    } else {
      newHistory.push(`Commande inconnue: ${cmd}`)
      newHistory.push('Tapez "help" pour voir les commandes disponibles')
    }

    setHistory(newHistory)
    setCurrentCommand('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand)
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div
      className="h-full w-full bg-black p-4 font-mono text-green-400 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={terminalRef}
        className="h-full overflow-auto"
      >
        <div className="space-y-1">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          <div className="flex">
            <span className="mr-2">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  )
}