import GestureCard from '@/components/GestureCard2'
import GestureConfigPanel from '@/components/GestureConfigPanel'
import Background from '@/components/gesture/Background'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

// Sample gesture data
const GESTURES_DATA = [
  [
    {
      id: 1,
      name: 'Control Volumen',
      value: 'Gesto 1',
      image: '/images/gestures/volume.png',
      description: 'Movimiento suave de mano horizontal con palma abierta para controlar volumen.',
      settings: ['Sensibilidad', 'Velocidad', 'Distancia de reconocimiento']
    },
    {
      id: 2,
      name: 'Abrir Aplicaciones',
      value: 'Gesto 2',
      image: '/images/gestures/open-app.png',
      description: 'Movimiento circular con dedo índice extendido para abrir aplicaciones.',
      settings: ['Rotación', 'Diámetro', 'Umbral de completitud']
    },
    {
      id: 3,
      name: 'Control Multimedia',
      value: 'Gesto 3',
      image: '/images/gestures/media-control.png',
      description: 'Gestos de pellizcar y expandir con pulgar e índice para controlar multimedia.',
      settings: ['Sensibilidad de pellizco', 'Velocidad de expansión', 'Umbral de activación']
    },
    {
      id: 4,
      name: 'Movimiento Mouse',
      value: 'Gesto 4',
      image: '/images/gestures/mouse-move.png',
      description: 'Movimiento barrido con todos los dedos extendidos para controlar cursor.',
      settings: ['Tamaño del pincel', 'Suavizado de trazo', 'Sensibilidad a presión']
    }
  ],
  [
    {
      id: 5,
      name: 'Ajustar Brillo',
      value: 'Gesto 1',
      image: '/images/gestures/brightness.png',
      description: 'Deslizamiento vertical con dos dedos para ajustar brillo de pantalla.',
      settings: ['Velocidad de desplazamiento', 'Aceleración', 'Bloqueo de dirección']
    },
    {
      id: 6,
      name: 'Navegación Rápida',
      value: 'Gesto 2',
      image: '/images/gestures/navigation.png',
      description: 'Toque rápido y mantener para seleccionar elementos en pantalla.',
      settings: ['Duración de toque', 'Área de selección', 'Modo multi-selección']
    },
    {
      id: 7,
      name: 'Atajos de Teclado',
      value: 'Gesto 3',
      image: '/images/gestures/keyboard-shortcuts.png',
      description: 'Gestos de pellizcar para zoom dentro y fuera del contenido.',
      settings: ['Factor de zoom', 'Suavidad', 'Umbral de reinicio']
    },
    {
      id: 8,
      name: 'Control del Sistema',
      value: 'Gesto 4',
      image: '/images/gestures/system-control.png',
      description: 'Rotación con dos dedos para controlar funciones avanzadas del sistema.',
      settings: ['Sensibilidad de rotación', 'Ángulos de ajuste', 'Momentum']
    }
  ]
]

export default function GestureSettings() {
  const [selectedGesture, setSelectedGesture] = useState(GESTURES_DATA[0][0])
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = GESTURES_DATA.length

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-foreground-primary text-3xl font-bold mb-2">Gesture Settings</h1>
            <p className="text-foreground-secondary text-sm">
              Configure and customize your gesture controls
            </p>
          </div>
          <motion.button
            onClick={handleNextPage}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
            flex items-center gap-2
            bg-gradient-to-r from-background-tertiary to-background-hover
            text-foreground-primary
            px-4 py-2
            rounded-xl
            text-sm font-medium
            border border-border-secondary
            shadow-dark-lg
            transition-all duration-250
            hover:shadow-dark-xl
            focus:outline-none focus:ring-2 focus:ring-accent-muted
          "
            aria-label={`View next page of gestures (Page ${currentPage + 1} of ${totalPages})`}
          >
            View more
            <ChevronRight className="h-4 w-4 text-foreground-secondary" />
          </motion.button>
        </motion.div>

        <div
          className="
        bg-gradient-to-br from-background-secondary/95 to-background-tertiary/95
        backdrop-blur-sm
        rounded-3xl
        p-8
        shadow-dark-xl
        border border-border-primary
        space-y-8
        relative
        overflow-hidden
      "
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-muted/5 to-transparent"
            animate={{
              x: ['-200%', '200%'],
              transition: { repeat: Infinity, duration: 5, ease: 'linear' }
            }}
          />

          <div className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <AnimatePresence mode="wait">
                {GESTURES_DATA[currentPage].map((gesture) => (
                  <motion.div
                    key={gesture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <GestureCard
                      gesture={gesture}
                      isSelected={selectedGesture.id === gesture.id}
                      onClick={() => setSelectedGesture(gesture)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGesture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <GestureConfigPanel gesture={selectedGesture} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
