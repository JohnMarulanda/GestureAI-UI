import { motion } from 'framer-motion'
import { Info, AlertTriangle } from 'lucide-react'

interface GestureDebugProps {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  isInitialized: boolean
  isRecognizing: boolean
  isStreaming: boolean
  error: string | null
  show?: boolean
}

export const GestureDebug: React.FC<GestureDebugProps> = ({
  videoRef,
  canvasRef,
  isInitialized,
  isRecognizing,
  isStreaming,
  error,
  show = false
}) => {
  if (!show) return null

  const video = videoRef.current
  const canvas = canvasRef.current

  const debugInfo = {
    'MediaPipe Inicializado': isInitialized ? '✅' : '❌',
    'Reconocimiento Activo': isRecognizing ? '✅' : '❌',
    'Streaming Activo': isStreaming ? '✅' : '❌',
    'Video Dimensions': video ? `${video.videoWidth}x${video.videoHeight}` : 'N/A',
    'Canvas Dimensions': canvas ? `${canvas.width}x${canvas.height}` : 'N/A',
    'Video Ready': video?.readyState === 4 ? '✅' : '❌',
    'Error': error || 'Ninguno'
  }

  return (
    <motion.div
      className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md rounded-lg p-3 text-white text-xs font-mono max-w-xs"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-blue-400" />
        <span className="text-blue-400 font-semibold">Debug Info</span>
      </div>
      
      <div className="space-y-1 mb-3">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300">{key}:</span>
            <span className={error && key === 'Error' ? 'text-red-400' : 'text-white'}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Información sobre mensajes en consola */}
      <div className="border-t border-gray-600 pt-2">
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-semibold">Mensajes Normales</span>
        </div>
        <div className="text-[10px] text-gray-400 space-y-1">
          <div>• "TensorFlow Lite XNNPACK" = ✅ Optimización activa</div>
          <div>• "message channel closed" = ⚠️ Extensión navegador</div>
          <div>• "Created delegate for CPU" = ✅ Funcionamiento normal</div>
        </div>
      </div>
    </motion.div>
  )
} 