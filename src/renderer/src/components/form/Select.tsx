import { SelectHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, ...props }, ref) => {
    const id = `select-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-200">
          {label}
        </label>
        <motion.div whileTap={{ scale: 0.995 }} className="relative rounded-lg">
          <select
            id={id}
            ref={ref}
            className={`
              block w-full rounded-lg border bg-gray-800/50 px-4 py-2.5
              text-gray-200 transition-colors duration-200
              focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-500' : 'border-gray-700'}
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </motion.div>
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
