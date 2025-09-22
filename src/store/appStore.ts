import { create } from 'zustand'
import { AppConfig, AppWindow, DesktopIcon } from '@/types/app.types'

interface AppStore {
  apps: Map<string, AppConfig>
  windows: Map<string, AppWindow>
  desktopIcons: DesktopIcon[]
  activeWindowId: string | null
  nextZIndex: number

  registerApp: (app: AppConfig) => void
  unregisterApp: (appId: string) => void

  openWindow: (appId: string) => void
  closeWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void

  updateWindowPosition: (windowId: string, x: number, y: number) => void
  updateWindowSize: (windowId: string, width: number, height: number) => void

  addDesktopIcon: (appId: string, position?: { x: number; y: number }) => void
  removeDesktopIcon: (iconId: string) => void
  updateIconPosition: (iconId: string, x: number, y: number) => void

  getApp: (appId: string) => AppConfig | undefined
}

export const useAppStore = create<AppStore>((set, get) => ({
  apps: new Map(),
  windows: new Map(),
  desktopIcons: [],
  activeWindowId: null,
  nextZIndex: 1000,

  registerApp: (app) => set((state) => {
    const newApps = new Map(state.apps)
    newApps.set(app.id, app)
    return { apps: newApps }
  }),

  unregisterApp: (appId) => set((state) => {
    const newApps = new Map(state.apps)
    newApps.delete(appId)
    return { apps: newApps }
  }),

  openWindow: (appId) => set((state) => {
    const app = state.apps.get(appId)
    if (!app) return state

    const existingWindow = Array.from(state.windows.values()).find(w => w.appId === appId)
    if (existingWindow) {
      get().focusWindow(existingWindow.id)
      if (existingWindow.isMinimized) {
        get().restoreWindow(existingWindow.id)
      }
      return state
    }

    const windowId = `${appId}-${Date.now()}`
    const defaultSize = app.defaultSize || { width: 800, height: 600 }

    const newWindow: AppWindow = {
      id: windowId,
      appId,
      title: app.name,
      width: defaultSize.width,
      height: defaultSize.height,
      x: window.innerWidth / 2 - defaultSize.width / 2,
      y: window.innerHeight / 2 - defaultSize.height / 2,
      isMaximized: false,
      isMinimized: false,
      zIndex: state.nextZIndex
    }

    const newWindows = new Map(state.windows)
    newWindows.set(windowId, newWindow)

    return {
      windows: newWindows,
      activeWindowId: windowId,
      nextZIndex: state.nextZIndex + 1
    }
  }),

  closeWindow: (windowId) => set((state) => {
    const newWindows = new Map(state.windows)
    newWindows.delete(windowId)

    return {
      windows: newWindows,
      activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId
    }
  }),

  minimizeWindow: (windowId) => set((state) => {
    const newWindows = new Map(state.windows)
    const window = newWindows.get(windowId)
    if (window) {
      newWindows.set(windowId, { ...window, isMinimized: true })
    }
    return { windows: newWindows }
  }),

  maximizeWindow: (windowId) => set((state) => {
    const newWindows = new Map(state.windows)
    const window = newWindows.get(windowId)
    if (window) {
      newWindows.set(windowId, {
        ...window,
        isMaximized: true,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 48
      })
    }
    return { windows: newWindows }
  }),

  restoreWindow: (windowId) => set((state) => {
    const newWindows = new Map(state.windows)
    const window = newWindows.get(windowId)
    const app = window ? state.apps.get(window.appId) : null

    if (window && app) {
      const defaultSize = app.defaultSize || { width: 800, height: 600 }
      newWindows.set(windowId, {
        ...window,
        isMaximized: false,
        isMinimized: false,
        width: defaultSize.width,
        height: defaultSize.height,
        x: window.innerWidth / 2 - defaultSize.width / 2,
        y: window.innerHeight / 2 - defaultSize.height / 2
      })
    }
    return { windows: newWindows }
  }),

  focusWindow: (windowId) => set((state) => {
    const newWindows = new Map(state.windows)
    const window = newWindows.get(windowId)
    if (window) {
      newWindows.set(windowId, { ...window, zIndex: state.nextZIndex })
      return {
        windows: newWindows,
        activeWindowId: windowId,
        nextZIndex: state.nextZIndex + 1
      }
    }
    return state
  }),

  updateWindowPosition: (windowId, x, y) => set((state) => {
    const newWindows = new Map(state.windows)
    const window = newWindows.get(windowId)
    if (window && !window.isMaximized) {
      newWindows.set(windowId, { ...window, x, y })
    }
    return { windows: newWindows }
  }),

  updateWindowSize: (windowId, width, height) => set((state) => {
    const newWindows = new Map(state.windows)
    const window = newWindows.get(windowId)
    if (window && !window.isMaximized) {
      newWindows.set(windowId, { ...window, width, height })
    }
    return { windows: newWindows }
  }),

  addDesktopIcon: (appId, position) => set((state) => {
    const iconId = `icon-${appId}-${Date.now()}`
    const newIcon: DesktopIcon = {
      id: iconId,
      appId,
      position: position || { x: 20, y: 20 + state.desktopIcons.length * 100 }
    }
    return { desktopIcons: [...state.desktopIcons, newIcon] }
  }),

  removeDesktopIcon: (iconId) => set((state) => ({
    desktopIcons: state.desktopIcons.filter(icon => icon.id !== iconId)
  })),

  updateIconPosition: (iconId, x, y) => set((state) => ({
    desktopIcons: state.desktopIcons.map(icon =>
      icon.id === iconId ? { ...icon, position: { x, y } } : icon
    )
  })),

  getApp: (appId) => {
    return get().apps.get(appId)
  }
}))