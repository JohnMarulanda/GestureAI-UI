'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type GestureCardProps = {
  gesture: {
    id: number
    name: string
    value: string
    icon: LucideIcon
    description: string
    details: {
      howTo: string
      features: string[]
      tips: string[]
    }
  }
  isSelected: boolean
  onClick: () => void
}

export default function GestureCard({ gesture, isSelected, onClick }: GestureCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-full
        bg-gradient-to-br from-background-secondary to-background-tertiary
        rounded-2xl
        p-6
        border
        shadow-dark-lg
        transition-all duration-300
        group
        overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-accent-muted
        ${isSelected ? 'border-accent-primary shadow-accent-muted/20' : 'border-border-primary hover:border-border-secondary'}
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-muted/5 to-transparent"
        animate={{
          x: ['-200%', '200%'],
          transition: { repeat: Infinity, duration: 3, ease: 'linear' }
        }}
      />

      {/* Selection indicator */}
      <motion.div
        className="absolute -inset-1 bg-accent-primary/10 rounded-2xl z-0"
        initial={false}
        animate={{ scale: isSelected ? 1 : 0.6, opacity: isSelected ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        layoutId={`selection-${gesture.id}`}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent-primary/10 to-accent-muted/10 border border-accent-muted/20 group-hover:border-accent-primary/30 transition-colors">
            <gesture.icon className="w-6 h-6 text-accent-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground-primary font-medium text-base mb-1 truncate">
              {gesture.name}
            </h3>
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-accent-muted/20 to-accent-primary/20 border border-accent-muted/30 text-accent-primary text-xs font-medium">
              {gesture.value}
            </div>
          </div>
        </div>

        <div className="text-sm text-foreground-secondary line-clamp-3 group-hover:text-foreground-primary transition-colors duration-200">
          {gesture.description}
        </div>
      </div>
    </motion.button>
  )
}
