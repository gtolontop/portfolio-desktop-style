import { AppConfig } from '@/types/app.types'
import TestFrame from '@/apps/TestFrame'
import { PaintIcon } from '@/components/Icons'

export const defaultApps: AppConfig[] = [
  {
    id: 'test-frame',
    name: 'Test Frame',
    icon: PaintIcon,
    type: 'internal',
    component: TestFrame,
    defaultSize: { width: 1000, height: 700 },
    resizable: true,
    maximizable: true,
    minimizable: true
  }
]