import { AppConfig } from '@/types/app.types'
import TestFrame from '@/apps/TestFrame'

export const defaultApps: AppConfig[] = [
  {
    id: 'test-frame',
    name: 'Test Frame',
    icon: '🎨',
    type: 'internal',
    component: TestFrame,
    defaultSize: { width: 1000, height: 700 },
    resizable: true,
    maximizable: true,
    minimizable: true
  }
]