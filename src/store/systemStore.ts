import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface RecentFile {
  id: string
  name: string
  path: string
  type: 'document' | 'image' | 'code' | 'folder' | 'video' | 'audio' | 'other'
  icon: string
  lastOpened: Date
  pinned?: boolean
}

export interface QuickAccessFolder {
  id: string
  name: string
  path: string
  icon: string
  pinned: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  color: string
  description?: string
}

export interface Notification {
  id: string
  app: string
  title: string
  message: string
  time: Date
  read: boolean
  icon?: string
}

export interface WeatherData {
  location: string
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  sunset: string
  hourly: Array<{
    time: string
    temp: number
    icon: string
  }>
}

export interface MediaPlayerState {
  isPlaying: boolean
  currentTrack: {
    title: string
    artist: string
    album: string
    duration: number
    currentTime: number
    albumArt?: string
  } | null
  volume: number
  shuffle: boolean
  repeat: 'none' | 'one' | 'all'
}

export interface DiscordStatus {
  online: boolean
  messages: Array<{
    id: string
    from: string
    server?: string
    message: string
    unread: number
    avatar?: string
    timestamp: Date
  }>
}

interface SystemState {
  // Recent files
  recentFiles: RecentFile[]
  addRecentFile: (file: Omit<RecentFile, 'id' | 'lastOpened'>) => void
  removeRecentFile: (id: string) => void
  clearRecentFiles: () => void
  pinRecentFile: (id: string) => void

  // Quick access folders
  quickAccessFolders: QuickAccessFolder[]
  addQuickAccessFolder: (folder: Omit<QuickAccessFolder, 'id'>) => void
  removeQuickAccessFolder: (id: string) => void

  // Calendar
  calendarEvents: CalendarEvent[]
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void
  removeCalendarEvent: (id: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void

  // Weather
  weather: WeatherData
  updateWeather: (data: Partial<WeatherData>) => void

  // Media Player
  mediaPlayer: MediaPlayerState
  updateMediaPlayer: (state: Partial<MediaPlayerState>) => void
  togglePlayPause: () => void
  nextTrack: () => void
  prevTrack: () => void

  // Discord
  discord: DiscordStatus
  updateDiscord: (status: Partial<DiscordStatus>) => void

  // Search history
  searchHistory: string[]
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void

  // User profile
  userProfile: {
    name: string
    avatar: string
    email: string
  }
  updateUserProfile: (profile: Partial<SystemState['userProfile']>) => void
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Default data
const defaultRecentFiles: RecentFile[] = [
  {
    id: '1',
    name: 'Portfolio Project',
    path: '/Documents/Projects/Portfolio',
    type: 'folder',
    icon: '📁',
    lastOpened: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    pinned: true
  },
  {
    id: '2',
    name: 'App.tsx',
    path: '/Documents/Projects/Portfolio/src/App.tsx',
    type: 'code',
    icon: '⚛️',
    lastOpened: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '3',
    name: 'Design System.fig',
    path: '/Documents/Design/Design System.fig',
    type: 'document',
    icon: '🎨',
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: '4',
    name: 'API Documentation.md',
    path: '/Documents/Docs/API Documentation.md',
    type: 'document',
    icon: '📚',
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '5',
    name: 'Meeting Notes.docx',
    path: '/Documents/Notes/Meeting Notes.docx',
    type: 'document',
    icon: '📝',
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: '6',
    name: 'Screenshots',
    path: '/Pictures/Screenshots',
    type: 'folder',
    icon: '📷',
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: '7',
    name: 'profile-photo.png',
    path: '/Pictures/profile-photo.png',
    type: 'image',
    icon: '🖼️',
    lastOpened: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
]

const defaultQuickAccessFolders: QuickAccessFolder[] = [
  { id: '1', name: 'Desktop', path: '/Desktop', icon: '🖥️', pinned: true },
  { id: '2', name: 'Downloads', path: '/Downloads', icon: '⬇️', pinned: true },
  { id: '3', name: 'Documents', path: '/Documents', icon: '📄', pinned: true },
  { id: '4', name: 'Pictures', path: '/Pictures', icon: '🖼️', pinned: true },
  { id: '5', name: 'Music', path: '/Music', icon: '🎵', pinned: true },
  { id: '6', name: 'Videos', path: '/Videos', icon: '🎬', pinned: true },
]

const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(),
    time: '9:00 AM',
    color: '#3b82f6',
    description: 'Daily standup meeting'
  },
  {
    id: '2',
    title: 'Project Review',
    date: new Date(),
    time: '2:00 PM',
    color: '#ef4444',
    description: 'Review Q1 progress'
  },
  {
    id: '3',
    title: 'Client Call',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    time: '11:00 AM',
    color: '#8b5cf6',
    description: 'Discuss new requirements'
  },
  {
    id: '4',
    title: 'Launch Preparation',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    time: '3:00 PM',
    color: '#10b981',
    description: 'Final checks before launch'
  },
]

const defaultWeather: WeatherData = {
  location: 'San Francisco',
  temperature: 68,
  condition: 'Partly Cloudy',
  icon: '⛅',
  humidity: 65,
  windSpeed: 12,
  sunset: '7:58 PM',
  hourly: [
    { time: 'Now', temp: 68, icon: '⛅' },
    { time: '2PM', temp: 70, icon: '☀️' },
    { time: '3PM', temp: 72, icon: '☀️' },
    { time: '4PM', temp: 71, icon: '🌤️' },
    { time: '5PM', temp: 69, icon: '🌤️' },
    { time: '6PM', temp: 66, icon: '🌅' },
  ]
}

const defaultMediaPlayer: MediaPlayerState = {
  isPlaying: false,
  currentTrack: {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    currentTime: 62,
  },
  volume: 75,
  shuffle: false,
  repeat: 'none'
}

const defaultDiscord: DiscordStatus = {
  online: true,
  messages: [
    {
      id: '1',
      from: 'Alex',
      message: 'Hey, did you see the new design?',
      unread: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      from: 'Design Team',
      server: 'Work',
      message: 'New mockups uploaded!',
      unread: 12,
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '3',
      from: 'Sarah',
      message: 'Meeting in 10 minutes',
      unread: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
  ]
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    app: 'Mail',
    title: 'New message',
    message: 'You have 3 unread emails',
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    icon: '📧'
  },
  {
    id: '2',
    app: 'Calendar',
    title: 'Upcoming event',
    message: 'Team Standup in 30 minutes',
    time: new Date(Date.now() - 1000 * 60 * 10),
    read: false,
    icon: '📅'
  },
  {
    id: '3',
    app: 'System',
    title: 'Update available',
    message: 'Windows 11 update ready to install',
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    icon: '🔄'
  },
]

export const useSystemStore = create<SystemState>()(
  persist(
    (set, get) => ({
      // Recent files
      recentFiles: defaultRecentFiles,
      addRecentFile: (file) => set((state) => ({
        recentFiles: [
          { ...file, id: generateId(), lastOpened: new Date() },
          ...state.recentFiles.filter(f => f.path !== file.path).slice(0, 19)
        ]
      })),
      removeRecentFile: (id) => set((state) => ({
        recentFiles: state.recentFiles.filter(f => f.id !== id)
      })),
      clearRecentFiles: () => set({ recentFiles: [] }),
      pinRecentFile: (id) => set((state) => ({
        recentFiles: state.recentFiles.map(f =>
          f.id === id ? { ...f, pinned: !f.pinned } : f
        )
      })),

      // Quick access folders
      quickAccessFolders: defaultQuickAccessFolders,
      addQuickAccessFolder: (folder) => set((state) => ({
        quickAccessFolders: [...state.quickAccessFolders, { ...folder, id: generateId() }]
      })),
      removeQuickAccessFolder: (id) => set((state) => ({
        quickAccessFolders: state.quickAccessFolders.filter(f => f.id !== id)
      })),

      // Calendar
      calendarEvents: defaultCalendarEvents,
      addCalendarEvent: (event) => set((state) => ({
        calendarEvents: [...state.calendarEvents, { ...event, id: generateId() }]
      })),
      removeCalendarEvent: (id) => set((state) => ({
        calendarEvents: state.calendarEvents.filter(e => e.id !== id)
      })),

      // Notifications
      notifications: defaultNotifications,
      addNotification: (notification) => set((state) => ({
        notifications: [
          { ...notification, id: generateId(), time: new Date(), read: false },
          ...state.notifications
        ]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Weather
      weather: defaultWeather,
      updateWeather: (data) => set((state) => ({
        weather: { ...state.weather, ...data }
      })),

      // Media Player
      mediaPlayer: defaultMediaPlayer,
      updateMediaPlayer: (newState) => set((state) => ({
        mediaPlayer: { ...state.mediaPlayer, ...newState }
      })),
      togglePlayPause: () => set((state) => ({
        mediaPlayer: { ...state.mediaPlayer, isPlaying: !state.mediaPlayer.isPlaying }
      })),
      nextTrack: () => {
        // Simulated next track
        set((state) => ({
          mediaPlayer: {
            ...state.mediaPlayer,
            currentTrack: {
              title: 'Save Your Tears',
              artist: 'The Weeknd',
              album: 'After Hours',
              duration: 215,
              currentTime: 0
            }
          }
        }))
      },
      prevTrack: () => {
        set((state) => ({
          mediaPlayer: {
            ...state.mediaPlayer,
            currentTrack: state.mediaPlayer.currentTrack
              ? { ...state.mediaPlayer.currentTrack, currentTime: 0 }
              : null
          }
        }))
      },

      // Discord
      discord: defaultDiscord,
      updateDiscord: (status) => set((state) => ({
        discord: { ...state.discord, ...status }
      })),

      // Search history
      searchHistory: ['React hooks', 'TypeScript generics', 'Tailwind CSS', 'Next.js 14'],
      addSearchHistory: (query) => set((state) => ({
        searchHistory: [query, ...state.searchHistory.filter(q => q !== query).slice(0, 9)]
      })),
      clearSearchHistory: () => set({ searchHistory: [] }),

      // User profile
      userProfile: {
        name: 'Concept Central',
        avatar: 'C',
        email: 'contact@conceptcentral.dev'
      },
      updateUserProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile }
      })),
    }),
    {
      name: 'system-storage',
      partialize: (state) => ({
        recentFiles: state.recentFiles,
        quickAccessFolders: state.quickAccessFolders,
        calendarEvents: state.calendarEvents,
        searchHistory: state.searchHistory,
        userProfile: state.userProfile,
      }),
    }
  )
)

// Helper function to format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Helper to format time
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
