'use client';

import * as Tooltip from '@radix-ui/react-tooltip'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Circle,
  Eye,
  Hand,
  Heart,
  Minus,
  MoreHorizontal,
  Smile,
  Sparkles,
  Star,
  ThumbsUp,
  X,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ControlPanel() {
  const [currentSet, setCurrentSet] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [gestureStates, setGestureStates] = useState({
    gesture1: false,
    gesture2: true,
    gesture3: false,
    gesture4: true,
    gesture5: false,
    gesture6: false,
    gesture7: true,
    gesture8: false
  })

  // Establecer el atributo data-route en el body cuando el componente se monte
  useEffect(() => {
    document.body.setAttribute('data-route', 'control-panel')
    return () => {
      document.body.removeAttribute('data-route')
    }
  }, [])

  const gestureSets = [
    [
      { id: 'gesture1', label: 'Mano Abierta', icon: Hand },
      { id: 'gesture2', label: 'Estrella', icon: Sparkles },
      { id: 'gesture3', label: 'Rayo', icon: Zap },
      { id: 'gesture4', label: 'Favorito', icon: Star }
    ],
    [
      { id: 'gesture5', label: 'Corazón', icon: Heart },
      { id: 'gesture6', label: 'Ojo', icon: Eye },
      { id: 'gesture7', label: 'Sonrisa', icon: Smile },
      { id: 'gesture8', label: 'Pulgar', icon: ThumbsUp }
    ]
  ]

  const toggleGestureSet = () => {
    setCurrentSet((prev) => (prev === 0 ? 1 : 0))
  }

  const toggleGesture = (gestureId: string) => {
    setGestureStates((prev) => ({
      ...prev,
      [gestureId]: !prev[gestureId]
    }))
  }

  const handleMinimize = () => {
    console.log('Minimizando panel')
    setIsMinimized(true)
  }

  const handleMaximize = () => {
    console.log('Maximizando panel')
    setIsMinimized(false)
  }

  const handleClose = () => {
    window.electron?.ipcRenderer.send('close-window')
  }

  // Función para alternar entre minimizado y maximizado
  const toggleMinimized = () => {
    console.log('Alternando estado minimizado:', !isMinimized)
    setIsMinimized(!isMinimized)
  }

  // Función para manejar el arrastre del botón circular cuando está minimizado
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
      <Tooltip.Provider delayDuration={0}>
        {isMinimized ? (
          // Panel minimizado - muestra un círculo flotante y movible con efecto de pulso
          <div className="relative">
            {/* Efecto de pulso detrás del botón */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-cyan-500/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop'
              }}
            />
            <motion.button
              className="bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-sm rounded-lg p-2 shadow-lg cursor-pointer flex items-center justify-center h-10 w-10 border border-white/20 relative z-10"
              initial={{ x: 0 }}
              animate={{
                x: dragPosition.x,
                y: dragPosition.y,
                scale: 1,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              drag
              dragConstraints={false}
              dragElastic={0.05}
              dragTransition={{ bounceStiffness: 500, bounceDamping: 25 }}
              onDragEnd={(e, info) => {
                setDragPosition({
                  x: dragPosition.x + info.offset.x,
                  y: dragPosition.y + info.offset.y
                })
              }}
              onClick={toggleMinimized}
              style={{ WebkitAppRegion: 'no-drag', WebkitUserSelect: 'none' }}
              aria-label="Expandir panel de control"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        ) : (
          // Panel expandido - muestra todos los controles
          <motion.div
            className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-3 shadow-2xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ WebkitAppRegion: 'drag', WebkitUserSelect: 'none' }}
          >
            {/* Window Controls */}
            <div className="flex justify-between items-center mb-4 px-1">
              <button
                onClick={toggleMinimized}
                className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center"
                style={{ WebkitAppRegion: 'no-drag' }}
                aria-label="Minimizar panel de control"
              >
                <Minus className="w-2 h-2 text-yellow-900" />
              </button>
              <button
                onClick={handleClose}
                className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center"
                style={{ WebkitAppRegion: 'no-drag' }}
                aria-label="Cerrar panel de control"
              >
                <X className="w-2 h-2 text-red-900" />
              </button>
            </div>

            {/* Gesture Buttons */}
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSet}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  {gestureSets[currentSet].map((gesture, index) => (
                    <Tooltip.Root key={gesture.id}>
                      <Tooltip.Trigger asChild>
                        <motion.button
                          onClick={() => toggleGesture(gesture.id)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                            gestureStates[gesture.id]
                              ? 'bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ WebkitAppRegion: 'no-drag' }}
                          aria-label={`Gesto ${gesture.label} ${gestureStates[gesture.id] ? 'activado' : 'desactivado'}`}
                        >
                          <gesture.icon
                            className={`w-6 h-6 ${
                              gestureStates[gesture.id] ? 'text-white' : 'text-gray-300'
                            }`}
                          />
                          {gestureStates[gesture.id] && (
                            <motion.div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="left"
                          sideOffset={10}
                          className="bg-gray-800 shadow-lg border border-gray-600/50 px-3 py-2 text-sm rounded-lg text-white font-medium z-50 max-w-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span>{gesture.label}</span>
                            <Circle
                              className={`w-2 h-2 ${
                                gestureStates[gesture.id]
                                  ? 'text-green-400 fill-current'
                                  : 'text-gray-400'
                              }`}
                            />
                          </div>
                          <Tooltip.Arrow className="fill-gray-800" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Toggle Button */}
              <div className="border-t border-gray-700/50 pt-3">
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <motion.button
                      onClick={toggleGestureSet}
                      className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-all duration-200 shadow-lg shadow-purple-600/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ WebkitAppRegion: 'no-drag' }}
                      aria-label="Cambiar conjunto de gestos"
                    >
                      <motion.div
                        animate={{ rotate: currentSet === 0 ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MoreHorizontal className="w-6 h-6 text-white" />
                      </motion.div>
                    </motion.button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="left"
                      sideOffset={10}
                      className="bg-gray-800 shadow-lg border border-gray-600/50 px-3 py-2 text-sm rounded-lg text-white font-medium z-50"
                    >
                      Cambiar Gestos ({currentSet === 0 ? '1-4' : '5-8'})
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            </div>
          </motion.div>
        )}
      </Tooltip.Provider>
    </div>
  )
}
