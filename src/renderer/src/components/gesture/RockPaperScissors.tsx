import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { Trophy, RotateCcw, Play, User, Bot, Bug, Loader2, AlertCircle } from 'lucide-react'
import { useGestureRecognizer, GestureResult } from '@/hooks/useGestureRecognizer'
import { GestureDebug } from './GestureDebug'

export interface RockPaperScissorsRef {
  startCamera: () => Promise<void>
  stopCamera: () => void
  restartCamera: () => Promise<void>
}

interface RockPaperScissorsProps {
  isActive: boolean
  onToggle?: (active: boolean) => void
}

type GameChoice = 'Piedra' | 'Papel' | 'Tijeras'
type GameResult = 'win' | 'lose' | 'tie'
type GameState = 'waiting' | 'countdown' | 'playing' | 'result'

interface GameStats {
  playerWins: number
  computerWins: number
  ties: number
  totalGames: number
}

const RockPaperScissors = forwardRef<RockPaperScissorsRef, RockPaperScissorsProps>(
  ({ isActive, onToggle }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showDebug, setShowDebug] = useState(false)

    // Estados del juego
    const [gameState, setGameState] = useState<GameState>('waiting')
    const [playerChoice, setPlayerChoice] = useState<GameChoice | null>(null)
    const [computerChoice, setComputerChoice] = useState<GameChoice | null>(null)
    const [result, setResult] = useState<GameResult | null>(null)
    const [countdown, setCountdown] = useState<number>(0)
    const [stats, setStats] = useState<GameStats>({
      playerWins: 0,
      computerWins: 0,
      ties: 0,
      totalGames: 0
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

    // Mapeo de gestos a opciones del juego
    const gestureToChoice: Record<string, GameChoice> = {
      'Puño Cerrado': 'Piedra',
      'Palma Abierta': 'Papel',
      'Victoria': 'Tijeras'
    }

    // Opciones disponibles para la computadora
    const choices: GameChoice[] = ['Piedra', 'Papel', 'Tijeras']

    // Emojis para cada opción
    const choiceEmojis: Record<GameChoice, string> = {
      'Piedra': '✊',
      'Papel': '✋',
      'Tijeras': '✌️'
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
                
                console.log('🎮 Video del juego listo, iniciando reconocimiento:', video.videoWidth, 'x', video.videoHeight)
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
        console.error('Error accediendo a la cámara del juego:', err)
        setError('No se pudo acceder a la cámara. Verifica los permisos.')
      } finally {
        setLoading(false)
      }
    }, [isActive, isInitialized, startRecognition])

    const stopCamera = useCallback(async () => {
      console.log('🔴 Deteniendo cámara del juego...')
      
      try {
        // PASO 1: Detener el reconocimiento PRIMERO y esperar
        if (isRecognizing) {
          console.log('🛑 Deteniendo reconocimiento activo...')
          stopRecognition()
          
          // CRUCIAL: Esperar a que MediaPipe se detenga completamente
          await new Promise(resolve => setTimeout(resolve, 500))
          console.log('✅ Reconocimiento detenido, procediendo con limpieza de cámara')
        }
        
        // PASO 2: Luego limpiar el video y stream
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          const tracks = stream.getTracks()
          
          tracks.forEach(track => {
            console.log('🛑 Deteniendo track del juego:', track.kind, track.label)
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
        setPlayerChoice(null)
        setComputerChoice(null)
        setResult(null)
        setCountdown(0)
        
        // PASO 5: Actualizar estados de cámara
        setIsStreaming(false)
        setError(null)
        setLoading(false)
        
        console.log('✅ Cámara del juego detenida correctamente')
        
        // PASO 6: Limpieza final después de delay adicional
        setTimeout(() => {
          setIsStreaming(false)
          setLoading(false)
          setError(null)
          console.log('🧹 Limpieza final del juego completada')
        }, 200)
        
      } catch (error) {
        console.error('❌ Error al detener cámara del juego:', error)
        // Forzar reseteo incluso si hay error
        setIsStreaming(false)
        setLoading(false)
        setError(null)
        setGameState('waiting')
        
        // Intentar limpiar tracks de emergencia
        if (videoRef.current && videoRef.current.srcObject) {
          try {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
          } catch (cleanupError) {
            console.warn('⚠️ Error en limpieza de emergencia:', cleanupError)
          }
        }
      }
    }, [stopRecognition, isRecognizing])

    const restartCamera = useCallback(async () => {
      console.log('🔄 Reiniciando cámara del juego...')
      stopCamera()
      await new Promise(resolve => setTimeout(resolve, 500))
      await startCamera()
    }, [stopCamera, startCamera])

    // Manejar activación/desactivación
    useEffect(() => {
      console.log('🔄 Cambio de estado del juego - isActive:', isActive, 'isInitialized:', isInitialized, 'isStreaming:', isStreaming, 'isRecognizing:', isRecognizing)
      
      if (isActive && isInitialized) {
        if (!isStreaming) {
          console.log('▶️ Iniciando cámara del juego porque está activo y no hay streaming')
          startCamera()
        } else if (videoRef.current && canvasRef.current && !isRecognizing) {
          console.log('▶️ Iniciando reconocimiento del juego con video existente')
          startRecognition(videoRef.current, canvasRef.current)
        }
      } else if (!isActive) {
        console.log('⏹️ Deteniendo juego porque está inactivo')
        if (isStreaming || isRecognizing) {
          stopCamera()
        }
      }
    }, [isActive, isInitialized, isStreaming, isRecognizing])

    // Limpiar al desmontar
    useEffect(() => {
      return () => {
        console.log('🗑️ Limpiando componente RockPaperScissors')
        stopCamera()
      }
    }, [stopCamera])

    // Determinar ganador
    const determineWinner = useCallback((player: GameChoice, computer: GameChoice): GameResult => {
      if (player === computer) return 'tie'
      
      const winConditions: Record<GameChoice, GameChoice> = {
        'Piedra': 'Tijeras',
        'Papel': 'Piedra', 
        'Tijeras': 'Papel'
      }
      
      return winConditions[player] === computer ? 'win' : 'lose'
    }, [])

    // Generar elección aleatoria para la computadora
    const generateComputerChoice = useCallback((): GameChoice => {
      return choices[Math.floor(Math.random() * choices.length)]
    }, [choices])

    // Iniciar nueva partida
    const startGame = useCallback(() => {
      setGameState('countdown')
      setPlayerChoice(null)
      setComputerChoice(null)
      setResult(null)
      setCountdown(3)
    }, [])

    // Procesar el juego
    const processGame = useCallback((choice: GameChoice) => {
      const computer = generateComputerChoice()
      const gameResult = determineWinner(choice, computer)
      
      setPlayerChoice(choice)
      setComputerChoice(computer)
      setResult(gameResult)
      setGameState('result')
      
      // Actualizar estadísticas
      setStats(prev => ({
        ...prev,
        playerWins: prev.playerWins + (gameResult === 'win' ? 1 : 0),
        computerWins: prev.computerWins + (gameResult === 'lose' ? 1 : 0),
        ties: prev.ties + (gameResult === 'tie' ? 1 : 0),
        totalGames: prev.totalGames + 1
      }))
    }, [generateComputerChoice, determineWinner])

    // Manejar countdown
    useEffect(() => {
      if (gameState === 'countdown' && countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else if (gameState === 'countdown' && countdown === 0) {
        setGameState('playing')
        // Dar 3 segundos para hacer el gesto
        const playTimer = setTimeout(() => {
          setGameState(currentState => {
            if (currentState === 'playing') {
              // Si no se detectó gesto, usar uno aleatorio
              const randomChoice = choices[Math.floor(Math.random() * choices.length)]
              processGame(randomChoice)
              return 'result'
            }
            return currentState
          })
        }, 3000)
        return () => clearTimeout(playTimer)
      }
      // Retornar undefined explícitamente para otras condiciones
      return undefined
    }, [gameState, countdown, choices, processGame])

    // Detectar gesto durante el juego
    useEffect(() => {
      if (gameState === 'playing' && currentGesture && gestureToChoice[currentGesture.gesture]) {
        const choice = gestureToChoice[currentGesture.gesture]
        console.log('🎮 Gesto detectado en juego:', currentGesture.gesture, '->', choice)
        processGame(choice)
      }
    }, [gameState, currentGesture, gestureToChoice, processGame])

    // Reiniciar estadísticas
    const resetStats = useCallback(() => {
      setStats({
        playerWins: 0,
        computerWins: 0,
        ties: 0,
        totalGames: 0
      })
    }, [])

    // Calcular porcentaje de victorias
    const winPercentage = stats.totalGames > 0 
      ? Math.round((stats.playerWins / stats.totalGames) * 100) 
      : 0

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
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Piedra, Papel o Tijeras
          </h3>
          <p className="text-white/70 mb-4 max-w-sm">
            Juega contra la IA usando gestos de tu mano
          </p>
          <button
            onClick={() => onToggle?.(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
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
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-bold">Piedra, Papel, Tijeras</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-green-500/20 rounded p-1">
                    <div className="font-bold text-green-400">{stats.playerWins}</div>
                    <div className="text-[8px] text-white/60">Ganadas</div>
                  </div>
                  <div className="bg-red-500/20 rounded p-1">
                    <div className="font-bold text-red-400">{stats.computerWins}</div>
                    <div className="text-[8px] text-white/60">Perdidas</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded p-1">
                    <div className="font-bold text-yellow-400">{stats.ties}</div>
                    <div className="text-[8px] text-white/60">Empates</div>
                  </div>
                  <div className="bg-blue-500/20 rounded p-1">
                    <div className="font-bold text-blue-400">{winPercentage}%</div>
                    <div className="text-[8px] text-white/60">Victoria</div>
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
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-white/80 mb-4">¿Listo para jugar?</p>
                    <button
                      onClick={startGame}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Play className="w-4 h-4" />
                      Nueva Partida
                    </button>
                  </motion.div>
                )}

                {gameState === 'countdown' && (
                  <motion.div
                    key="countdown"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className="text-6xl font-bold text-white mb-2">
                      {countdown}
                    </div>
                    <p className="text-white/80">Prepárate...</p>
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
                    <p className="text-white font-bold text-lg mb-2">¡AHORA!</p>
                    <p className="text-white/70 text-sm mb-4">
                      Haz tu gesto: ✊ ✋ ✌️
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        className="bg-purple-500 h-2 rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 3, ease: 'linear' }}
                      />
                    </div>
                  </motion.div>
                )}

                {gameState === 'result' && (
                  <motion.div
                    key="result"
                    className="text-center bg-black/70 backdrop-blur-md rounded-xl p-6 w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Resultado */}
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <User className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-400">Tú</span>
                        </div>
                        <div className="text-4xl">{playerChoice ? choiceEmojis[playerChoice] : '❓'}</div>
                        <div className="text-[10px] text-white/60 mt-1">{playerChoice || 'Sin gesto'}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg mb-1">VS</div>
                        <div className={`text-sm font-bold ${
                          result === 'win' ? 'text-green-400' : 
                          result === 'lose' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {result === 'win' ? '¡GANASTE!' : 
                           result === 'lose' ? '¡PERDISTE!' : '¡EMPATE!'}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Bot className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-400">IA</span>
                        </div>
                        <div className="text-4xl">{computerChoice ? choiceEmojis[computerChoice] : '❓'}</div>
                        <div className="text-[10px] text-white/60 mt-1">{computerChoice}</div>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={startGame}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Otra Vez
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
            {currentGesture && gestureToChoice[currentGesture.gesture] && (
              <motion.div
                className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-center">
                  <div className="text-2xl">{choiceEmojis[gestureToChoice[currentGesture.gesture]]}</div>
                  <div className="text-[10px] text-white/70">{currentGesture.gesture}</div>
                </div>
              </motion.div>
            )}

            {/* Instrucciones cuando está reconociendo */}
            {isStreaming && isRecognizing && gameState === 'waiting' && (
              <motion.div
                className="bg-black/70 backdrop-blur-md rounded-lg p-3 text-white text-center text-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="font-medium mb-1">Gestos de Juego:</p>
                <div className="grid grid-cols-3 gap-2">
                  <span>✊ Piedra</span>
                  <span>✋ Papel</span>
                  <span>✌️ Tijeras</span>
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
                <p className="text-sm mb-2">Iniciando juego...</p>
                <p className="text-xs text-gray-300">
                  Cargando reconocimiento de gestos para el juego
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
              <span className="text-white text-xs font-medium">JUGANDO</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }
)

export default RockPaperScissors 