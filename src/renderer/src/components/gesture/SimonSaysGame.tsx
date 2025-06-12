import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { Brain, RotateCcw, Play, Target, Bug, Loader2, AlertCircle, Zap, Trophy } from 'lucide-react'
import { useGestureRecognizer, GestureResult } from '@/hooks/useGestureRecognizer'
import { GestureDebug } from './GestureDebug'

export interface SimonSaysGameRef {
  startCamera: () => Promise<void>
  stopCamera: () => void
  restartCamera: () => Promise<void>
}

interface SimonSaysGameProps {
  isActive: boolean
  onToggle?: (active: boolean) => void
}

type GameGesture = 'Puño Cerrado' | 'Palma Abierta' | 'Victoria' | 'Pulgar Arriba' | 'Pulgar Abajo'
type GameState = 'waiting' | 'showing' | 'countdown' | 'playing' | 'success' | 'failure'

interface GameStats {
  currentLevel: number
  bestLevel: number
  totalGames: number
  successStreak: number
  bestStreak: number
}

const SimonSaysGame = forwardRef<SimonSaysGameRef, SimonSaysGameProps>(
  ({ isActive, onToggle }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showDebug, setShowDebug] = useState(false)

    // Estados del juego
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [sequence, setSequence] = useState<GameGesture[]>([])
  const [userSequence, setUserSequence] = useState<GameGesture[]>([])
  const [currentShowingIndex, setCurrentShowingIndex] = useState(-1)
  const [showingGesture, setShowingGesture] = useState<GameGesture | null>(null)
  const [lastDetectedGesture, setLastDetectedGesture] = useState<GameGesture | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [gestureStable, setGestureStable] = useState(false)
  const [gestureConfirmationCount, setGestureConfirmationCount] = useState(0)
  const [canDetectGesture, setCanDetectGesture] = useState(true)
  const [stats, setStats] = useState<GameStats>({
    currentLevel: 1,
    bestLevel: 1,
    totalGames: 0,
    successStreak: 0,
    bestStreak: 0
  })

    // Hook de reconocimiento de gestos
    const {
      isInitialized,
      isRecognizing,
      currentGesture,
      error: gestureError,
      initializeGestureRecognizer,
      startRecognition,
      stopRecognition
    } = useGestureRecognizer()

    // Gestos disponibles para el juego
    const gameGestures: GameGesture[] = [
      'Puño Cerrado',
      'Palma Abierta', 
      'Victoria',
      'Pulgar Arriba',
      'Pulgar Abajo'
    ]

    // Emojis y colores para cada gesto
    const gestureInfo: Record<GameGesture, { emoji: string; color: string; name: string }> = {
      'Puño Cerrado': { emoji: '✊', color: 'bg-red-500', name: 'Puño' },
      'Palma Abierta': { emoji: '✋', color: 'bg-blue-500', name: 'Palma' },
      'Victoria': { emoji: '✌️', color: 'bg-green-500', name: 'Victoria' },
      'Pulgar Arriba': { emoji: '👍', color: 'bg-yellow-500', name: 'Arriba' },
      'Pulgar Abajo': { emoji: '👎', color: 'bg-purple-500', name: 'Abajo' }
    }

    // Inicializar MediaPipe cuando el componente se monta
    useEffect(() => {
      if (!isInitialized) {
        initializeGestureRecognizer()
      }
    }, [isInitialized, initializeGestureRecognizer])

    const startCamera = useCallback(async () => {
      if (!videoRef.current || !canvasRef.current) return

      setLoading(true)
      setError(null)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: 'user'
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsStreaming(true)

          // Función para iniciar reconocimiento cuando el video esté listo
          const handleVideoReady = () => {
            if (videoRef.current && canvasRef.current && isInitialized && isActive) {
              const video = videoRef.current
              const canvas = canvasRef.current
              
              if (video.videoWidth > 0 && video.videoHeight > 0) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                
                console.log('🧠 Video de Simon Says listo, iniciando reconocimiento:', video.videoWidth, 'x', video.videoHeight)
                startRecognition(video, canvas)
              } else {
                // Reintentar si las dimensiones no están listas
                setTimeout(handleVideoReady, 100)
              }
            }
          }

          // Esperar a que el video esté completamente cargado
          videoRef.current.onloadedmetadata = handleVideoReady
          videoRef.current.oncanplay = handleVideoReady
        }

      } catch (err) {
        console.error('Error accediendo a la cámara de Simon Says:', err)
        setError('No se pudo acceder a la cámara. Verifica los permisos.')
      } finally {
        setLoading(false)
      }
    }, [isActive, isInitialized, startRecognition])

    const stopCamera = useCallback(async () => {
      console.log('🔴 Deteniendo cámara de Simon Says...')
      
      try {
        // PASO 1: Detener el reconocimiento PRIMERO y esperar
        if (isRecognizing) {
          console.log('🛑 Deteniendo reconocimiento activo de Simon Says...')
          stopRecognition()
          
          // CRUCIAL: Esperar a que MediaPipe se detenga completamente
          await new Promise(resolve => setTimeout(resolve, 500))
          console.log('✅ Reconocimiento de Simon Says detenido, procediendo con limpieza de cámara')
        }
        
        // PASO 2: Luego limpiar el video y stream
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          const tracks = stream.getTracks()
          
          tracks.forEach(track => {
            console.log('🛑 Deteniendo track de Simon Says:', track.kind, track.label)
            track.stop()
          })
          
          // Limpiar el elemento video
          videoRef.current.srcObject = null
          videoRef.current.load()
          
          // Esperar un poco más para que el video se libere
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // PASO 3: Limpiar canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        }
        
        // PASO 4: Resetear estados del juego
  setGameState('waiting')
  setSequence([])
  setUserSequence([])
  setCurrentShowingIndex(-1)
  setShowingGesture(null)
  setLastDetectedGesture(null)
  setCountdown(0)
  setGestureStable(false)
  setGestureConfirmationCount(0)
  setCanDetectGesture(true)
        
        // PASO 5: Actualizar estados de cámara
        setIsStreaming(false)
        setError(null)
        setLoading(false)
        
        console.log('✅ Cámara de Simon Says detenida correctamente')
        
        // PASO 6: Limpieza final después de delay adicional
        setTimeout(() => {
          setIsStreaming(false)
          setLoading(false)
          setError(null)
          console.log('🧹 Limpieza final de Simon Says completada')
        }, 200)
        
      } catch (error) {
        console.error('❌ Error al detener cámara de Simon Says:', error)
        // Forzar reseteo incluso si hay error
        setIsStreaming(false)
        setLoading(false)
        setError(null)
        setGameState('waiting')
        setSequence([])
        setUserSequence([])
        
        // Intentar limpiar tracks de emergencia
        if (videoRef.current && videoRef.current.srcObject) {
          try {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
          } catch (cleanupError) {
            console.warn('⚠️ Error en limpieza de emergencia de Simon Says:', cleanupError)
          }
        }
      }
    }, [stopRecognition, isRecognizing])

    const restartCamera = useCallback(async () => {
      console.log('🔄 Reiniciando cámara de Simon Says...')
      stopCamera()
      await new Promise(resolve => setTimeout(resolve, 500))
      await startCamera()
    }, [stopCamera, startCamera])

    // Manejar activación/desactivación
    useEffect(() => {
      console.log('🔄 Cambio de estado de Simon Says - isActive:', isActive, 'isInitialized:', isInitialized, 'isStreaming:', isStreaming, 'isRecognizing:', isRecognizing)
      
      if (isActive && isInitialized) {
        if (!isStreaming) {
          console.log('▶️ Iniciando cámara de Simon Says porque está activo y no hay streaming')
          startCamera()
        } else if (videoRef.current && canvasRef.current && !isRecognizing) {
          console.log('▶️ Iniciando reconocimiento de Simon Says con video existente')
          startRecognition(videoRef.current, canvasRef.current)
        }
      } else if (!isActive) {
        console.log('⏹️ Deteniendo Simon Says porque está inactivo')
        if (isStreaming || isRecognizing) {
          stopCamera()
        }
      }
    }, [isActive, isInitialized, isStreaming, isRecognizing])

    // Limpiar al desmontar
    useEffect(() => {
      return () => {
        console.log('🗑️ Limpiando componente SimonSaysGame')
        stopCamera()
      }
    }, [stopCamera])

    // Generar nueva secuencia
    const generateSequence = useCallback((level: number): GameGesture[] => {
      const newSequence: GameGesture[] = []
      for (let i = 0; i < level + 2; i++) { // Nivel 1 = 3 gestos, Nivel 2 = 4 gestos, etc.
        const randomGesture = gameGestures[Math.floor(Math.random() * gameGestures.length)]
        newSequence.push(randomGesture)
      }
      return newSequence
    }, [gameGestures])

    // Iniciar nuevo juego
  const startGame = useCallback(() => {
    const newSequence = generateSequence(stats.currentLevel)
    setSequence(newSequence)
    setUserSequence([])
    setCurrentShowingIndex(-1)
    setShowingGesture(null)
    setLastDetectedGesture(null)
    setCountdown(0)
    setGestureStable(false)
    setGestureConfirmationCount(0)
    setCanDetectGesture(false)
    setGameState('showing')
    
    console.log('🧠 Nueva secuencia generada:', newSequence)
  }, [generateSequence, stats.currentLevel])

    // Mostrar secuencia al usuario
  useEffect(() => {
    if (gameState === 'showing' && sequence.length > 0) {
      let index = 0
      setCurrentShowingIndex(0)
      
      const showNext = () => {
        if (index < sequence.length) {
          setShowingGesture(sequence[index])
          setCurrentShowingIndex(index)
          
          setTimeout(() => {
            setShowingGesture(null)
            setTimeout(() => {
              index++
              if (index < sequence.length) {
                showNext()
              } else {
                // Terminó de mostrar la secuencia - iniciar cuenta regresiva
                setCurrentShowingIndex(-1)
                setGameState('countdown')
                
                // Cuenta regresiva de 3 segundos
                let countdownValue = 3
                setCountdown(countdownValue)
                
                const countdownInterval = setInterval(() => {
                  countdownValue--
                  setCountdown(countdownValue)
                  
                  if (countdownValue <= 0) {
                    clearInterval(countdownInterval)
                    setGameState('playing')
                    setCanDetectGesture(true)
                    setGestureStable(false)
                    setGestureConfirmationCount(0)
                  }
                }, 1000)
              }
            }, 500) // Pausa más larga entre gestos
          }, 1500) // Duración más larga de cada gesto
        }
      }
      
      // Esperar un poco antes de empezar
      setTimeout(showNext, 1000)
    }
  }, [gameState, sequence])

    // Sistema mejorado de detección de gestos con estabilidad
  useEffect(() => {
    if (gameState === 'playing' && currentGesture && gameGestures.includes(currentGesture.gesture as GameGesture) && canDetectGesture) {
      const detectedGesture = currentGesture.gesture as GameGesture
      const confidence = currentGesture.confidence
      
      // Requerir confianza mínima pero no tan alta
      if (confidence >= 75) {
        // Sistema simplificado: solo requiere que sea diferente al último gesto detectado
        if (detectedGesture !== lastDetectedGesture) {
          setLastDetectedGesture(detectedGesture)
          setGestureConfirmationCount(1)
          setGestureStable(false)
          
          // Breve delay para mostrar el gesto detectado
          setTimeout(() => {
            setGestureStable(true)
            
            // Procesar el gesto después de un delay más corto
            setTimeout(() => {
              // Gesto confirmado - procesar inmediatamente
              const newUserSequence = [...userSequence, detectedGesture]
              setUserSequence(newUserSequence)
              
              // Verificar si el gesto es correcto
              const currentIndex = newUserSequence.length - 1
              if (sequence[currentIndex] === detectedGesture) {
                // Gesto correcto
                if (newUserSequence.length === sequence.length) {
                  // ¡Secuencia completa y correcta!
                  setGameState('success')
                  setTimeout(() => {
                    // Avanzar al siguiente nivel
                    setStats(prev => ({
                      ...prev,
                      currentLevel: prev.currentLevel + 1,
                      bestLevel: Math.max(prev.bestLevel, prev.currentLevel + 1),
                      successStreak: prev.successStreak + 1,
                      bestStreak: Math.max(prev.bestStreak, prev.successStreak + 1)
                    }))
                    startGame() // Nuevo nivel automáticamente
                  }, 2500)
                } else {
                  // Cooldown más corto entre gestos correctos
                  setCanDetectGesture(false)
                  setTimeout(() => {
                    setCanDetectGesture(true)
                    setGestureStable(false)
                    setGestureConfirmationCount(0)
                    setLastDetectedGesture(null)
                  }, 800) // Reducido de 1500ms a 800ms
                }
              } else {
                // Gesto incorrecto - Game Over
                setGameState('failure')
                setStats(prev => ({
                  ...prev,
                  totalGames: prev.totalGames + 1,
                  successStreak: 0,
                  currentLevel: 1 // Reiniciar nivel
                }))
              }
            }, 300) // Reducido de 500ms a 300ms
          }, 200) // Reducido para mostrar feedback más rápido
        }
      }
    } else if (gameState !== 'playing') {
      // Limpiar estado cuando no está jugando
      setLastDetectedGesture(null)
      setGestureConfirmationCount(0)
      setGestureStable(false)
      setCanDetectGesture(false)
    }
  }, [gameState, currentGesture, userSequence, sequence, lastDetectedGesture, gameGestures, startGame, gestureConfirmationCount, gestureStable, canDetectGesture])

    // Reiniciar estadísticas
    const resetStats = useCallback(() => {
      setStats({
        currentLevel: 1,
        bestLevel: 1,
        totalGames: 0,
        successStreak: 0,
        bestStreak: 0
      })
      setGameState('waiting')
    }, [])

    // Reiniciar juego
  const resetGame = useCallback(() => {
    setStats(prev => ({ ...prev, currentLevel: 1 }))
    setGameState('waiting')
    setSequence([])
    setUserSequence([])
    setLastDetectedGesture(null)
    setCountdown(0)
    setGestureStable(false)
    setGestureConfirmationCount(0)
    setCanDetectGesture(true)
  }, [])

    // Inicializar la referencia
    useImperativeHandle(ref, () => ({
      startCamera,
      stopCamera,
      restartCamera
    }))

    const displayError = error || gestureError

    if (!isActive) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Simon Says
          </h3>
          <p className="text-white/70 mb-4 max-w-sm">
            Memoriza y repite secuencias de gestos cada vez más largas
          </p>
          <button
            onClick={() => onToggle?.(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Activar Juego
          </button>
        </motion.div>
      )
    }

    return (
      <motion.div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-white to-gray-100 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Área de video con cámara */}
        <div className="relative aspect-video bg-gray-900 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
            style={{ minHeight: '240px' }}
          />

          {/* Canvas para overlay de landmarks */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full scale-x-[-1] pointer-events-none"
            style={{ minHeight: '240px' }}
          />

          {/* Botones de control */}
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className={`p-2 backdrop-blur-sm rounded-full text-white transition-colors ${
                showDebug ? 'bg-blue-500/70 hover:bg-blue-500/90' : 'bg-black/50 hover:bg-black/70'
              }`}
              title="Toggle Debug Info"
            >
              <Bug className="w-4 h-4" />
            </button>
          </div>

          {/* Debug info */}
          <GestureDebug
            videoRef={videoRef}
            canvasRef={canvasRef}
            isInitialized={isInitialized}
            isRecognizing={isRecognizing}
            isStreaming={isStreaming}
            error={displayError}
            show={showDebug}
          />

          {/* UI del juego superpuesta sobre la cámara */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-black/40">
            {/* Header del juego */}
            <div className="flex items-center justify-between">
              <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold">Simon Says</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-green-500/20 rounded p-1">
                    <div className="font-bold text-green-400">{stats.currentLevel}</div>
                    <div className="text-[8px] text-white/60">Nivel</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded p-1">
                    <div className="font-bold text-yellow-400">{stats.bestLevel}</div>
                    <div className="text-[8px] text-white/60">Mejor</div>
                  </div>
                  <div className="bg-blue-500/20 rounded p-1">
                    <div className="font-bold text-blue-400">{stats.successStreak}</div>
                    <div className="text-[8px] text-white/60">Racha</div>
                  </div>
                  <div className="bg-purple-500/20 rounded p-1">
                    <div className="font-bold text-purple-400">{stats.bestStreak}</div>
                    <div className="text-[8px] text-white/60">Record</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToggle?.(false)}
                className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors"
                title="Cerrar juego"
              >
                ✕
              </button>
            </div>

            {/* Estado del juego en el centro */}
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {gameState === 'waiting' && (
                  <motion.div
                    key="waiting"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="text-4xl mb-4">🧠</div>
                    <p className="text-white/80 mb-4">¿Listo para entrenar tu memoria?</p>
                    <p className="text-white/60 text-sm mb-4">
                      Nivel {stats.currentLevel} • {stats.currentLevel + 2} gestos
                    </p>
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Play className="w-4 h-4" />
                      Iniciar Nivel
                    </button>
                  </motion.div>
                )}

                {gameState === 'showing' && (
                  <motion.div
                    key="showing"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="text-xl text-white/80 mb-4">
                      Memoriza la secuencia:
                    </div>
                    <div className="flex justify-center items-center gap-4 mb-4">
                      {sequence.map((gesture, index) => (
                        <motion.div
                          key={index}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            index === currentShowingIndex 
                              ? `${gestureInfo[gesture].color} scale-125` 
                              : 'bg-white/20'
                          }`}
                          animate={{
                            scale: index === currentShowingIndex ? 1.25 : 1,
                            backgroundColor: index === currentShowingIndex ? undefined : 'rgba(255,255,255,0.2)'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {index === currentShowingIndex ? gestureInfo[gesture].emoji : '?'}
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-sm text-white/60">
                      {showingGesture ? `${gestureInfo[showingGesture].name}` : 'Preparando...'}
                    </div>
                  </motion.div>
                )}

                {gameState === 'countdown' && (
                  <motion.div
                    key="countdown"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div
                      className="text-8xl font-bold text-white mb-4"
                      animate={{
                        scale: [1, 1.2, 1],
                        color: countdown <= 1 ? '#ef4444' : countdown === 2 ? '#f59e0b' : '#10b981'
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {countdown}
                    </motion.div>
                    <p className="text-white/80 text-lg font-semibold mb-2">
                      {countdown > 0 ? "¡Prepárate!" : "¡Comienza!"}
                    </p>
                    <p className="text-white/60 text-sm">
                      Mantén cada gesto hasta que se confirme
                    </p>
                  </motion.div>
                )}

                {gameState === 'playing' && (
                  <motion.div
                    key="playing"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="text-4xl mb-4 animate-pulse">🎯</div>
                    <p className="text-white font-bold text-lg mb-2">¡Tu turno!</p>
                    <p className="text-white/70 text-sm mb-4">
                      Repite la secuencia ({userSequence.length}/{sequence.length})
                    </p>
                    
                    {!canDetectGesture && (
                      <div className="mb-4 px-3 py-2 bg-yellow-500/20 rounded-lg">
                        <p className="text-yellow-400 text-sm font-medium">
                          Procesando...
                        </p>
                      </div>
                    )}
                    
                    {/* Indicador de estabilidad del gesto */}
                    {canDetectGesture && lastDetectedGesture && (
                      <div className="mb-4">
                        <motion.div
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-lg"
                          animate={{
                            scale: gestureStable ? [1, 1.1, 1] : 1,
                            backgroundColor: gestureStable ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.2)'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-2xl">{gestureInfo[lastDetectedGesture].emoji}</span>
                          <span className="text-white font-medium">{gestureInfo[lastDetectedGesture].name}</span>
                          {gestureStable && (
                            <span className="text-green-400 text-lg font-bold">✓</span>
                          )}
                        </motion.div>
                        <p className="text-white/60 text-xs mt-1">
                          {gestureStable ? "Gesto confirmado" : "Detectando gesto..."}
                        </p>
                      </div>
                    )}
                    
                    {/* Progreso de la secuencia */}
                    <div className="flex justify-center items-center gap-2 mb-4">
                      {sequence.map((gesture, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            index < userSequence.length
                              ? userSequence[index] === gesture 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                              : index === userSequence.length
                              ? 'bg-yellow-500 text-white animate-pulse'
                              : 'bg-white/20'
                          }`}
                        >
                          {index < userSequence.length ? gestureInfo[userSequence[index]].emoji : 
                           index === userSequence.length ? '?' : 
                           gestureInfo[gesture].emoji}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {gameState === 'success' && (
                  <motion.div
                    key="success"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-green-400 font-bold text-xl mb-2">¡Perfecto!</p>
                    <p className="text-white/80 text-sm mb-4">
                      Avanzando al nivel {stats.currentLevel + 1}...
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">
                        Racha: {stats.successStreak}
                      </span>
                    </div>
                  </motion.div>
                )}

                {gameState === 'failure' && (
                  <motion.div
                    key="failure"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6 w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="text-6xl mb-4">💥</div>
                    <p className="text-red-400 font-bold text-xl mb-2">¡Ups!</p>
                    <p className="text-white/80 text-sm mb-4">
                      Secuencia incorrecta. ¡Inténtalo de nuevo!
                    </p>
                    
                    {/* Mostrar la secuencia correcta */}
                    <div className="mb-4">
                      <p className="text-white/60 text-xs mb-2">Secuencia correcta era:</p>
                      <div className="flex justify-center gap-1">
                        {sequence.map((gesture, index) => (
                          <div
                            key={index}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              index < userSequence.length
                                ? userSequence[index] === gesture 
                                  ? 'bg-green-500/50' 
                                  : 'bg-red-500/50'
                                : 'bg-white/20'
                            }`}
                          >
                            {gestureInfo[gesture].emoji}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={resetGame}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Nuevo Juego
                      </button>
                      <button
                        onClick={resetStats}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Reset Stats
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Indicador de gesto actual */}
            {currentGesture && gameGestures.includes(currentGesture.gesture as GameGesture) && gameState === 'playing' && (
              <motion.div
                className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-center">
                  <div className="text-2xl">{gestureInfo[currentGesture.gesture as GameGesture].emoji}</div>
                  <div className="text-[10px] text-white/70">{gestureInfo[currentGesture.gesture as GameGesture].name}</div>
                </div>
              </motion.div>
            )}

            {/* Instrucciones cuando está esperando */}
            {isStreaming && isRecognizing && gameState === 'waiting' && (
              <motion.div
                className="bg-black/70 backdrop-blur-md rounded-lg p-3 text-white text-center text-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="font-medium mb-1">Gestos Disponibles:</p>
                <div className="grid grid-cols-5 gap-1">
                  {gameGestures.map(gesture => (
                    <div key={gesture} className="text-center">
                      <div className="text-lg">{gestureInfo[gesture].emoji}</div>
                      <div className="text-[8px] text-white/60">{gestureInfo[gesture].name}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Estado de carga */}
          {loading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center text-white max-w-sm text-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm mb-2">Iniciando Simon Says...</p>
                <p className="text-xs text-gray-300">
                  Cargando reconocimiento de gestos para el juego de memoria
                </p>
              </div>
            </motion.div>
          )}

          {/* Mensaje de error */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-4 bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center text-white">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                  <p className="text-red-400 text-sm mb-3">{displayError}</p>
                  <button
                    onClick={restartCamera}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de estado en vivo */}
          {isStreaming && isRecognizing && (
            <motion.div
              className="absolute top-4 right-20 flex items-center space-x-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">MEMORIA</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }
)

SimonSaysGame.displayName = 'SimonSaysGame'

export default SimonSaysGame