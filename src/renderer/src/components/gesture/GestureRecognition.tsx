import { motion, AnimatePresence } from 'framer-motion'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react'
import { Camera, CameraOff, Hand, Loader2, Eye, AlertCircle, Bug } from 'lucide-react'
import { useGestureRecognizer, GestureResult } from '@/hooks/useGestureRecognizer'
import { GestureDebug } from './GestureDebug'

export interface GestureRecognitionRef {
  startCamera: () => Promise<void>
  stopCamera: () => void
  restartCamera: () => Promise<void>
}

interface GestureRecognitionProps {
  isActive: boolean
  onGestureUpdate?: (gesture: string | null) => void
}

// Componente para mostrar el gesto detectado
interface GestureDisplayProps {
  gesture: GestureResult | null
  isRecognizing: boolean
}

const GestureDisplay: React.FC<GestureDisplayProps> = ({ gesture, isRecognizing }) => {
  return (
    <AnimatePresence>
      {isRecognizing && (
        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 text-white min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Reconociendo Gestos</span>
            </div>
            
            {gesture ? (
              <motion.div
                key={gesture.gesture}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <div className="text-lg font-bold text-blue-300">
                  {gesture.gesture}
                </div>
                <div className="text-xs text-gray-300">
                  Confianza: {gesture.confidence}%
                </div>
                <div className="text-xs text-gray-400">
                  Mano: {gesture.handedness}
                </div>
              </motion.div>
            ) : (
              <div className="text-sm text-gray-400">
                Muestra un gesto con tu mano...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const GestureRecognition = forwardRef<GestureRecognitionRef, GestureRecognitionProps>(
  ({ isActive, onGestureUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showDebug, setShowDebug] = useState(false)

    const {
      isInitialized,
      isRecognizing,
      currentGesture,
      error: gestureError,
      initializeGestureRecognizer,
      startRecognition,
      stopRecognition
    } = useGestureRecognizer()

    // Inicializar MediaPipe cuando el componente se monta
    useEffect(() => {
      if (!isInitialized) {
        initializeGestureRecognizer()
      }
    }, [isInitialized, initializeGestureRecognizer])

    // Enviar gesto actual al padre cuando cambie
    useEffect(() => {
      if (onGestureUpdate) {
        onGestureUpdate(currentGesture?.gesture || null)
      }
    }, [currentGesture, onGestureUpdate])

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
                
                console.log('🎥 Video listo, iniciando reconocimiento:', video.videoWidth, 'x', video.videoHeight)
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
        console.error('Error accediendo a la cámara:', err)
        setError('No se pudo acceder a la cámara. Verifica los permisos.')
      } finally {
        setLoading(false)
      }
    }, [isActive, isInitialized, startRecognition])

    const stopCamera = useCallback(async () => {
      console.log('🔴 Deteniendo cámara y reconocimiento...')
      
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
            console.log('🛑 Deteniendo track:', track.kind, track.label)
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
        
        // PASO 4: Actualizar estados
        setIsStreaming(false)
        setError(null)
        setLoading(false)
        
        console.log('✅ Cámara detenida correctamente')
        
        // PASO 5: Limpieza final después de delay adicional
        setTimeout(() => {
          setIsStreaming(false)
          setLoading(false)
          setError(null)
          console.log('🧹 Limpieza final de reconocimiento completada')
        }, 200)
        
      } catch (error) {
        console.error('❌ Error al detener cámara:', error)
        // Forzar reseteo incluso si hay error
        setIsStreaming(false)
        setLoading(false)
        setError(null)
        
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
      console.log('🔄 Reiniciando cámara...')
      stopCamera()
      await new Promise(resolve => setTimeout(resolve, 500))
      await startCamera()
    }, [stopCamera, startCamera])

    // Manejar activación/desactivación
    useEffect(() => {
      console.log('🔄 Cambio de estado - isActive:', isActive, 'isInitialized:', isInitialized, 'isStreaming:', isStreaming, 'isRecognizing:', isRecognizing)
      
      if (isActive && isInitialized) {
        if (!isStreaming) {
          console.log('▶️ Iniciando cámara porque está activo y no hay streaming')
          startCamera()
        } else if (videoRef.current && canvasRef.current && !isRecognizing) {
          console.log('▶️ Iniciando reconocimiento con video existente')
          startRecognition(videoRef.current, canvasRef.current)
        }
      } else if (!isActive) {
        console.log('⏹️ Deteniendo porque está inactivo')
        if (isStreaming || isRecognizing) {
          stopCamera()
        }
      }
    }, [isActive, isInitialized, isStreaming, isRecognizing])

    // Limpiar al desmontar
    useEffect(() => {
      return () => {
        console.log('🗑️ Limpiando componente GestureRecognition')
        stopCamera()
      }
    }, [stopCamera])

    useImperativeHandle(ref, () => ({
      startCamera,
      stopCamera,
      restartCamera
    }))

    const displayError = error || gestureError

    return (
      <motion.div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-white to-gray-100 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Área de video */}
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

          {/* Display de gesto detectado */}
          <GestureDisplay gesture={currentGesture} isRecognizing={isRecognizing} />

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
                <p className="text-sm mb-2">Iniciando reconocimiento...</p>
                <p className="text-xs text-gray-300">
                  Cargando optimizaciones de TensorFlow para CPU
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

          {/* Mensaje cuando no está activo */}
          <AnimatePresence>
            {!isActive && !loading && !displayError && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hand className="w-12 sm:w-16 h-12 sm:h-16 text-white/70 mb-4" />
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-2 text-center">
                  Reconocimiento de Gestos Desactivado
                </h3>
                <p className="text-white/90 text-center font-medium text-sm sm:text-base mb-2">
                  Activa el reconocimiento para encender la cámara
                </p>
                <p className="text-white/70 text-center text-xs">
                  La cámara se activará automáticamente al hacer clic en "Activar"
                </p>
                <div className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white text-sm">✋ Gestos disponibles: 8</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de estado en vivo */}
          {isStreaming && isRecognizing && (
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">RECONOCIENDO</span>
            </motion.div>
          )}
        </div>

        {/* Panel de información de gestos disponibles */}
        {isActive && !currentGesture && isRecognizing && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 mx-auto max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 text-white text-center">
              <p className="text-xs font-medium mb-2">Gestos Disponibles:</p>
              <div className="text-[10px] text-gray-300 grid grid-cols-2 gap-1">
                <span>✋ Palma Abierta</span>
                <span>✊ Puño Cerrado</span>
                <span>👍 Pulgar Arriba</span>
                <span>👎 Pulgar Abajo</span>
                <span>☝️ Apuntando</span>
                <span>✌️ Victoria</span>
                <span>🤟 Te Amo</span>
                <span>🫳 Ninguno</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }
)

GestureRecognition.displayName = 'GestureRecognition' 