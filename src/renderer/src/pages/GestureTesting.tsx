import Background from '@/components/gesture/Background'
import CameraInterface, { CameraInterfaceRef } from '@/components/gesture/CameraInterface'
import { CameraSettings } from '@/components/gesture/CameraSettings'
import MacWindow from '@/components/gesture/MacWindow'
import NavigationDock from '@/components/gesture/NavigationDock'
import { GlowingText, MainHeading, Subtitle, Text } from '@renderer/components/gesture/Typography'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useRef, useState } from 'react'
import '../../src/styles/animations.css'

const GestureTesting: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    flipped: false,
    fullscreen: false,
    brightness: 100,
    contrast: 100,
    resolution: '720p'
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const cameraRef = useRef<CameraInterfaceRef>(null)

  // Callbacks para manejar cambios de configuración
  const handleCameraSettingsChange = useCallback((settings: CameraSettings) => {
    setCameraSettings(settings)
  }, [])

  const handleFlipChange = useCallback((flipped: boolean) => {
    setCameraSettings((prev) => ({ ...prev, flipped }))
  }, [])

  const handleFullscreenChange = useCallback((fullscreen: boolean) => {
    setIsFullscreen(fullscreen)
    setCameraSettings((prev) => ({ ...prev, fullscreen }))
  }, [])

  const handleRestartCamera = useCallback(() => {
    cameraRef.current?.restartCamera()
  }, [])

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-primary">
      {/* Background con efectos visuales */}
      <Background />

      {/* Contenedor principal con animaciones */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sección de encabezado */}
        <motion.header className="mb-4 pt-4 md:pt-8" variants={itemVariants}>
          <div className="mb-8 float-animation">
            <MainHeading>Los gestos dan vida a las ideas.</MainHeading>

            <Subtitle className="text-center max-w-2xl mx-auto mt-2" secondary>
              Prueba y controla tu mundo digital con gestos y movimientos naturales de la mano.
            </Subtitle>
          </div>
        </motion.header>

        {/* Sección principal con cámara y dock */}
        <motion.main
          className="flex-grow flex flex-col xl:flex-row gap-8 items-center justify-center w-full max-w-[1920px] mx-auto"
          variants={itemVariants}
        >
          {/* Sección de la cámara */}
          <motion.div
            className={`flex-grow w-full transition-all duration-500 ${
              isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'xl:w-3/4'
            }`}
            variants={itemVariants}
            whileHover={!isFullscreen ? { scale: 1.005 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {isFullscreen && (
              <button
                onClick={() => handleFullscreenChange(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Salir de pantalla completa"
              >
                ✕
              </button>
            )}
            <MacWindow
              title="Gesture Recognition Camera"
              variant="purple"
              className={isFullscreen ? 'h-full' : ''}
            >
              <CameraInterface
                ref={cameraRef}
                flipped={cameraSettings.flipped}
                brightness={cameraSettings.brightness}
                contrast={cameraSettings.contrast}
                resolution={cameraSettings.resolution}
                onCameraRestart={() => console.log('Camera restarted')}
              />
            </MacWindow>
          </motion.div>

          {/* Panel lateral con dock y controles */}
          <motion.aside
            className={`w-full xl:w-1/4 flex flex-col gap-6 transition-all duration-500 ${
              isFullscreen ? 'hidden' : ''
            }`}
            variants={itemVariants}
          >
            {/* Dock de navegación reorganizado */}
            <div className="w-full">
              <NavigationDock
                onSettingsChange={handleCameraSettingsChange}
                onFlipChange={handleFlipChange}
                onFullscreenChange={handleFullscreenChange}
                onRestartCamera={handleRestartCamera}
              />
            </div>

            {/* Panel de información contextual */}
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection}
                  className="bg-background-secondary/50 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-dark-lg"
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Text>Información contextual sobre gestos y controles</Text>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </motion.main>

        {/* Pie de página */}
        <motion.footer
          className="mt-8 py-4 text-center text-white/40 text-xs"
          variants={itemVariants}
        >
          <GlowingText color="blue" className="text-xs">
            GestOS •{' '}
            <GlowingText color="purple" className="text-xs">
              by JohnMV
            </GlowingText>
          </GlowingText>
        </motion.footer>
      </motion.div>
    </div>
  )
}

export default GestureTesting
