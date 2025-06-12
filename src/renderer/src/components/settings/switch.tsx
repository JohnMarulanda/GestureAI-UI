interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  id?: string
  'aria-label'?: string
}

export const Switch = ({ 
  checked, 
  onCheckedChange, 
  className = '',
  id,
  'aria-label': ariaLabel 
}: SwitchProps) => {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-white' : 'bg-zinc-700'
      } ${className}`}
      id={id}
      aria-label={ariaLabel}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-zinc-900 transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
