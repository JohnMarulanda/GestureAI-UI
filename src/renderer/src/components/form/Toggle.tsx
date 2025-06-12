import { motion } from 'framer-motion'
import { Switch } from '@headlessui/react'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  disabled?: boolean
}

export function Toggle({ label, checked, onChange, description, disabled = false }: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex items-start">
      <div className="flex-grow">
        <Switch.Label as="span" className="text-sm font-medium text-gray-200" passive>
          {label}
        </Switch.Label>
        {description && <div className="mt-1 text-sm text-gray-400">{description}</div>}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          ${checked ? 'bg-purple-600' : 'bg-gray-700'}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 focus:ring-offset-gray-900
        `}
      >
        <span className="sr-only">{label}</span>
        <motion.span
          initial={false}
          animate={{
            x: checked ? 20 : 2
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            ${checked ? 'bg-white' : 'bg-gray-300'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full
            shadow ring-0 transition duration-200 ease-in-out
          `}
        />
      </Switch>
    </Switch.Group>
  )
}
