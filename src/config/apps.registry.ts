import { AppConfig } from '@/types/app.types'
import AboutMe from '@/apps/AboutMe'
import Terminal from '@/apps/Terminal'
import FileExplorer from '@/apps/FileExplorer'
import Calculator from '@/apps/Calculator'
import Browser from '@/apps/Browser'

export const defaultApps: AppConfig[] = [
  {
    id: 'about-me',
    name: 'À propos',
    icon: '👤',
    type: 'internal',
    component: AboutMe,
    defaultSize: { width: 700, height: 500 },
    resizable: true,
    maximizable: true,
    minimizable: true
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '💻',
    type: 'internal',
    component: Terminal,
    defaultSize: { width: 800, height: 500 },
    resizable: true,
    maximizable: true,
    minimizable: true
  },
  {
    id: 'file-explorer',
    name: 'Fichiers',
    icon: '📁',
    type: 'internal',
    component: FileExplorer,
    defaultSize: { width: 900, height: 600 },
    resizable: true,
    maximizable: true,
    minimizable: true
  },
  {
    id: 'calculator',
    name: 'Calculatrice',
    icon: '🧮',
    type: 'internal',
    component: Calculator,
    defaultSize: { width: 380, height: 520 },
    resizable: false,
    maximizable: false,
    minimizable: true
  },
  {
    id: 'browser',
    name: 'Navigateur',
    icon: '🌐',
    type: 'internal',
    component: Browser,
    defaultSize: { width: 1000, height: 700 },
    resizable: true,
    maximizable: true,
    minimizable: true
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🔗',
    type: 'link',
    url: 'https://github.com',
    action: () => window.open('https://github.com', '_blank')
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    type: 'link',
    url: 'https://linkedin.com',
    action: () => window.open('https://linkedin.com', '_blank')
  },
  {
    id: 'mail',
    name: 'Email',
    icon: '✉️',
    type: 'link',
    url: 'mailto:john.doe@example.com',
    action: () => window.location.href = 'mailto:john.doe@example.com'
  }
]