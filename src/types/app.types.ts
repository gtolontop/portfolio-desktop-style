export type AppType = 'internal' | 'external' | 'link' | 'folder'

export interface AppPosition {
  x: number
  y: number
}

export interface AppWindow {
  id: string
  appId: string
  title: string
  width: number
  height: number
  x: number
  y: number
  isMaximized: boolean
  isMinimized: boolean
  zIndex: number
}

export interface AppConfig {
  id: string
  name: string
  icon: React.ComponentType<any> | string
  type: AppType
  component?: React.ComponentType<any>
  url?: string
  action?: () => void
  defaultSize?: {
    width: number
    height: number
  }
  resizable?: boolean
  maximizable?: boolean
  minimizable?: boolean
}

export interface DesktopIcon {
  id: string
  appId: string
  position: AppPosition
  gridPosition?: { row: number; col: number }
}