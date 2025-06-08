import Background from '@/components/gesture/Background'
import CameraInterface, { CameraInterfaceRef } from '@/components/gesture/CameraInterface'
import { GestureRecognition, GestureRecognitionRef } from '@/components/gesture/GestureRecognition'
import { CameraSettings } from '@/components/gesture/CameraSettings'
import MacWindow from '@/components/gesture/MacWindow'
import NavigationDock from '@/components/gesture/NavigationDock'
import RockPaperScissors, { RockPaperScissorsRef } from '@/components/gesture/RockPaperScissors'
import SimonSaysGame, { SimonSaysGameRef } from '@/components/gesture/SimonSaysGame'
import { GlowingText, MainHeading, Subtitle, Text } from '@renderer/components/gesture/Typography'
import { useTextSize } from '@/hooks/useTextSize'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import '../../src/styles/animations.css'
import '../styles/custom-text-sizes.css'

const GestureTesting: React.FC = () => {
  // Hook para aplicar el tamaño de texto personalizado
  useTextSize()
  
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    flipped: false,
    fullscreen: false,
    brightness: 100,
    contrast: 100,
    resolution: '720p'
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [gestureActive, setGestureActive] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const [simonSaysActive, setSimonSaysActive] = useState(false)
  
  const cameraRef = useRef<CameraInterfaceRef>(null)
  const gestureRef = useRef<GestureRecognitionRef>(null)
  const gameRef = useRef<RockPaperScissorsRef>(null)
  const simonSaysRef = useRef<SimonSaysGameRef>(null)

  // Estado para el gesto actual detectado (solo para mostrar en el panel)
  const [currentGesture, setCurrentGesture] = useState<string | null>(null)

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
    if (gestureActive) {
      gestureRef.current?.restartCamera()
    } else if (gameActive) {
      gameRef.current?.restartCamera()
    } else if (simonSaysActive) {
      simonSaysRef.current?.restartCamera()
    } else {
      cameraRef.current?.restartCamera()
    }
  }, [gestureActive, gameActive, simonSaysActive])

  const handleGestureToggle = useCallback(async (active: boolean) => {
    console.log('🎛️ Toggle de gestos en GestureTesting:', gestureActive, '->', active)
    
    // Si se activa reconocimiento, desactivar todas las otras interacciones
    if (active) {
      setGameActive(false)
      setSimonSaysActive(false)
    }
    
    // Actualizar estado inmediatamente
    setGestureActive(active)
    
    // Si se desactiva, limpiar estado y forzar regreso a cámara normal
    if (!active) {
      console.log('🔄 Desactivando gestos - Iniciando limpieza completa...')
      setCurrentGesture(null)
      
      // Esperar a que la cámara se detenga completamente
      try {
        if (gestureRef.current) {
          await gestureRef.current.stopCamera()
          console.log('✅ Cámara de gestos detenida completamente')
        }
      } catch (error) {
        console.warn('⚠️ Error deteniendo cámara de gestos:', error)
      }
      
      // Forzar limpieza después de un delay más largo
      setTimeout(() => {
        setGestureActive(false)
        setGameActive(false)
        setSimonSaysActive(false)
        console.log('✅ Estado forzado a inactivo - Regresando a CameraInterface')
      }, 300) // Increased delay
    }
  }, [gestureActive])

  const handleGameToggle = useCallback(async (active: boolean) => {
    console.log('🎮 Toggle de juego en GestureTesting:', gameActive, '->', active)
    
    // Si se activa el juego, desactivar otras interacciones 
    if (active) {
      setGestureActive(false)
      setSimonSaysActive(false)
    }
    
    // Actualizar estado del juego
    setGameActive(active)
    
    // Si se desactiva, forzar regreso a cámara normal
    if (!active) {
      console.log('🔄 Desactivando juego - Iniciando limpieza completa...')
      
      // Esperar a que la cámara se detenga completamente
      try {
        if (gameRef.current) {
          await gameRef.current.stopCamera()
          console.log('✅ Cámara de juego detenida completamente')
        }
      } catch (error) {
        console.warn('⚠️ Error deteniendo cámara de juego:', error)
      }
      
      // Forzar limpieza después de un delay más largo
      setTimeout(() => {
        setGestureActive(false)
        setGameActive(false)
        setSimonSaysActive(false)
        console.log('✅ Estado forzado a inactivo - Regresando a CameraInterface')
      }, 300) // Increased delay
    }
  }, [gameActive])

  const handleSimonSaysToggle = useCallback(async (active: boolean) => {
    console.log('🧠 Toggle de SimonSays en GestureTesting:', simonSaysActive, '->', active)
    
    // Si se activa SimonSays, desactivar otras interacciones 
    if (active) {
      setGestureActive(false)
      setGameActive(false)
    }
    
    // Actualizar estado de SimonSays
    setSimonSaysActive(active)
    
    // Si se desactiva, forzar regreso a cámara normal
    if (!active) {
      console.log('🔄 Desactivando SimonSays - Iniciando limpieza completa...')
      
      // Esperar a que la cámara se detenga completamente
      try {
        if (simonSaysRef.current) {
          await simonSaysRef.current.stopCamera()
          console.log('✅ Cámara de SimonSays detenida completamente')
        }
      } catch (error) {
        console.warn('⚠️ Error deteniendo cámara de SimonSays:', error)
      }
      
      // Forzar limpieza después de un delay más largo
      setTimeout(() => {
        setGestureActive(false)
        setGameActive(false)
        setSimonSaysActive(false)
        console.log('✅ Estado forzado a inactivo - Regresando a CameraInterface')
      }, 300) // Increased delay
    }
  }, [simonSaysActive])

  // Función de emergencia para forzar cierre de cámaras
  const forceStopAllCameras = useCallback(async () => {
    console.log('🚨 EMERGENCIA: Forzando cierre de todas las cámaras y regreso al estado inicial')
    
    try {
      // Forzar todos los estados a false inmediatamente
      setGestureActive(false)
      setGameActive(false)
      setSimonSaysActive(false)
      setCurrentGesture(null)
      
      // Obtener todos los dispositivos multimedia
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      
      console.log('📹 Dispositivos de video encontrados:', videoDevices.length)
      
      // Intentar obtener y detener todos los streams
      for (const device of videoDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: device.deviceId }
          })
          stream.getTracks().forEach(track => {
            track.stop()
            console.log('🛑 FORZADO: Track detenido para dispositivo:', device.label)
          })
        } catch (err) {
          // Ignorar errores, probablemente ya está cerrado
        }
      }
      
      // Forzar limpieza de todos los refs
      if (gestureRef.current) {
        try {
          await gestureRef.current.stopCamera()
        } catch (err) {
          console.log('⚠️ Error deteniendo gestureRef:', err)
        }
      }
      
      if (gameRef.current) {
        try {
          await gameRef.current.stopCamera()
        } catch (err) {
          console.log('⚠️ Error deteniendo gameRef:', err)
        }
      }
      
      if (simonSaysRef.current) {
        try {
          await simonSaysRef.current.stopCamera()
        } catch (err) {
          console.log('⚠️ Error deteniendo simonSaysRef:', err)
        }
      }
      
      // Segundo nivel de forzado después de un delay
      setTimeout(() => {
        setGestureActive(false)
        setGameActive(false)
        setSimonSaysActive(false)
        setCurrentGesture(null)
        console.log('🔄 Segundo nivel de limpieza forzada aplicado')
      }, 200)
      
      console.log('✅ EMERGENCIA: Limpieza completa - Regresando a CameraInterface')
    } catch (error) {
      console.error('❌ Error en función de emergencia:', error)
      // Forzar reseteo incluso si hay error
      setGestureActive(false)
      setGameActive(false)
      setSimonSaysActive(false)
      setCurrentGesture(null)
    }
  }, [])

  // Función adicional para resetear completamente
  const forceResetToInitial = useCallback(() => {
    console.log('🔄 FORZANDO RESETEO COMPLETO AL ESTADO INICIAL')
    
    // Detener todo inmediatamente
    setGestureActive(false)
    setGameActive(false)
    setSimonSaysActive(false)
    setCurrentGesture(null)
    setActiveSection(null)
    
    // Aplicar después de un micro delay para asegurar
    setTimeout(() => {
      setGestureActive(false)
      setGameActive(false)
      setSimonSaysActive(false)
      console.log('✅ RESETEO FORZADO COMPLETADO - Estado inicial restaurado')
    }, 10)
  }, [])

  // Agregar listener para combinación de teclas de emergencia
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+E = Emergencia completa
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        console.log('🚨 Combinación de emergencia detectada (Ctrl+Shift+E)')
        forceStopAllCameras()
      }
      
      // Ctrl+Shift+R = Reseteo rápido al estado inicial
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        console.log('🔄 Combinación de reseteo detectada (Ctrl+Shift+R)')
        forceResetToInitial()
      }
      
      // Escape = Cerrar interacción actual
      if (event.key === 'Escape') {
        console.log('⚠️ Escape presionado - Cerrando interacción actual')
        if (gestureActive) {
          setGestureActive(false)
        } else if (gameActive) {
          setGameActive(false)
        } else if (simonSaysActive) {
          setSimonSaysActive(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [forceStopAllCameras, forceResetToInitial, gestureActive, gameActive, simonSaysActive])

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

  // Escuchar cambios en el gesto detectado desde el hook
  useEffect(() => {
    // Esta función se puede expandir para escuchar eventos de gestos
    // Por ahora, el gesto se pasará directamente al componente
  }, [])

  // Función para actualizar el gesto actual desde GestureRecognition
  const handleGestureUpdate = useCallback((gesture: string | null) => {
    setCurrentGesture(gesture)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-primary supports-custom-text-size">
      {/* Background con efectos visuales */}
      <Background />

      {/* Contenedor principal con animaciones */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Botón de emergencia */}
        {(gestureActive || gameActive || simonSaysActive) && (
          <motion.button
            className="fixed top-4 right-4 z-50 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl transition-colors"
            onClick={forceResetToInitial}
            title="Resetear al estado inicial (Escape, Ctrl+Shift+R)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-bold">✕</span>
          </motion.button>
        )}

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
          className="flex-grow flex flex-col gap-6 items-center justify-center w-full max-w-[1920px] mx-auto"
          variants={itemVariants}
        >
          {/* Contenedor principal con grid responsivo */}
          <div className={`w-full grid gap-6 transition-all duration-500 ${
            isFullscreen ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-12'
          }`}>
            
            {/* Sección de la cámara - Ocupa la mayor parte del espacio */}
            <motion.div
              className={`transition-all duration-500 ${
                isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'xl:col-span-8'
              }`}
              variants={itemVariants}
              whileHover={!isFullscreen ? { scale: 1.002 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {isFullscreen && (
                <button
                  onClick={() => handleFullscreenChange(false)}
                  className="absolute top-4 right-4 z-10 p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
                  aria-label="Salir de pantalla completa"
                >
                  <span className="text-lg">✕</span>
                </button>
              )}
              
              <MacWindow
                title={gestureActive ? "Gesture Recognition Camera" : gameActive ? "Rock Paper Scissors Game" : simonSaysActive ? "Simon Says Memory Game" : "Camera Interface"}
                variant={gestureActive ? "blue" : gameActive ? "purple" : simonSaysActive ? "green" : "purple"}
                className={isFullscreen ? 'h-full' : ''}
              >
                <AnimatePresence mode="wait">
                  {gestureActive ? (
                    <motion.div
                      key="gesture"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <GestureRecognition
                        ref={gestureRef}
                        isActive={gestureActive}
                        onGestureUpdate={handleGestureUpdate}
                      />
                    </motion.div>
                  ) : gameActive ? (
                    <motion.div
                      key="game"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <RockPaperScissors
                        ref={gameRef}
                        isActive={gameActive}
                        onToggle={setGameActive}
                      />
                    </motion.div>
                  ) : simonSaysActive ? (
                    <motion.div
                      key="simonSays"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <SimonSaysGame
                        ref={simonSaysRef}
                        isActive={simonSaysActive}
                        onToggle={setSimonSaysActive}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CameraInterface
                        ref={cameraRef}
                        flipped={cameraSettings.flipped}
                        brightness={cameraSettings.brightness}
                        contrast={cameraSettings.contrast}
                        resolution={cameraSettings.resolution}
                        onCameraRestart={() => console.log('Camera restarted')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </MacWindow>
            </motion.div>

            {/* Panel lateral con controles e interacciones */}
            <motion.aside
              className={`w-full space-y-6 transition-all duration-500 ${
                isFullscreen ? 'hidden' : 'xl:col-span-4'
              }`}
              variants={itemVariants}
            >
              {/* Dock de navegación e interacciones */}
              <div className="w-full">
                <NavigationDock
                  onSettingsChange={handleCameraSettingsChange}
                  onFlipChange={handleFlipChange}
                  onFullscreenChange={handleFullscreenChange}
                  onRestartCamera={handleRestartCamera}
                  onGestureToggle={handleGestureToggle}
                  onGameToggle={handleGameToggle}
                  onSimonSaysToggle={handleSimonSaysToggle}
                  gestureActive={gestureActive}
                  gameActive={gameActive}
                  simonSaysActive={simonSaysActive}
                />
              </div>

              {/* Sección de interacciones activas */}
              <div className="space-y-4">
                {/* Información de reconocimiento de gestos */}
                <AnimatePresence>
                  {gestureActive && !gameActive && !simonSaysActive && (
                    <motion.div
                      className="bg-blue-500/10 backdrop-blur-md rounded-xl border border-blue-500/20 p-4"
                      initial={{ opacity: 0, scale: 0.9, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -20 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                        <h3 className="text-blue-400 font-semibold text-sm">
                          Reconocimiento Activo
                        </h3>
                      </div>
                      <Text className="text-white/80 text-xs mb-3">
                        El sistema está reconociendo gestos en tiempo real. Muestra diferentes gestos 
                        frente a la cámara para ver la detección automática.
                      </Text>
                      <div className="text-[10px] text-blue-300/80">
                        💡 Tip: Mantén la mano visible y haz gestos claros para mejor reconocimiento
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Juego de Piedra, Papel o Tijeras - Ya no necesario en sidebar */}
                {/* El juego ahora se muestra en la cámara principal */}

                {/* Estado de reposo cuando no hay interacciones activas */}
                <AnimatePresence>
                  {!gestureActive && !gameActive && !simonSaysActive && (
                    <motion.div
                      className="bg-gray-500/10 backdrop-blur-md rounded-xl border border-gray-500/20 p-6 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="text-4xl mb-3">🎯</div>
                      <h3 className="text-white font-semibold text-sm mb-2">
                        Interacciones Disponibles
                      </h3>
                      <Text className="text-white/60 text-xs mb-4">
                        Selecciona una interacción del dock para comenzar a explorar las capacidades del sistema.
                        Solo una interacción puede estar activa a la vez.
                      </Text>
                      <div className="grid grid-cols-3 gap-2 text-[10px] text-white/50">
                        <div className="flex flex-col items-center">
                          <span className="text-blue-400">👋</span>
                          <span>Reconocimiento</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-green-400">🧠</span>
                          <span>Simon Says</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-purple-400">🎮</span>
                          <span>Juego PPT</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          </div>
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
