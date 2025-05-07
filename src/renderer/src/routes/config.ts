import type { LucideIcon } from 'lucide-react'
import { HelpCircle, Home, Info, Layout, Play, Settings } from 'lucide-react'

export interface RouteConfig {
  icon: LucideIcon
  label: string
  path: string
}

export const routes: RouteConfig[] = [
  {
    icon: Home,
    label: 'Home',
    path: '/'
  },
  {
    icon: Play,
    label: 'Detection',
    path: '/detection'
  },
  {
    icon: Layout,
    label: 'Control Panel',
    path: '/control'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  },
  {
    icon: Info,
    label: 'About',
    path: '/about'
  },
  {
    icon: HelpCircle,
    label: 'Help',
    path: '/help'
  }
]
