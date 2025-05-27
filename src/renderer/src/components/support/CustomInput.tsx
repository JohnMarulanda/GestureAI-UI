import React, { forwardRef } from 'react'

import { motion } from 'framer-motion'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string

  error?: string

  icon?: React.ReactNode

  iconPosition?: 'left' | 'right'

  helperText?: string

  fullWidth?: boolean

  variant?: 'default' | 'filled' | 'outlined'

  containerClassName?: string
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      type = 'text',

      placeholder = '',

      className = '',

      label,

      error,

      icon,

      iconPosition = 'left',

      helperText,

      fullWidth = true,

      variant = 'default',

      containerClassName = '',

      id,

      disabled,

      required,

      ...props
    },

    ref
  ) => {
    // Generate a unique ID if not provided

    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

    // Variant styles

    const variantStyles = {
      default: 'border border-border-primary bg-background-secondary',

      filled: 'border-0 bg-foreground-muted/10',

      outlined: 'border border-border-primary bg-transparent'
    }

    // Base styles

    const baseStyles = `

    px-4 py-2 rounded-lg text-foreground-primary

    placeholder:text-foreground-muted/60

    focus:outline-none focus:ring-2 focus:ring-accent-muted focus:border-accent-muted

    disabled:opacity-50 disabled:cursor-not-allowed

    transition-all duration-300 ease-in-out

    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}

    ${icon && iconPosition === 'left' ? 'pl-10' : ''}

    ${icon && iconPosition === 'right' ? 'pr-10' : ''}

    ${fullWidth ? 'w-full' : 'w-auto'}

  `

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground-primary mb-1.5"
          >
            {label}

            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
              {icon}
            </div>
          )}

          <motion.input
            ref={ref}
            type={type}
            id={inputId}
            placeholder={placeholder}
            className={`

            ${baseStyles}

            ${variantStyles[variant]}

            ${className}

          `}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-foreground-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'
