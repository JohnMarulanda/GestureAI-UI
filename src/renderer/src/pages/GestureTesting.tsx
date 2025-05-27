import Background from '@/components/gesture/Background'
import CameraInterface from '@/components/gesture/CameraInterface'
import MacWindow from '@/components/gesture/MacWindow'
import NavigationDock from '@/components/gesture/NavigationDock'
import { GlowingText, MainHeading, Subtitle, Text } from '@/components/gesture/Typography'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import '../../src/styles/animations.css'

const GestureTesting: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-primary">
      {/* Background con efectos visuales */}
      <Background />

      {/* Contenedor principal con animaciones */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sección de encabezado */}
        <motion.header className="mb-8 pt-4 md:pt-8" variants={itemVariants}>
          <MainHeading className="text-center mb-3">
            Where <GlowingText color="purple">Gestures</GlowingText> Bring Ideas to Life
          </MainHeading>
          <Subtitle className="text-center max-w-2xl mx-auto" secondary>
            Control your digital world with natural hand movements and gestures
          </Subtitle>
        </motion.header>

        {/* Sección principal con cámara y dock */}
        <motion.main
          className="flex-grow flex flex-col lg:flex-row gap-8 items-start"
          variants={itemVariants}
        >
          {/* Sección de la cámara */}
          <motion.div
            className="flex-grow w-full lg:w-3/4"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <MacWindow title="Gesture Recognition Camera" variant="purple">
              <CameraInterface />
            </MacWindow>
          </motion.div>

          {/* Panel lateral con dock y controles */}
          <motion.aside className="w-full lg:w-1/4 flex flex-col gap-6" variants={itemVariants}>
            {/* Dock de navegación reorganizado */}
            <div className="w-full">
              <NavigationDock />
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
        </motion.main>

        {/* Pie de página */}
        <motion.footer
          className="mt-8 py-4 text-center text-white/40 text-xs"
          variants={itemVariants}
        >
          <Text variant="muted" className="text-xs">
            GestureAI Interface •{' '}
            <GlowingText color="blue" className="text-xs">
              Powered by AI
            </GlowingText>
          </Text>
        </motion.footer>
      </motion.div>
    </div>
  )
}

export default GestureTesting
