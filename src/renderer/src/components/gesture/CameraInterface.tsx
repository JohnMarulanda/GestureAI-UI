import { AnimatePresence, motion } from 'framer-motion'
import { Camera, CameraOff, Hand, Loader2 } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

interface CameraInterfaceProps {
  flipped?: boolean
  brightness?: number
  contrast?: number
  resolution?: string
  onCameraRestart?: () => void
}

export interface CameraInterfaceRef {
  restartCamera: () => void
  getCurrentStream: () => MediaStream | null
}

const CameraInterface = forwardRef<CameraInterfaceRef, CameraInterfaceProps>(
  (
    { flipped = false, brightness = 50, contrast = 50, resolution = '720p', onCameraRestart },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [gestureDetected, setGestureDetected] = useState(false)

    // Simular detección de gestos (en una aplicación real, esto vendría de un modelo ML)
    useEffect(() => {
      if (isStreaming) {
        const interval = setInterval(() => {
          setGestureDetected(Math.random() > 0.7)
        }, 2000)
        return () => clearInterval(interval)
      }
    }, [isStreaming])

    const getVideoConstraints = () => {
      const constraints: MediaTrackConstraints = {
        facingMode: 'user'
      }

      // Configurar resolución basada en la selección
      switch (resolution) {
        case '480p':
          constraints.width = 640
          constraints.height = 480
          break
        case '720p':
          constraints.width = 1280
          constraints.height = 720
          break
        case '1080p':
          constraints.width = 1920
          constraints.height = 1080
          break
      }

      return constraints
    }

    const startCamera = async () => {
      setLoading(true)
      setError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: getVideoConstraints()
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsStreaming(true)
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.')
      } finally {
        setLoading(false)
      }
    }

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
        setIsStreaming(false)
        setGestureDetected(false)
      }
    }

    const restartCamera = async () => {
      stopCamera()
      await new Promise((resolve) => setTimeout(resolve, 500)) // Pequeña pausa
      await startCamera()
      onCameraRestart?.()
    }

    // Exponer métodos a través de ref
    useImperativeHandle(ref, () => ({
      restartCamera,
      getCurrentStream: () => (videoRef.current?.srcObject as MediaStream) || null
    }))

    // Aplicar filtros CSS cuando cambien brightness/contrast
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`
      }
    }, [brightness, contrast])
    return (
      <motion.div
        className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Borde con efecto de brillo */}
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 animate-pulse-glow">
          <div className="absolute inset-0 rounded-2xl bg-background-secondary/80 backdrop-blur-sm" />
        </div>

        {/* Contenido principal */}
        <div className="relative p-4 rounded-2xl overflow-hidden">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
              />
              <span className="text-sm font-medium text-white">
                {isStreaming ? 'En vivo' : 'Desconectado'}
              </span>
            </motion.div>

            <motion.button
              className="p-2 rounded-full bg-background-accent/20 hover:bg-background-accent/30 text-white transition-colors"
              onClick={isStreaming ? stopCamera : startCamera}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              disabled={loading}
              aria-label={isStreaming ? 'Detener cámara' : 'Iniciar cámara'}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isStreaming ? (
                <CameraOff className="w-5 h-5" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Área de video */}
          <div className="relative aspect-video bg-black/30 rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-transform duration-300 ${
                flipped ? 'scale-x-[-1]' : ''
              }`}
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                transform: flipped ? 'scaleX(-1)' : 'none'
              }}
            />

            {/* Mensaje de error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center p-4 bg-black/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-red-400 text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensaje cuando no hay streaming */}
            <AnimatePresence>
              {!isStreaming && !error && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Camera className="w-10 h-10 text-white/70 mb-2" />
                  <p className="text-white/90 text-center">
                    Haz clic en el botón de cámara para comenzar
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicador de detección de gestos */}
            <AnimatePresence>
              {isStreaming && gestureDetected && (
                <motion.div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-center p-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Hand className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-green-300 text-sm">¡Gesto detectado!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mensaje de ayuda */}
          <AnimatePresence>
            {isStreaming && (
              <motion.div
                className="mt-4 p-3 rounded-lg bg-background-accent/10 border border-background-accent/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-white/80">
                  Realiza gestos con la mano frente a la cámara para controlar la interfaz.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }
)

CameraInterface.displayName = 'CameraInterface'

export default CameraInterface
