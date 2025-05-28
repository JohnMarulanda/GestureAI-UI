import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  Check,
  FlipHorizontal,
  Maximize,
  RefreshCw,
  Settings,
  Sliders,
  X
} from 'lucide-react'
import React, { useState } from 'react'

interface CameraSettingsProps {
  className?: string
  onSettingsChange?: (settings: CameraSettings) => void
  onFlipChange?: (flipped: boolean) => void
  onFullscreenChange?: (fullscreen: boolean) => void
  onRestartCamera?: () => void
}

export interface CameraSettings {
  flipped: boolean
  fullscreen: boolean
  brightness: number
  contrast: number
  resolution: string
}

const CameraSettings: React.FC<CameraSettingsProps> = ({
  className = '',
  onSettingsChange,
  onFlipChange,
  onFullscreenChange,
  onRestartCamera
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general')
  const [flipped, setFlipped] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [resolution, setResolution] = useState('720p')

  const toggleSettings = () => setIsOpen(!isOpen)

  const toggleFlip = () => {
    const newFlipped = !flipped
    setFlipped(newFlipped)
    onFlipChange?.(newFlipped)
    notifySettingsChange({ flipped: newFlipped })
  }

  const toggleFullscreen = () => {
    const newFullscreen = !fullscreen
    setFullscreen(newFullscreen)
    onFullscreenChange?.(newFullscreen)
    notifySettingsChange({ fullscreen: newFullscreen })
  }

  const handleBrightnessChange = (value: number) => {
    setBrightness(value)
    notifySettingsChange({ brightness: value })
  }

  const handleContrastChange = (value: number) => {
    setContrast(value)
    notifySettingsChange({ contrast: value })
  }

  const handleResolutionChange = (value: string) => {
    setResolution(value)
    notifySettingsChange({ resolution: value })
  }

  const handleRestartCamera = () => {
    onRestartCamera?.()
  }

  const notifySettingsChange = (partialSettings: Partial<CameraSettings>) => {
    const currentSettings: CameraSettings = {
      flipped,
      fullscreen,
      brightness,
      contrast,
      resolution,
      ...partialSettings
    }
    onSettingsChange?.(currentSettings)
  }

  // Variantes para animaciones
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  }

  const tabVariants = {
    inactive: { opacity: 0.7, y: 5 },
    active: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    }
  }

  return (
    <div
      className={`relative flex justify-center items-center ${className}`}
      style={{ height: '100%' }}
    >
      <motion.button
        className="p-3 rounded-full bg-background-accent/20 hover:bg-background-accent/30 text-white transition-colors"
        onClick={toggleSettings}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Configuración de cámara"
        aria-expanded={isOpen}
        aria-controls="camera-settings-panel"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Panel de configuración */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="camera-settings-panel"
            className="absolute right-0 bottom-full mb-2 w-72 rounded-xl overflow-hidden bg-background-secondary/90 backdrop-blur-md border border-white/10 shadow-xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Configuración de cámara"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="text-white font-medium flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Configuración de cámara
              </h3>
              <motion.button
                onClick={toggleSettings}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar configuración"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Pestañas */}
            <div className="flex border-b border-white/10">
              <motion.button
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'general' ? 'text-white' : 'text-white/60'}`}
                onClick={() => setActiveTab('general')}
                variants={tabVariants}
                animate={activeTab === 'general' ? 'active' : 'inactive'}
                aria-selected={activeTab === 'general'}
                role="tab"
              >
                General
              </motion.button>
              <motion.button
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'advanced' ? 'text-white' : 'text-white/60'}`}
                onClick={() => setActiveTab('advanced')}
                variants={tabVariants}
                animate={activeTab === 'advanced' ? 'active' : 'inactive'}
                aria-selected={activeTab === 'advanced'}
                role="tab"
              >
                Avanzado
              </motion.button>
            </div>

            {/* Contenido de pestañas */}
            <div className="p-4">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  {/* Botones de acción rápida */}
                  <div className="flex space-x-2">
                    <motion.button
                      className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center ${flipped ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                      onClick={toggleFlip}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      aria-pressed={flipped}
                    >
                      <FlipHorizontal className="w-4 h-4 mr-2" />
                      Voltear
                      {flipped && <Check className="w-3 h-3 ml-1" />}
                    </motion.button>

                    <motion.button
                      className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center ${fullscreen ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                      onClick={toggleFullscreen}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      aria-pressed={fullscreen}
                    >
                      <Maximize className="w-4 h-4 mr-2" />
                      Pantalla completa
                      {fullscreen && <Check className="w-3 h-3 ml-1" />}
                    </motion.button>
                  </div>

                  {/* Selector de resolución */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/80 flex items-center">
                      <Sliders className="w-4 h-4 mr-2" />
                      Resolución
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => handleResolutionChange(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Seleccionar resolución"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p (Recomendado)</option>
                      <option value="1080p">1080p</option>
                    </select>
                  </div>

                  {/* Botón de reinicio */}
                  <motion.button
                    className="w-full mt-2 py-2 px-3 rounded-lg text-sm flex items-center justify-center bg-white/10 text-white/80 hover:bg-white/20"
                    onClick={handleRestartCamera}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reiniciar cámara
                  </motion.button>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  {/* Control de brillo */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="brightness" className="text-sm text-white/80">
                        Brillo
                      </label>
                      <span className="text-xs text-white/60">{brightness}%</span>
                    </div>
                    <input
                      id="brightness"
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-white/10 rounded-lg h-2"
                      aria-valuemin={0}
                      aria-valuemax={200}
                      aria-valuenow={brightness}
                    />
                  </div>

                  {/* Control de contraste */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="contrast" className="text-sm text-white/80">
                        Contraste
                      </label>
                      <span className="text-xs text-white/60">{contrast}%</span>
                    </div>
                    <input
                      id="contrast"
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => handleContrastChange(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-white/10 rounded-lg h-2"
                      aria-valuemin={0}
                      aria-valuemax={200}
                      aria-valuenow={contrast}
                    />
                  </div>

                  {/* Información adicional */}
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-blue-300">
                      Los ajustes avanzados pueden afectar al rendimiento de la detección de gestos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CameraSettings
