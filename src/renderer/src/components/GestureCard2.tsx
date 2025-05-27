'use client'

import { motion } from 'framer-motion'

type GestureCardProps = {
  gesture: {
    id: number
    name: string
    value: string
    image: string
    description: string
    settings: string[]
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
        p-4
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
        <div
          className="
          aspect-square
          rounded-xl
          mb-3
          overflow-hidden
          bg-gradient-to-br from-background-hover to-background-tertiary
          border border-border-secondary
        "
        >
          <img
            src={gesture.image}
            alt={`${gesture.name} gesture preview`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="space-y-1">
          <h3
            className="
            text-foreground-primary
            font-medium
            text-sm
            truncate
          "
          >
            {gesture.name}
          </h3>

          <div
            className="
            text-xs
            text-foreground-secondary
            line-clamp-2
            group-hover:text-foreground-primary
            transition-colors duration-200
          "
          >
            {gesture.description}
          </div>

          <div
            className="
            mt-2
            inline-flex
            items-center
            px-2
            py-1
            rounded-lg
            bg-gradient-to-r from-accent-muted/20 to-accent-primary/20
            border border-accent-muted/30
            text-accent-primary
            text-xs
            font-medium
          "
          >
            {gesture.value}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
