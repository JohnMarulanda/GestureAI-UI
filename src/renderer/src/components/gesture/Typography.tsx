import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'

interface MainHeadingProps {
  children: ReactNode
  className?: string
  id?: string
}

export const MainHeading: React.FC<MainHeadingProps> = ({ children, className = '', id }) => {
  return (
    <motion.h1
      id={id}
      className={`relative text-4xl md:text-5xl lg:text-6xl font-bold text-white ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.1
      }}
    >
      {/* Capa de sombra principal */}
      <span className="absolute -left-1 -top-1 text-purple-500/20 select-none" aria-hidden="true">
        {children}
      </span>

      {/* Capa de sombra secundaria */}
      <span className="absolute -left-0.5 -top-0.5 text-blue-500/30 select-none" aria-hidden="true">
        {children}
      </span>

      {/* Texto principal */}
      <span className="relative">{children}</span>
    </motion.h1>
  )
}

interface SubtitleProps {
  children: ReactNode
  secondary?: boolean
  className?: string
  id?: string
}

export const Subtitle: React.FC<SubtitleProps> = ({
  children,
  secondary = false,
  className = '',
  id
}) => {
  return (
    <motion.h2
      id={id}
      className={`text-xl md:text-2xl font-medium ${secondary ? 'text-white/70' : 'text-white/90'} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: 0.2
      }}
      style={{
        textShadow: secondary ? 'none' : '0 2px 10px rgba(255,255,255,0.15)'
      }}
    >
      {children}
    </motion.h2>
  )
}

interface TextProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'muted' | 'accent'
}

export const Text: React.FC<TextProps> = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'text-white/90',
    muted: 'text-white/60',
    accent: 'text-blue-400'
  }

  return (
    <motion.p
      className={`${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.p>
  )
}

interface GlowingTextProps {
  children: ReactNode
  color?: 'blue' | 'purple' | 'pink' | 'amber' | 'green'
  className?: string
}

export const GlowingText: React.FC<GlowingTextProps> = ({
  children,
  color = 'blue',
  className = ''
}) => {
  const colorMap = {
    blue: 'text-blue-400 shadow-blue-500/50',
    purple: 'text-purple-400 shadow-purple-500/50',
    pink: 'text-pink-400 shadow-pink-500/50',
    amber: 'text-amber-400 shadow-amber-500/50',
    green: 'text-green-400 shadow-green-500/50'
  }

  return (
    <motion.span
      className={`inline-block font-medium ${colorMap[color]} ${className}`}
      style={{ textShadow: `0 0 15px currentColor` }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
    >
      {children}
    </motion.span>
  )
}
