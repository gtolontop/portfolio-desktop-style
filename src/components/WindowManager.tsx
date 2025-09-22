'use client'

import { useAppStore } from '@/store/appStore'
import Window from './Window'

export default function WindowManager() {
  const { windows, getApp } = useAppStore()

  return (
    <>
      {Array.from(windows.values()).map((window) => {
        const app = getApp(window.appId)
        if (!app || !app.component) return null

        const Component = app.component

        return (
          <Window key={window.id} window={window}>
            <Component />
          </Window>
        )
      })}
    </>
  )
}