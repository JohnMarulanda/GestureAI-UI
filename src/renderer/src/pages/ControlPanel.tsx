'use client';

import * as Tooltip from '@radix-ui/react-tooltip'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Circle,
  Mouse,
  Volume2,
  Command,
  Minus,
  MoreHorizontal,
  Compass,
  AppWindow,
  Monitor,
  House ,
  X,
  SquarePlay
} from 'lucide-react'
import { useEffect, useState } from 'react'
import '../types/window.d.ts'

export default function ControlPanel() {
  const [currentSet, setCurrentSet] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  
  // Definir los posibles estados de un gesto
  type GestureStatus = 'inactive' | 'loading' | 'active'
  
  // Estado para rastrear el estado de carga de cada gesto
  const [gestureStatus, setGestureStatus] = useState<Record<string, GestureStatus>>({
    gesture1: 'inactive',
    gesture2: 'inactive',
    gesture3: 'inactive',
    gesture4: 'inactive',
    gesture5: 'inactive',
    gesture6: 'inactive',
    gesture7: 'inactive',
    gesture8: 'inactive'
  })

  // Estado para rastrear procesos ejecutables activos
  const [activeProcesses, setActiveProcesses] = useState<Set<string>>(new Set())

  // Mapeo de gestos a procesos - actualizado para todos los ejecutables GestOS
  const gestureToProcess = {
    'gesture1': 'gestos-volumen',
    'gesture2': 'gestos-aplicaciones',
    'gesture3': 'gestos-multimedia',
    'gesture4': 'gestos-sistema',
    'gesture5': 'gestos-atajos',
    'gesture6': 'gestos-mouse',
    'gesture7': 'gestos-navegacion'
    // gesture8 (Inicio) no tiene proceso, solo abre la ventana principal
  }

  // Mapeo de procesos a funciones de ejecución
  const processExecutors = {
    'gestos-volumen': () => window.api?.executeGestosVolumen(),
    'gestos-aplicaciones': () => window.api?.executeGestosAplicaciones(),
    'gestos-multimedia': () => window.api?.executeGestosMultimedia(),
    'gestos-sistema': () => window.api?.executeGestosSistema(),
    'gestos-atajos': () => window.api?.executeGestosAtajos(),
    'gestos-mouse': () => window.api?.executeGestosMouse(),
    'gestos-navegacion': () => window.api?.executeGestosNavegacion()
  }

  // Función para obtener el color del indicador según el estado
  const getStatusColor = (status: GestureStatus) => {
    switch (status) {
      case 'loading':
        return 'bg-yellow-400'
      case 'active':
        return 'bg-green-400'
      default:
        return 'bg-gray-400'
    }
  }

  // Función para obtener el texto del tooltip según el estado
  const getStatusText = (gestureId: string, label: string) => {
    const status = gestureStatus[gestureId]
    switch (status) {
      case 'loading':
        return `${label} - Iniciando...`
      case 'active':
        return `${label} - Activo`
      default:
        return `${label} - Inactivo`
    }
  }

  // Función para simular la tecla ESC
  const simulateEscKey = () => {
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true
    })
    document.dispatchEvent(escEvent)
  }

  // Función para manejar el cierre del proceso
  const handleProcessClose = (gestureId: string) => {
    const processId = gestureToProcess[gestureId as keyof typeof gestureToProcess]
    if (processId && window.api?.closeProcess) {
      // Primero actualizamos el estado a 'inactive'
      setGestureStatus(prev => ({ ...prev, [gestureId]: 'inactive' }))
      
      // Luego cerramos el proceso
      window.api.closeProcess(processId)
      
      // También enviamos la tecla ESC por si acaso
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true
      })
      document.dispatchEvent(escEvent)
    }
  }

  useEffect(() => {
    document.body.setAttribute('data-route', 'control-panel')
    
    // Agregar event listener para la tecla ESC
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Tecla ESC presionada - cerrando todos los procesos activos')
        closeAllProcessesExcept() // Cerrar todos los procesos sin excepción
      }
    }

    // Agregar el event listener
    document.addEventListener('keydown', handleEscKey)
    
    // Verificar el estado inicial de todos los procesos
    const checkInitialProcessStates = async () => {
      if (window.api?.getProcessStatus) {
        // Verificar todos los procesos disponibles
        for (const [gestureId, processId] of Object.entries(gestureToProcess)) {
          const isRunning = await window.api.getProcessStatus(processId)
          if (isRunning) {
            setActiveProcesses(prev => new Set(prev).add(processId))
            setGestureStatus(prev => ({ ...prev, [gestureId]: 'active' }))
          }
        }
      }
    }
    
    checkInitialProcessStates()

    // Escuchar cambios de estado de procesos
    if (window.api?.onProcessStatusChanged) {
      window.api.onProcessStatusChanged(({ processId, isRunning }) => {
        console.log(`Proceso ${processId} cambió estado: ${isRunning ? 'activo' : 'inactivo'}`)
        
        setActiveProcesses(prev => {
          const newSet = new Set(prev)
          if (isRunning) {
            newSet.add(processId)
          } else {
            newSet.delete(processId)
          }
          return newSet
        })

        // Actualizar el estado del gesto correspondiente
        const gestureId = Object.keys(gestureToProcess).find(
          key => gestureToProcess[key as keyof typeof gestureToProcess] === processId
        )
        
        if (gestureId) {
          setGestureStatus(prev => ({ 
            ...prev, 
            [gestureId]: isRunning ? 'active' : 'inactive' 
          }))
        }
      })
    }

    return () => {
      document.body.removeAttribute('data-route')
      document.removeEventListener('keydown', handleEscKey)
      // Cerrar todos los procesos activos al desmontar
      console.log('Desmontando componente - cerrando todos los procesos')
      closeAllProcessesExcept() // Cerrar todos los procesos
      if (window.api?.removeProcessStatusListener) {
        window.api.removeProcessStatusListener()
      }
    }
  }, [])

  const gestureSets = [
    [
      { id: 'gesture1', label: 'Volumen', icon: Volume2 },
      { id: 'gesture2', label: 'Aplicaciones', icon: AppWindow },
      { id: 'gesture3', label: 'Multimedia', icon: SquarePlay },
      { id: 'gesture4', label: 'Sistema', icon: Monitor }
    ],
    [
      { id: 'gesture5', label: 'Atajos', icon: Command },
      { id: 'gesture6', label: 'Mouse', icon: Mouse },
      { id: 'gesture7', label: 'Navegación', icon: Compass },
      { id: 'gesture8', label: 'Inicio', icon: House  }
    ]
  ]

  const toggleGestureSet = () => {
    setCurrentSet((prev) => (prev === 0 ? 1 : 0))
  }

  // Función para cerrar todos los procesos activos excepto el especificado
  const closeAllProcessesExcept = (exceptGestureId?: string) => {
    Object.entries(gestureToProcess).forEach(([gestureId, processId]) => {
      if (gestureId !== exceptGestureId && (gestureStatus[gestureId] === 'active' || gestureStatus[gestureId] === 'loading')) {
        console.log(`Cerrando proceso ${processId} para permitir solo uno activo`)
        if (window.api?.closeProcess) {
          window.api.closeProcess(processId)
        }
        setGestureStatus(prev => ({ ...prev, [gestureId]: 'inactive' }))
      }
    })
  }

  // Función para verificar si hay algún gesto activo (excepto el especificado)
  const hasActiveGesture = (exceptGestureId?: string): boolean => {
    return Object.entries(gestureStatus).some(([gestureId, status]) => 
      gestureId !== exceptGestureId && 
      gestureId !== 'gesture8' && // Excluir el botón de inicio
      (status === 'active' || status === 'loading')
    )
  }

  const toggleGesture = (gestureId: string) => {
    // Si es el gesto de inicio (gesture8), abrir la ventana principal
    if (gestureId === 'gesture8') {
      window.electron?.ipcRenderer.send('open-main-window')
      return
    }

    const processId = gestureToProcess[gestureId as keyof typeof gestureToProcess]
    
    if (processId) {
      const currentStatus = gestureStatus[gestureId]
      
      // No hacer nada si ya está en estado loading
      if (currentStatus === 'loading') return
      
      if (currentStatus === 'active') {
        // Si el proceso está activo, cerrarlo usando la función handleProcessClose
        console.log(`Cerrando proceso ${processId}`)
        handleProcessClose(gestureId)
      } else {
        // Si el proceso no está activo, verificar si hay otros activos y cerrarlos
        if (hasActiveGesture(gestureId)) {
          console.log('Cerrando otros procesos activos para permitir solo uno')
          closeAllProcessesExcept(gestureId)
        }
        
        // Ejecutar el nuevo proceso
        console.log(`Ejecutando proceso ${processId}`)
        const executor = processExecutors[processId as keyof typeof processExecutors]
        if (executor) {
          setGestureStatus(prev => ({ ...prev, [gestureId]: 'loading' }))
          executor()
        }
      }
    }
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
              onDragEnd={(_, info) => {
                setDragPosition({
                  x: dragPosition.x + info.offset.x,
                  y: dragPosition.y + info.offset.y
                })
              }}
              onClick={toggleMinimized}
              style={{ WebkitAppRegion: 'no-drag', WebkitUserSelect: 'none' } as React.CSSProperties}
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
            style={{ WebkitAppRegion: 'drag', WebkitUserSelect: 'none' } as React.CSSProperties}
          >
            {/* Window Controls */}
            <div className="flex justify-between items-center mb-4 px-1">
              <button
                onClick={toggleMinimized}
                className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                aria-label="Minimizar panel de control"
              >
                <Minus className="w-2 h-2 text-yellow-900" />
              </button>
              <button
                onClick={handleClose}
                className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
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
                  {gestureSets[currentSet].map((gesture, index) => {
                    const isCurrentGestureActive = gestureStatus[gesture.id] === 'active' || gestureStatus[gesture.id] === 'loading'
                    const hasOtherActiveGesture = hasActiveGesture(gesture.id)
                    const isDisabled = hasOtherActiveGesture && !isCurrentGestureActive && gesture.id !== 'gesture8'
                    
                    return (
                    <Tooltip.Root key={gesture.id}>
                      <Tooltip.Trigger asChild>
                        <motion.button
                          onClick={() => {
                            if (!isDisabled) {
                              toggleGesture(gesture.id)
                            }
                          }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                            gestureStatus[gesture.id] === 'active'
                              ? 'bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
                              : gestureStatus[gesture.id] === 'loading'
                              ? 'bg-yellow-500 hover:bg-yellow-400 shadow-lg shadow-yellow-500/25'
                              : isDisabled
                              ? 'bg-gray-800 cursor-not-allowed opacity-50'
                              : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                          }`}
                          whileHover={isDisabled ? {} : { scale: 1.05 }}
                          whileTap={isDisabled ? {} : { scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                          aria-label={`Gesto ${gesture.label} ${gestureStatus[gesture.id]} ${isDisabled ? '- Deshabilitado' : ''}`}
                          disabled={isDisabled}
                        >
                          <gesture.icon
                            className={`w-6 h-6 ${
                              gestureStatus[gesture.id] !== 'inactive' 
                                ? 'text-white' 
                                : isDisabled 
                                ? 'text-gray-500' 
                                : 'text-gray-300'
                            }`}
                          />
                          {gestureStatus[gesture.id] !== 'inactive' && (
                            <motion.div
                              className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(gestureStatus[gesture.id])} rounded-full border-2 border-gray-900`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            >
                              <Circle
                                className={`w-2 h-2 ${
                                  gestureStatus[gesture.id] === 'active'
                                    ? 'text-green-400 fill-current'
                                    : gestureStatus[gesture.id] === 'loading'
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                                }`}
                              />
                            </motion.div>
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
                            <span>
                              {isDisabled 
                                ? `${gesture.label} - Deshabilitado (hay otro gesto activo)` 
                                : getStatusText(gesture.id, gesture.label)
                              }
                            </span>
                          </div>
                          <Tooltip.Arrow className="fill-gray-800" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                    )
                  })}
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
                      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
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
                      Cambiar Gestos ({currentSet === 0 ? '5-8' : '1-4'})
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
