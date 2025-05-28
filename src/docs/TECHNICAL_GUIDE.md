# Guía Técnica de Implementación - GestureAI-UI Frontend

## Configuración del Entorno de Desarrollo

### Requisitos Previos

```bash
# Node.js (versión 18 o superior)
node --version

# npm o yarn
npm --version

# Git
git --version
```

### Instalación y Configuración

```bash
# Clonar el repositorio
git clone <repository-url>
cd GestureAI-UI

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Construir aplicación de escritorio
npm run build:win  # Windows
npm run build:mac  # macOS
npm run build:linux # Linux
```

## Arquitectura de Comunicación IPC

### Configuración del Preload Script

```typescript
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, data?: any) => {
      ipcRenderer.send(channel, data)
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, func)
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
})
```

### Tipos TypeScript para IPC

```typescript
// src/shared/types.ts
export interface WindowDimensions {
  width: number
  height: number
}

export interface SettingsData {
  theme: 'light' | 'dark'
  language: 'English' | 'Spanish'
  screenSize: 'compact' | 'standard' | 'wide'
  notifications: boolean
  accessibility: {
    highContrast: boolean
    textSize: number
    keyboardNav: boolean
    screenReader: boolean
    disableAnimations: boolean
  }
}

export interface IPCChannels {
  'update-window-size': WindowDimensions
  'open-control-panel': void
  'close-window': void
  'minimize-window': void
  'save-settings': SettingsData
  'load-settings': void
}
```

### Implementación de Hooks Personalizados

```typescript
// src/renderer/src/hooks/useIPC.ts
import { useCallback, useEffect } from 'react'

export const useIPC = () => {
  const sendMessage = useCallback((channel: string, data?: any) => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send(channel, data)
    }
  }, [])

  const onMessage = useCallback((channel: string, callback: (...args: any[]) => void) => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on(channel, callback)
      return () => window.electron.ipcRenderer.removeAllListeners(channel)
    }
  }, [])

  return { sendMessage, onMessage }
}

// Hook específico para configuraciones
export const useSettings = () => {
  const { sendMessage, onMessage } = useIPC()

  const updateWindowSize = useCallback(
    (dimensions: WindowDimensions) => {
      sendMessage('update-window-size', dimensions)
    },
    [sendMessage]
  )

  const saveSettings = useCallback(
    (settings: SettingsData) => {
      sendMessage('save-settings', settings)
    },
    [sendMessage]
  )

  return { updateWindowSize, saveSettings }
}
```

## Sistema de Componentes Detallado

### Estructura Base de Componentes

```typescript
// Patrón base para componentes
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'default', size = 'md', disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Clases base
          'base-styles',
          // Variantes
          {
            'variant-default': variant === 'default',
            'variant-secondary': variant === 'secondary',
          },
          // Tamaños
          {
            'size-sm': size === 'sm',
            'size-md': size === 'md',
            'size-lg': size === 'lg',
          },
          // Estados
          {
            'disabled': disabled,
          },
          className
        )}
        {...props}
      />
    )
  }
)

Component.displayName = 'Component'
export { Component }
```

### Implementación del Dropdown Avanzado

```typescript
// src/renderer/src/components/settings/dropdown.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  position?: 'top' | 'bottom' | 'auto'
}

export const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
  position = 'auto'
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [actualPosition, setActualPosition] = useState<'top' | 'bottom'>('bottom')

  useEffect(() => {
    if (position === 'auto' && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top

      setActualPosition(spaceBelow < 200 && spaceAbove > 200 ? 'top' : 'bottom')
    } else {
      setActualPosition(position as 'top' | 'bottom')
    }
  }, [isOpen, position])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={onToggle} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 w-48 rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg z-50',
            {
              'bottom-full mb-2': actualPosition === 'top',
              'top-full mt-2': actualPosition === 'bottom',
            }
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
```

## Gestión de Estado Avanzada

### Context para Configuraciones Globales

```typescript
// src/renderer/src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { SettingsData } from '@/shared/types'

type SettingsAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'English' | 'Spanish' }
  | { type: 'SET_SCREEN_SIZE'; payload: 'compact' | 'standard' | 'wide' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'UPDATE_ACCESSIBILITY'; payload: Partial<SettingsData['accessibility']> }
  | { type: 'LOAD_SETTINGS'; payload: SettingsData }

const initialSettings: SettingsData = {
  theme: 'dark',
  language: 'English',
  screenSize: 'standard',
  notifications: true,
  accessibility: {
    highContrast: false,
    textSize: 16,
    keyboardNav: false,
    screenReader: false,
    disableAnimations: false,
  },
}

const settingsReducer = (state: SettingsData, action: SettingsAction): SettingsData => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_SCREEN_SIZE':
      return { ...state, screenSize: action.payload }
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications }
    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        accessibility: { ...state.accessibility, ...action.payload },
      }
    case 'LOAD_SETTINGS':
      return action.payload
    default:
      return state
  }
}

interface SettingsContextType {
  settings: SettingsData
  dispatch: React.Dispatch<SettingsAction>
  updateWindowSize: (size: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings)

  const updateWindowSize = (size: string) => {
    const dimensions = {
      compact: { width: 1280, height: 720 },
      standard: { width: 1920, height: 1080 },
      wide: { width: 2560, height: 1440 },
    }[size] || { width: 1920, height: 1080 }

    window.electron?.ipcRenderer.send('update-window-size', dimensions)
  }

  // Cargar configuraciones al iniciar
  useEffect(() => {
    const savedSettings = localStorage.getItem('gestureai-settings')
    if (savedSettings) {
      dispatch({ type: 'LOAD_SETTINGS', payload: JSON.parse(savedSettings) })
    }
  }, [])

  // Guardar configuraciones cuando cambien
  useEffect(() => {
    localStorage.setItem('gestureai-settings', JSON.stringify(settings))
    window.electron?.ipcRenderer.send('save-settings', settings)
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings, dispatch, updateWindowSize }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
```

## Optimización de Rendimiento

### Memoización de Componentes

```typescript
// Componente optimizado con React.memo
import React, { memo } from 'react'

interface ExpensiveComponentProps {
  data: ComplexData[]
  onAction: (id: string) => void
}

const ExpensiveComponent = memo<ExpensiveComponentProps>(({ data, onAction }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onAction(item.id)}>
          {item.content}
        </div>
      ))}
    </div>
  )
}, (prevProps, nextProps) => {
  // Comparación personalizada
  return (
    prevProps.data.length === nextProps.data.length &&
    prevProps.data.every((item, index) =>
      item.id === nextProps.data[index].id &&
      item.content === nextProps.data[index].content
    )
  )
})
```

### Debouncing para Inputs

```typescript
// Hook personalizado para debouncing
import { useState, useEffect } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Uso en componente
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Realizar búsqueda
      performSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  )
}
```

## Testing y Calidad de Código

### Configuración de Testing

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer/src')
    }
  }
})
```

### Ejemplo de Test de Componente

```typescript
// src/test/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/settings/button'

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="outline">Outline Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('variant-outline')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
```

## Deployment y Build

### Configuración de Electron Builder

```yaml
# electron-builder.yml
appId: com.gestureai.app
productName: GestureAI
directories:
  buildResources: build
files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.{js,ts,mjs,cjs}'
  - '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}'
  - '!{.env,.env.*,.npmrc,pnpm-lock.yaml}'
  - '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
asarUnpack:
  - resources/**
win:
  executableName: GestureAI
  icon: resources/Icono.ico
mac:
  entitlementsInherit: build/entitlements.mac.plist
  icon: build/icon.icns
linux:
  icon: build/icon.png
npmRebuild: false
publish:
  provider: generic
  url: https://example.com/auto-updates
```

### Scripts de Build

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "preview": "electron-vite preview",
    "build:win": "npm run build && electron-builder --win",
    "build:mac": "npm run build && electron-builder --mac",
    "build:linux": "npm run build && electron-builder --linux",
    "build:all": "npm run build && electron-builder --win --mac --linux",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

## Mejores Prácticas

### Convenciones de Código

1. **Naming Conventions**:

   - Componentes: PascalCase (`UserProfile.tsx`)
   - Hooks: camelCase con prefijo 'use' (`useSettings.ts`)
   - Utilities: camelCase (`formatDate.ts`)
   - Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

2. **Estructura de Archivos**:

   ```
   ComponentName/
   ├── index.ts          # Export principal
   ├── ComponentName.tsx # Implementación
   ├── ComponentName.test.tsx # Tests
   ├── ComponentName.stories.tsx # Storybook
   └── types.ts          # Tipos específicos
   ```

3. **Import Organization**:

   ```typescript
   // 1. React y librerías externas
   import React, { useState, useEffect } from 'react'
   import { motion } from 'framer-motion'

   // 2. Imports internos
   import { Button } from '@/components/ui/button'
   import { useSettings } from '@/hooks/useSettings'

   // 3. Imports relativos
   import './ComponentName.css'
   ```

### Seguridad

1. **Validación de Datos IPC**:

   ```typescript
   // Validar datos antes de enviar por IPC
   const validateWindowDimensions = (dimensions: any): dimensions is WindowDimensions => {
     return (
       typeof dimensions === 'object' &&
       typeof dimensions.width === 'number' &&
       typeof dimensions.height === 'number' &&
       dimensions.width > 0 &&
       dimensions.height > 0
     )
   }
   ```

2. **Sanitización de Inputs**:
   ```typescript
   const sanitizeInput = (input: string): string => {
     return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
   }
   ```

### Performance Monitoring

```typescript
// Hook para medir rendimiento
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      console.log(`${componentName} render time: ${endTime - startTime}ms`)
    }
  })
}
```

---

_Guía técnica actualizada: Diciembre 2024_
_Para consultas técnicas: [email@example.com]_
