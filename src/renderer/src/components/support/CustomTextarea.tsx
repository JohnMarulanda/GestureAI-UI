import React, { forwardRef } from 'react'

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string

  error?: string

  helperText?: string

  fullWidth?: boolean

  variant?: 'default' | 'filled' | 'outlined'

  containerClassName?: string

  rows?: number

  maxLength?: number

  showCharCount?: boolean
}

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  (
    {
      placeholder = '',

      className = '',

      label,

      error,

      helperText,

      fullWidth = true,

      variant = 'default',

      containerClassName = '',

      id,

      disabled,

      required,

      rows = 4,

      maxLength,

      showCharCount = false,

      value,

      ...props
    },

    ref
  ) => {
    // Generate a unique ID if not provided

    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`

    // Variant styles

    const variantStyles = {
      default: 'border border-border-primary bg-background-secondary',

      filled: 'border-0 bg-foreground-muted/10',

      outlined: 'border border-border-primary bg-transparent'
    }

    // Base styles

    const baseStyles = `

    w-full px-4 py-3 rounded-lg text-foreground-primary

    placeholder:text-foreground-muted/60

    focus:outline-none focus:ring-2 focus:ring-accent-muted focus:border-accent-muted

    disabled:opacity-50 disabled:cursor-not-allowed

    transition-all duration-300 ease-in-out resize-vertical

    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}

  `

    // Calculate character count

    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground-primary mb-1.5"
          >
            {label}

            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          placeholder={placeholder}
          className={`

          ${baseStyles}

          ${variantStyles[variant]}

          ${className}

        `}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : showCharCount && maxLength
                  ? `${textareaId}-count`
                  : undefined
          }
          value={value}
          {...props}
        />

        <div className="flex justify-between items-center mt-1.5">
          {error ? (
            <p id={`${textareaId}-error`} className="text-xs text-red-500">
              {error}
            </p>
          ) : helperText ? (
            <p id={`${textareaId}-helper`} className="text-xs text-foreground-muted">
              {helperText}
            </p>
          ) : (
            <span></span>
          )}

          {showCharCount && maxLength && (
            <p
              id={`${textareaId}-count`}
              className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-foreground-muted'}`}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

CustomTextarea.displayName = 'CustomTextarea'
