import { motion } from 'framer-motion'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface CustomButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

export function CustomButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  ariaLabel
}: CustomButtonProps) {
  // Variant styles
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/25',
    secondary:
      'bg-gradient-to-r from-foreground-muted/10 to-foreground-muted/20 text-foreground-primary shadow-md',
    outline:
      'bg-transparent border border-border-primary text-foreground-primary hover:bg-background-secondary',
    ghost: 'bg-transparent text-foreground-primary hover:bg-background-secondary',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl'
  }

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-accent-muted focus:ring-offset-2 focus:ring-offset-background-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  return (
    <motion.button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </motion.button>
  )
}
