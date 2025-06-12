import { motion } from 'framer-motion'
import * as SliderPrimitive from '@radix-ui/react-slider'

interface SliderProps {
  label: string
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step?: number
  marks?: { value: number; label: string }[]
  disabled?: boolean
}

export function Slider({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  marks,
  disabled = false
}: SliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-200">{label}</label>
        <span className="text-sm text-gray-400">{value[0]}</span>
      </div>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={label}
      >
        <SliderPrimitive.Track className="bg-gray-700 relative grow rounded-full h-2">
          <SliderPrimitive.Range className="absolute bg-purple-600 rounded-full h-full" />
        </SliderPrimitive.Track>
        <motion.div whileTap={{ scale: 1.1 }}>
          <SliderPrimitive.Thumb
            className="
              block w-5 h-5 bg-white rounded-full shadow-lg
              focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 focus:ring-offset-gray-900
              disabled:cursor-not-allowed disabled:opacity-50
            "
          />
        </motion.div>
      </SliderPrimitive.Root>
      {marks && (
        <div className="flex justify-between px-1 mt-2">
          {marks.map((mark) => (
            <div key={mark.value} className="flex flex-col items-center" style={{ width: '20px' }}>
              <div className="w-0.5 h-1 bg-gray-600" />
              <span className="mt-1 text-xs text-gray-400">{mark.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
