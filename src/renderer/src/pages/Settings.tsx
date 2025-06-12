import Background from '@/components/gesture/Background'
import { Button } from '@/components/settings/button'
import { Card } from '@/components/settings/card'
import { Dropdown, DropdownItem } from '@/components/settings/dropdown'
import { Separator } from '@/components/settings/separator'
import { Slider } from '@/components/settings/slider'
import { Switch } from '@/components/settings/switch'
import { MainHeading, Subtitle } from '@/components/gesture/Typography'
import { useTextSize } from '@/hooks/useTextSize'
import {
  ChevronDown,
  Eye,
  Monitor,
  Settings,
  Sun,
  Save
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import '../styles/custom-text-sizes.css'

// Interfaz para la configuración
interface AppSettings {
  textSize: number
  screenSize: string
  highContrast: boolean
}

export default function SettingsInterface() {
  // Hook para manejar el tamaño de texto
  const { updateTextSize } = useTextSize()
  
  // Cargar configuración guardada o usar valores por defecto
  const loadSavedSettings = (): AppSettings => {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      textSize: 16,
      screenSize: 'standard',
      highContrast: false
    }
  }

  // Estados para tracking de cambios
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Estados principales
  const [settings, setSettings] = useState<AppSettings>(loadSavedSettings())
  const [textSize, setTextSize] = useState(settings.textSize)
  const [screenSize, setScreenSize] = useState(settings.screenSize)
  const [highContrast, setHighContrast] = useState(settings.highContrast)

  // Dropdown states
  const [screenSizeDropdownOpen, setScreenSizeDropdownOpen] = useState(false)

  // Detectar cambios
  useEffect(() => {
    const currentSettings = {
      textSize,
      screenSize,
      highContrast
    }
    
    const savedSettings = loadSavedSettings()
    setHasUnsavedChanges(JSON.stringify(currentSettings) !== JSON.stringify(savedSettings))
  }, [textSize, screenSize, highContrast])

  // Función para guardar cambios
  const handleSaveChanges = () => {
    const settingsToSave = {
      textSize,
      screenSize,
      highContrast
    }
    
    localStorage.setItem('appSettings', JSON.stringify(settingsToSave))
    setHasUnsavedChanges(false)
    setSaveSuccess(true)
    
    // Aplicar el tamaño de texto inmediatamente
    updateTextSize(textSize)
    
    // Resetear el mensaje de éxito después de 2 segundos
    setTimeout(() => {
      setSaveSuccess(false)
    }, 2000)
  }

  const handleScreenSizeChange = (newSize: string) => {
    setScreenSize(newSize)
    setScreenSizeDropdownOpen(false)
    updateWindowSize(newSize)
  }

  // Función para actualizar el tamaño de la ventana
  const updateWindowSize = (size: string) => {
    let dimensions = { width: 1920, height: 1080 } // tamaño estándar

    switch (size) {
      case 'min':
        dimensions = { width: 960, height: 540 }
        break
      case 'compact':
        dimensions = { width: 1280, height: 720 }
        break
      default:
        dimensions = { width: 1920, height: 1080 } // 'standard'
    }

    try {
      if (window?.electron?.ipcRenderer) {
        window.electron.ipcRenderer.send('update-window-size', dimensions)
      } else {
        console.warn('IPC Renderer no disponible')
      }
    } catch (error) {
      console.error('Error al actualizar el tamaño de la ventana:', error)
    }
  }

  return (
    <div className="relative min-h-screen supports-custom-text-size">
      <Background />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <motion.header className="mb-4 pt-4 md:pt-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 text-center">
            <MainHeading>Configuración General</MainHeading>
            <Subtitle className="text-center max-w-2xl mx-auto mt-2" secondary>
              Personaliza la aplicación según tus preferencias y necesidades
            </Subtitle>
          </div>
        </motion.header>

        {/* Main Settings Card with Architecture Imagery */}
        <Card className="mb-8 overflow-hidden transition-all duration-300 hover:shadow-zinc-800/30">
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
              <div className="absolute inset-0 opacity-40">
                <svg
                  viewBox="0 0 400 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                >
                  {/* Abstract Architecture Elements */}
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.2 }} />
                    </linearGradient>
                  </defs>

                  {/* Building structures */}
                  <rect x="50" y="80" width="60" height="120" fill="url(#grad1)" opacity="0.6" />
                  <rect x="120" y="60" width="40" height="140" fill="url(#grad1)" opacity="0.4" />
                  <rect x="170" y="90" width="50" height="110" fill="url(#grad1)" opacity="0.5" />
                  <rect x="230" y="70" width="35" height="130" fill="url(#grad1)" opacity="0.3" />

                  {/* Geometric patterns */}
                  <polygon points="280,50 320,80 280,110 240,80" fill="white" opacity="0.3" />
                  <circle
                    cx="340"
                    cy="80"
                    r="25"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.4"
                  />

                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1="150"
                    x2="400"
                    y2="150"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="400"
                    y2="100"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.15"
                  />

                  {/* Connecting lines */}
                  <path
                    d="M0,180 Q100,160 200,170 T400,160"
                    stroke="white"
                    fill="none"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-3xl font-bold text-white">Personaliza tu Experiencia</h2>
              <p className="mt-2 text-lg text-zinc-300">
                Ajusta la interfaz según tus preferencias
              </p>
            </div>
          </div>

          <div className="space-y-8 p-8">
            {/* Accessibility Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Accesibilidad</h3>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                      <label htmlFor="text-size-slider" className="font-medium text-white">
                        Tamaño del Texto
                      </label>
                    </div>
                    <span className="text-sm text-zinc-400" aria-live="polite">
                      {textSize}px
                    </span>
                  </div>
                  <Slider
                    id="text-size-slider"
                    value={[textSize]}
                    min={14}
                    max={20}
                    step={1}
                    onValueChange={(value) => setTextSize(value[0])}
                    className="py-2"
                    aria-label="Ajustar tamaño del texto"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Pequeño (14px)</span>
                    <span>Grande (20px)</span>
                  </div>
                  <p className="text-sm text-zinc-400" id="text-size-description">
                    Ajusta el tamaño del texto para mejor legibilidad. Los cambios se aplicarán cuando guardes la configuración.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sun className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                      <label htmlFor="high-contrast-switch" className="font-medium text-white">
                        Modo Alto Contraste
                      </label>
                    </div>
                    <Switch
                      id="high-contrast-switch"
                      checked={highContrast}
                      onCheckedChange={setHighContrast}
                      aria-label="Activar modo alto contraste"
                    />
                  </div>
                  <p className="text-sm text-zinc-400" id="contrast-description">
                    {highContrast
                      ? 'Modo alto contraste activado'
                      : 'Modo alto contraste desactivado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Avanzado</h3>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Tamaño de Pantalla</span>
                    </div>
                    <Dropdown
                      isOpen={screenSizeDropdownOpen}
                      onToggle={() => setScreenSizeDropdownOpen(!screenSizeDropdownOpen)}
                      trigger={
                        <Button
                          variant="outline"
                          aria-label="Seleccionar tamaño de pantalla"
                          aria-expanded={screenSizeDropdownOpen}
                          aria-haspopup="listbox"
                        >
                          {screenSize === 'min'
                            ? 'Pequeña'
                            : screenSize === 'compact'
                            ? 'Compacta'
                            : 'Estándar'}{' '}
                          <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Button>
                      }
                    >
                      {[
                        { value: 'min', label: 'Pequeña' },
                        { value: 'standard', label: 'Estándar' },
                        { value: 'compact', label: 'Compacta' }
                      ].map((size) => (
                        <DropdownItem
                          key={size.value}
                          onClick={() => handleScreenSizeChange(size.value)}
                          isSelected={screenSize === size.value}
                        >
                          {size.label}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Elige tu disposición de pantalla preferida
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="px-8 py-4 border-t border-border-primary bg-background-secondary/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                {hasUnsavedChanges 
                  ? 'Hay cambios sin guardar'
                  : saveSuccess 
                    ? '¡Cambios guardados correctamente!'
                    : 'Todos los cambios están guardados'}
              </p>
              <Button
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges}
                className={`flex items-center gap-2 ${
                  hasUnsavedChanges 
                    ? 'bg-accent-primary hover:bg-accent-hover' 
                    : 'bg-zinc-600'
                }`}
                aria-label="Guardar cambios de configuración"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
