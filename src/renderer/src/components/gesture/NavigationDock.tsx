import { motion } from 'framer-motion'
import { Hand, Brain, Gamepad2 } from 'lucide-react'
import React, { useState } from 'react'
import CameraSettings, { CameraSettings as CameraSettingsType } from './CameraSettings'
import DockIcon from './DockIcon'

interface NavigationDockProps {
  onSettingsChange?: (settings: CameraSettingsType) => void
  onFlipChange?: (flipped: boolean) => void
  onFullscreenChange?: (fullscreen: boolean) => void
  onRestartCamera?: () => void
  onGestureToggle?: (active: boolean) => void
  onGameToggle?: (active: boolean) => void
  onSimonSaysToggle?: (active: boolean) => void
  gestureActive?: boolean
  gameActive?: boolean
  simonSaysActive?: boolean
}

const NavigationDock: React.FC<NavigationDockProps> = ({
  onSettingsChange,
  onFlipChange,
  onFullscreenChange,
  onRestartCamera,
  onGestureToggle,
  onGameToggle,
  onSimonSaysToggle,
  gestureActive = false,
  gameActive = false,
  simonSaysActive = false
}) => {
  const [activeIcon, setActiveIcon] = useState<string | null>(null)

  const handleIconClick = (iconName: string) => {
    console.log('🖱️ Click en icono:', iconName, 'estado actual:', { activeIcon, gestureActive, gameActive, simonSaysActive })
    
    // Verificar si hay alguna interacción activa
    const hasActiveInteraction = gestureActive || gameActive || simonSaysActive
    
    // Si es el icono de gestos (reconocimiento)
    if (iconName === 'gestures') {
      const newGestureState = !gestureActive
      console.log('🎯 Cambiando estado de reconocimiento:', gestureActive, '->', newGestureState)
      
      setTimeout(() => {
        onGestureToggle?.(newGestureState)
      }, 0)
      
      if (!newGestureState && activeIcon === 'gestures') {
        setActiveIcon(null)
      }
    } 
    // Si es el icono del juego
    else if (iconName === 'game') {
      const newGameState = !gameActive
      console.log('🎯 Cambiando estado de juego:', gameActive, '->', newGameState)
      
      setTimeout(() => {
        onGameToggle?.(newGameState)
      }, 0)
      
      if (!newGameState && activeIcon === 'game') {
        setActiveIcon(null)
      }
    } 
    // Si es la interacción 1
    else if (iconName === 'simonSays') {
      const newSimonSaysState = !simonSaysActive
      console.log('🎯 Cambiando estado de Simon Says:', simonSaysActive, '->', newSimonSaysState)
      
      setTimeout(() => {
        onSimonSaysToggle?.(newSimonSaysState)
      }, 0)
      
      if (!newSimonSaysState && activeIcon === 'simonSays') {
        setActiveIcon(null)
      }
    } 
    // Para otros iconos futuros
    else {
      // Si hay una interacción activa, mostrar mensaje informativo
      if (hasActiveInteraction) {
        console.log('⚠️ No se puede activar', iconName, ': hay otra interacción activa')
        return
      }
      
      // Para otros iconos, solo manejar el panel de información
      const newActiveIcon = activeIcon === iconName ? null : iconName
      setActiveIcon(newActiveIcon)
      console.log('📋 Cambiando panel activo:', activeIcon, '->', newActiveIcon)
    }
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1
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
        stiffness: 400,
        damping: 28
      }
    }
  }

  return (
    <motion.div
      className="p-4 rounded-2xl bg-background-secondary/60 backdrop-blur-md border border-white/10 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Dock de navegación"
    >
      {/* Grid responsivo - 3 interacciones principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Hand}
            name="Reconocimiento"
            color="blue"
            onClick={() => handleIconClick('gestures')}
            active={gestureActive}
            disabled={gameActive || simonSaysActive}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Brain}
            name="Simon Says"
            color="green"
            onClick={() => handleIconClick('simonSays')}
            active={simonSaysActive}
            disabled={gestureActive || gameActive}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Gamepad2}
            name="Juego PPT"
            color="purple"
            onClick={() => handleIconClick('game')}
            active={gameActive}
            disabled={gestureActive || simonSaysActive}
          />
        </motion.div>
      </div>

      {/* Separador visual */}
      <motion.div
        variants={itemVariants}
        className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"
      />

      {/* Mensaje informativo sobre exclusividad */}
      {(gestureActive || gameActive || simonSaysActive) && (
        <motion.div
          variants={itemVariants}
          className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400 text-xs">⚡</span>
            <span className="text-yellow-400 text-xs font-medium">Modo Exclusivo</span>
          </div>
          <p className="text-yellow-200/80 text-[10px]">
            {gameActive 
              ? "Juego activo. Otras interacciones deshabilitadas temporalmente."
              : simonSaysActive
              ? "Simon Says activo. Otras interacciones deshabilitadas temporalmente."
              : "Reconocimiento activo. Otras interacciones deshabilitadas temporalmente."
            }
          </p>
        </motion.div>
      )}

      {/* Configuraciones de cámara - Sección principal */}
      <motion.div
        variants={itemVariants}
        className="w-full flex flex-col items-center justify-center"
      >
        <div className="mb-3 text-center">
          <h3 className="text-sm font-medium text-white/90 mb-1">Configuración de Cámara</h3>
          <p className="text-xs text-white/60">Ajusta los parámetros de video y visualización</p>
        </div>
        <CameraSettings
          className="w-full max-w-md"
          onSettingsChange={onSettingsChange}
          onFlipChange={onFlipChange}
          onFullscreenChange={onFullscreenChange}
          onRestartCamera={onRestartCamera}
        />
      </motion.div>

      {/* Panel de información contextual */}
      <AnimatedPanel activeIcon={activeIcon} gestureActive={gestureActive} gameActive={gameActive} simonSaysActive={simonSaysActive} />
    </motion.div>
  )
}

interface AnimatedPanelProps {
  activeIcon: string | null
  gestureActive: boolean
  gameActive: boolean
  simonSaysActive: boolean
}

const AnimatedPanel: React.FC<AnimatedPanelProps> = ({ activeIcon, gestureActive, gameActive, simonSaysActive }) => {
  if (!activeIcon && !gestureActive && !gameActive && !simonSaysActive) return null

  const panelContent = {
    gestures: {
      title: 'Reconocimiento de Gestos',
      description: gestureActive 
        ? 'Reconocimiento activo. Muestra gestos frente a la cámara para ver la detección.'
        : 'Activa el reconocimiento de gestos con IA para ver demostraciones.',
      color: gestureActive ? 'border-blue-500/50 bg-blue-500/20' : 'border-blue-500/30 bg-blue-500/10'
    },
    simonSays: {
      title: 'Simon Says - Juego de Memoria',
      description: simonSaysActive ? 'Juego de memoria activo. Memoriza y repite secuencias de gestos.' : 'Entrena tu memoria con secuencias de gestos cada vez más largas.',
      color: simonSaysActive ? 'border-green-500/50 bg-green-500/20' : 'border-green-500/30 bg-green-500/10'
    },
    game: {
      title: 'Juego Piedra, Papel o Tijeras',
      description: gameActive ? 'Juego activo. Usa gestos para jugar contra la IA.' : 'Activa el juego para disfrutar de Piedra, Papel o Tijeras.',
      color: gameActive ? 'border-purple-500/50 bg-purple-500/20' : 'border-purple-500/30 bg-purple-500/10'
    }
  }

  const currentIcon = gestureActive ? 'gestures' : gameActive ? 'game' : simonSaysActive ? 'simonSays' : activeIcon
  const content = panelContent[currentIcon as keyof typeof panelContent]

  if (!content) return null

  return (
    <motion.div
      className={`mt-4 p-3 rounded-xl border ${content.color} backdrop-blur-sm`}
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <h4 className="text-sm font-semibold text-white mb-2">{content.title}</h4>
      <p className="text-xs text-white/80">{content.description}</p>
      
      {/* Info adicional para gestos cuando está activo */}
      {currentIcon === 'gestures' && gestureActive && (
        <div className="mt-3 pt-2 border-t border-white/20">
          <div className="grid grid-cols-2 gap-1 text-[10px] text-white/70">
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
      )}

      {/* Info adicional para juego cuando está activo */}
      {currentIcon === 'game' && gameActive && (
        <div className="mt-3 pt-2 border-t border-white/20">
          <div className="grid grid-cols-3 gap-1 text-[10px] text-white/70 text-center">
            <span>✊ Piedra</span>
            <span>✋ Papel</span>
            <span>✌️ Tijeras</span>
          </div>
          <div className="mt-2 text-[9px] text-white/60 text-center">
            Haz gestos para jugar contra la IA
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default NavigationDock
