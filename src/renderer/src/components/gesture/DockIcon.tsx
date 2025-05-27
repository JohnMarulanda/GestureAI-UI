import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface DockIconProps {
  icon: LucideIcon
  name: string
  color?: string
  onClick?: () => void
  active?: boolean
  className?: string
}

const DockIcon: React.FC<DockIconProps> = ({
  icon: Icon,
  name,
  color = 'blue',
  onClick,
  active = false,
  className = ''
}) => {
  // Mapeo de colores para diferentes estados
  const colorMap = {
    blue: {
      bg: active ? 'bg-blue-500/20' : 'bg-blue-500/10',
      border: active ? 'border-blue-500/50' : 'border-blue-500/20',
      text: active ? 'text-blue-400' : 'text-blue-300',
      icon: active ? 'text-blue-400' : 'text-blue-300',
      hover: 'hover:bg-blue-500/30 hover:border-blue-500/60',
      glow: 'from-blue-500/20 to-transparent'
    },
    purple: {
      bg: active ? 'bg-purple-500/20' : 'bg-purple-500/10',
      border: active ? 'border-purple-500/50' : 'border-purple-500/20',
      text: active ? 'text-purple-400' : 'text-purple-300',
      icon: active ? 'text-purple-400' : 'text-purple-300',
      hover: 'hover:bg-purple-500/30 hover:border-purple-500/60',
      glow: 'from-purple-500/20 to-transparent'
    },
    amber: {
      bg: active ? 'bg-amber-500/20' : 'bg-amber-500/10',
      border: active ? 'border-amber-500/50' : 'border-amber-500/20',
      text: active ? 'text-amber-400' : 'text-amber-300',
      icon: active ? 'text-amber-400' : 'text-amber-300',
      hover: 'hover:bg-amber-500/30 hover:border-amber-500/60',
      glow: 'from-amber-500/20 to-transparent'
    },
    green: {
      bg: active ? 'bg-green-500/20' : 'bg-green-500/10',
      border: active ? 'border-green-500/50' : 'border-green-500/20',
      text: active ? 'text-green-400' : 'text-green-300',
      icon: active ? 'text-green-400' : 'text-green-300',
      hover: 'hover:bg-green-500/30 hover:border-green-500/60',
      glow: 'from-green-500/20 to-transparent'
    },
    red: {
      bg: active ? 'bg-red-500/20' : 'bg-red-500/10',
      border: active ? 'border-red-500/50' : 'border-red-500/20',
      text: active ? 'text-red-400' : 'text-red-300',
      icon: active ? 'text-red-400' : 'text-red-300',
      hover: 'hover:bg-red-500/30 hover:border-red-500/60',
      glow: 'from-red-500/20 to-transparent'
    },
    pink: {
      bg: active ? 'bg-pink-500/20' : 'bg-pink-500/10',
      border: active ? 'border-pink-500/50' : 'border-pink-500/20',
      text: active ? 'text-pink-400' : 'text-pink-300',
      icon: active ? 'text-pink-400' : 'text-pink-300',
      hover: 'hover:bg-pink-500/30 hover:border-pink-500/60',
      glow: 'from-pink-500/20 to-transparent'
    }
  }

  // Obtener el esquema de color seleccionado o usar el azul por defecto
  const colorScheme = colorMap[color as keyof typeof colorMap] || colorMap.blue

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Efecto de brillo en hover */}
      <div
        className="absolute inset-0 -bottom-4 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${colorScheme.glow.split('-')[1].split('/')[0]}, transparent 70%)`,
          filter: 'blur(10px)'
        }}
      />

      {/* Contenedor principal */}
      <motion.button
        onClick={onClick}
        className={`group relative flex flex-col items-center justify-center w-full p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${colorScheme.bg} ${colorScheme.border} ${colorScheme.hover}`}
        whileHover={{ y: -2 }}
        aria-label={name}
      >
        {/* Icono */}
        <div className={`relative z-10 mb-1 ${colorScheme.icon}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Nombre */}
        <span className={`text-xs font-medium ${colorScheme.text}`}>{name}</span>

        {/* Indicador de activo */}
        {active && (
          <motion.div
            className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-current"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}

export default DockIcon
