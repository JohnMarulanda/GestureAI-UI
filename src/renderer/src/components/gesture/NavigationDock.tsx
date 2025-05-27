import { motion } from 'framer-motion'
import { Hand, MousePointerClick, Palette, Settings, Sun, Zap } from 'lucide-react'
import React, { useState } from 'react'
import CameraSettings from './CameraSettings'
import DockIcon from './DockIcon'

const NavigationDock: React.FC = () => {
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
      {/* Grid de 2 columnas con 3 filas para gestos */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Hand}
            name="Gestos"
            color="purple"
            onClick={() => handleIconClick('gestures')}
            active={activeIcon === 'gestures'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={MousePointerClick}
            name="Controles"
            color="green"
            onClick={() => handleIconClick('controls')}
            active={activeIcon === 'controls'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Palette}
            name="Apariencia"
            color="purple"
            onClick={() => handleIconClick('appearance')}
            active={activeIcon === 'appearance'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Sun}
            name="Tema"
            color="amber"
            onClick={() => handleIconClick('theme')}
            active={activeIcon === 'theme'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Zap}
            name="Rendimiento"
            color="blue"
            onClick={() => handleIconClick('performance')}
            active={activeIcon === 'performance'}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DockIcon
            icon={Settings}
            name="Configurar"
            color="green"
            onClick={() => handleIconClick('settings')}
            active={activeIcon === 'settings'}
          />
        </motion.div>
      </div>

      {/* Botón de configuraciones de cámara */}
      <motion.div variants={itemVariants} className="w-full">
        <CameraSettings className="w-full" />
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
      title: 'Gestos',
      description: 'Aprende y personaliza los gestos disponibles.',
      color: 'border-purple-500/30 bg-purple-500/10'
    },
    controls: {
      title: 'Controles',
      description: 'Configura la sensibilidad y precisión de los gestos.',
      color: 'border-green-500/30 bg-green-500/10'
    },
    appearance: {
      title: 'Apariencia',
      description: 'Ajusta colores, tamaños y efectos visuales.',
      color: 'border-purple-500/30 bg-purple-500/10'
    },
    theme: {
      title: 'Tema',
      description: 'Personaliza el aspecto visual de la interfaz.',
      color: 'border-amber-500/30 bg-amber-500/10'
    },
    performance: {
      title: 'Rendimiento',
      description: 'Optimiza el rendimiento de la detección de gestos.',
      color: 'border-blue-500/30 bg-blue-500/10'
    },
    settings: {
      title: 'Configuraciones',
      description: 'Ajusta configuraciones generales del sistema.',
      color: 'border-green-500/30 bg-green-500/10'
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
