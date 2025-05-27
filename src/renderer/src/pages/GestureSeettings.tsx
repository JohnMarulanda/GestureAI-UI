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
      name: 'Lorem ipsum',
      value: '1.20 WETH',
      image: '/images/gesture-1.png',
      description: 'A fluid hand movement from left to right with palm open',
      settings: ['Sensitivity', 'Speed', 'Recognition distance']
    },
    {
      id: 2,
      name: 'LSD swirl',
      value: '0.85 WETH',
      image: '/images/gesture-2.png',
      description: 'A circular motion with index finger extended',
      settings: ['Rotation', 'Diameter', 'Completion threshold']
    },
    {
      id: 3,
      name: 'Solar oil swirl',
      value: '0.37 WETH',
      image: '/images/gesture-3.png',
      description: 'A pinch and expand motion with thumb and index finger',
      settings: ['Pinch sensitivity', 'Expansion rate', 'Trigger threshold']
    },
    {
      id: 4,
      name: 'Airtist paintbrush',
      value: '0.55 WETH',
      image: '/images/gesture-4.png',
      description: 'A sweeping motion with all fingers extended',
      settings: ['Brush size', 'Stroke smoothing', 'Pressure sensitivity']
    }
  ],
  [
    {
      id: 5,
      name: 'Digitorum scrollus',
      value: '0.90 WETH',
      image: '/images/gesture-5.png',
      description: 'A two-finger vertical swipe for precise scrolling',
      settings: ['Scroll speed', 'Acceleration', 'Direction lock']
    },
    {
      id: 6,
      name: 'Quantum select',
      value: '1.45 WETH',
      image: '/images/gesture-6.png',
      description: 'A quick tap and hold motion for selection',
      settings: ['Hold duration', 'Selection area', 'Multi-select mode']
    },
    {
      id: 7,
      name: 'Nebula zoom',
      value: '1.10 WETH',
      image: '/images/gesture-7.png',
      description: 'A pinch gesture for zooming in and out',
      settings: ['Zoom factor', 'Smoothness', 'Reset threshold']
    },
    {
      id: 8,
      name: 'Vortex rotate',
      value: '0.75 WETH',
      image: '/images/gesture-8.png',
      description: 'A two-finger rotation gesture',
      settings: ['Rotation sensitivity', 'Snapping angles', 'Momentum']
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
