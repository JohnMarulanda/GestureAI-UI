import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowRight, HelpCircle, Home, Play, Settings } from 'lucide-react'

export interface RouteConfig {
  icon: LucideIcon
  label: string
  path: string
}

export const routes: RouteConfig[] = [
  {
    icon: ArrowLeft,
    label: 'Anterior',
    path: 'prev'
  },
  {
    icon: Home,
    label: 'Inicio',
    path: '/home'
  },
  {
    icon: Play,
    label: 'Prueba de Gestos',
    path: '/detection-test'
  },
  {
    icon: Settings,
    label: 'Configuración de Detección',
    path: '/detection-settings'
  },
  {
    icon: Settings,
    label: 'Configuración',
    path: '/settings'
  },
  {
    icon: HelpCircle,
    label: 'Ayuda',
    path: '/help'
  },
  {
    icon: ArrowRight,
    label: 'Siguiente',
    path: 'next'
  }
]
