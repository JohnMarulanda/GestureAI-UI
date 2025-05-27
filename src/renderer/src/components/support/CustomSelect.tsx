import { forwardRef, useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { Check, ChevronDown } from 'lucide-react'

interface Option {
  value: string

  label: string

  disabled?: boolean
}

interface CustomSelectProps {
  options: Option[]

  placeholder?: string

  label?: string

  error?: string

  helperText?: string

  onChange?: (value: string) => void

  value?: string

  disabled?: boolean

  required?: boolean

  fullWidth?: boolean

  className?: string

  containerClassName?: string

  id?: string
}

export const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(
  (
    {
      options,

      placeholder = 'Seleccionar...',

      label,

      error,

      helperText,

      onChange,

      value,

      disabled = false,

      required = false,

      fullWidth = true,

      className = '',

      containerClassName = '',

      id
    },

    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)

    const [selectedValue, setSelectedValue] = useState<string | undefined>(value)

    const selectRef = useRef<HTMLDivElement>(null)

    const mergedRef = useRef<HTMLDivElement | null>(null)

    // Generate a unique ID if not provided

    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`

    // Handle outside click to close dropdown

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    // Update internal state when value prop changes

    useEffect(() => {
      setSelectedValue(value)
    }, [value])

    // Set merged ref

    useEffect(() => {
      if (typeof ref === 'function') {
        ref(selectRef.current)
      } else if (ref) {
        ref.current = selectRef.current
      }

      mergedRef.current = selectRef.current
    }, [ref])

    const handleSelect = (option: Option) => {
      if (option.disabled) return

      setSelectedValue(option.value)

      setIsOpen(false)

      onChange?.(option.value)
    }

    const selectedOption = options.find((option) => option.value === selectedValue)

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`} ref={selectRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground-primary mb-1.5"
          >
            {label}

            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <button
            id={selectId}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`

            flex items-center justify-between w-full px-4 py-2 rounded-lg 

            border ${error ? 'border-red-500' : 'border-border-primary'} 

            ${disabled ? 'bg-background-muted cursor-not-allowed opacity-60' : 'bg-background-secondary cursor-pointer'}

            text-foreground-primary text-left

            focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-accent-muted'}

            transition-all duration-300 ease-in-out

            ${className}

          `}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? selectId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            disabled={disabled}
          >
            <span className={`truncate ${!selectedOption ? 'text-foreground-muted' : ''}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="text-foreground-muted"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute z-50 mt-1 w-full rounded-lg bg-background-primary border border-border-primary shadow-lg"
                role="listbox"
                aria-labelledby={selectId}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => !option.disabled && handleSelect(option)}
                    className={`

                    flex items-center justify-between px-4 py-2 

                    ${option.disabled ? 'text-foreground-muted cursor-not-allowed' : 'text-foreground-primary cursor-pointer hover:bg-background-secondary'}

                    ${selectedValue === option.value ? 'bg-accent-muted/10' : ''}

                    transition-colors duration-150 ease-in-out

                  `}
                    role="option"
                    aria-selected={selectedValue === option.value}
                    aria-disabled={option.disabled}
                  >
                    <span>{option.label}</span>

                    {selectedValue === option.value && (
                      <Check className="h-4 w-4 text-accent-primary" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-foreground-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

CustomSelect.displayName = 'CustomSelect'
