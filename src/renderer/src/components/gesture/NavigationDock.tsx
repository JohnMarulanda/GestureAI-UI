import { motion } from 'framer-motion'
import { AppWindow, Palette, SquarePlay, Sun, Volume2, Zap } from 'lucide-react'
import React, { useState } from 'react'
import CameraSettings, { CameraSettings as CameraSettingsType } from './CameraSettings'
import DockIcon from './DockIcon'

interface NavigationDockProps {
  onSettingsChange?: (settings: CameraSettingsType) => void
  onFlipChange?: (flipped: boolean) => void
  onFullscreenChange?: (fullscreen: boolean) => void
  onRestartCamera?: () => void
}

const NavigationDock: React.FC<NavigationDockProps> = ({
  onSettingsChange,
  onFlipChange,
  onFullscreenChange,
  onRestartCamera
}) => {
  const [activeIcon, setActiveIcon] = useState<string | null>(null)

  const handleIconClick = (iconName: string) => {
    setActiveIcon(activeIcon === iconName ? null : iconName)
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
      {/* Grid responsivo - 1 columna en móvil, 2 en tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Volume2}
            name="Volumen"
            color="purple"
            onClick={() => handleIconClick('gestures')}
            active={activeIcon === 'gestures'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Palette}
            name="Interacción 1"
            color="green"
            onClick={() => handleIconClick('controls')}
            active={activeIcon === 'controls'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={AppWindow}
            name="Aplicaciones"
            color="amber"
            onClick={() => handleIconClick('appearance')}
            active={activeIcon === 'appearance'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Sun}
            name="Interacción 2"
            color="pink"
            onClick={() => handleIconClick('theme')}
            active={activeIcon === 'theme'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={SquarePlay}
            name="Multimedia"
            color="blue"
            onClick={() => handleIconClick('performance')}
            active={activeIcon === 'performance'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Zap}
            name="Interacción 3"
            color="red"
            onClick={() => handleIconClick('settings')}
            active={activeIcon === 'settings'}
          />
        </motion.div>
      </div>

      {/* Separador visual */}
      <motion.div
        variants={itemVariants}
        className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"
      />

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
      <AnimatedPanel activeIcon={activeIcon} />
    </motion.div>
  )
}

interface AnimatedPanelProps {
  activeIcon: string | null
}

const AnimatedPanel: React.FC<AnimatedPanelProps> = ({ activeIcon }) => {
  if (!activeIcon) return null

  const panelContent = {
    gestures: {
      title: 'Volumen',
      description: 'Sube, baja o mutea el volumen de tu sistema.  ',
      color: 'border-purple-500/30 bg-purple-500/10'
    },
    controls: {
      title: 'Interacción 1',
      description: 'Personaliza.',
      color: 'border-green-500/30 bg-green-500/10'
    },
    appearance: {
      title: 'Aplicaciones',
      description: 'Abre o cierra aplicaciones de tu sistema.',
      color: 'border-amber-500/30 bg-amber-500/10'
    },
    theme: {
      title: 'Interacción 2',
      description: 'Personaliza.',
      color: 'border-pink-500/30 bg-pink-500/10'
    },
    performance: {
      title: 'Multimedia',
      description: 'Adelanta, retroduce, pausa o reinicia la reproducción.',
      color: 'border-blue-500/30 bg-blue-500/10'
    },
    settings: {
      title: 'Interacción 3',
      description: 'Personaliza.',
      color: 'border-red-500/30 bg-red-500/10'
    }
  }

  const content = panelContent[activeIcon as keyof typeof panelContent]

  return (
    <motion.div
      className={`mt-4 p-3 rounded-xl border ${content.color} backdrop-blur-sm`}
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <h3 className="text-sm font-medium text-white mb-1">{content.title}</h3>
      <p className="text-xs text-white/70">{content.description}</p>
    </motion.div>
  )
}

export default NavigationDock
