import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Minimize2, X } from 'lucide-react'
import React, { ReactNode, useState } from 'react'

interface MacWindowProps {
  children: ReactNode
  title?: string
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  className?: string
  variant?: 'default' | 'blue' | 'purple' | 'amber' | 'green'
  showControls?: boolean
}

const MacWindow: React.FC<MacWindowProps> = ({
  children,
  title = 'GestureOS',
  onClose,
  onMinimize,
  onMaximize,
  className = '',
  variant = 'default',
  showControls = true
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Variantes para animaciones
  const windowVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 25,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    },
    hover: {
      y: -5,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30
      }
    }
  }

  const controlVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 25
      }
    }
  }

  // Mapeo de variantes de color
  const variantStyles = {
    default: 'from-background-secondary/50 to-background-secondary/80 border-white/10',
    blue: 'from-blue-900/30 to-blue-950/50 border-blue-500/20',
    purple: 'from-purple-900/30 to-purple-950/50 border-purple-500/20',
    amber: 'from-amber-900/30 to-amber-950/50 border-amber-500/20',
    green: 'from-green-900/30 to-green-950/50 border-green-500/20'
  }

  const headerStyles = {
    default: 'bg-background-primary/90',
    blue: 'bg-blue-900/40',
    purple: 'bg-purple-900/40',
    amber: 'bg-amber-900/40',
    green: 'bg-green-900/40'
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`overflow-hidden rounded-xl border bg-gradient-to-b backdrop-blur-md shadow-lg ${variantStyles[variant]} ${className}`}
        variants={windowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        role="region"
        aria-label={`Ventana: ${title}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Barra de título */}
        <div
          className={`flex items-center justify-between px-4 py-2 ${headerStyles[variant]} border-b border-white/10`}
        >
          {/* Botones de control */}
          {showControls && (
            <div className="flex items-center space-x-2 z-10">
              <motion.button
                className="relative w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
                onClick={onClose}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar ventana"
                variants={controlVariants}
              >
                {onClose && (
                  <X
                    className="absolute w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                )}
              </motion.button>

              <motion.button
                className="relative w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
                onClick={onMinimize}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Minimizar ventana"
                variants={controlVariants}
              >
                {onMinimize && (
                  <Minimize2
                    className="absolute w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                )}
              </motion.button>

              <motion.button
                className="relative w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
                onClick={onMaximize}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Maximizar ventana"
                variants={controlVariants}
              >
                {onMaximize && (
                  <Maximize2
                    className="absolute w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            </div>
          )}

          {/* Título */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <motion.h3
              className="text-xs font-medium text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h3>
          </div>

          {/* Espacio para equilibrar el layout */}
          <div className="w-[59px]"></div>
        </div>

        {/* Contenido */}
        <motion.div
          className="p-4 bg-gradient-to-b from-transparent to-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>

        {/* Efecto de brillo en el borde cuando está en hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none border border-white/20 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default MacWindow
