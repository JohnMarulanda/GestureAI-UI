import { useEffect, useRef, useState } from 'react'

interface SliderProps {
  defaultValue?: number[]

  min?: number

  max?: number

  step?: number

  className?: string

  onValueChange?: (value: number[]) => void
}

export function Slider({
  defaultValue = [0],

  min = 0,

  max = 100,

  step = 1,

  className = '',

  onValueChange
}: SliderProps) {
  const [value, setValue] = useState(defaultValue[0])

  const [isDragging, setIsDragging] = useState(false)

  const sliderRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)

    updateValue(e)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()

    const x = e.clientX - rect.left

    const percentage = Math.max(0, Math.min(1, x / rect.width))

    const newValue = Math.round((percentage * (max - min) + min) / step) * step

    setValue(newValue)

    onValueChange?.([newValue])
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)

      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)

        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 rounded-full bg-gray-200 cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div
        className="absolute h-full bg-blue-600 rounded-full transition-all duration-100"
        style={{ width: `${percentage}%` }}
      />

      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -translate-y-1/2 transition-all duration-100"
        style={{
          left: `${percentage}%`,

          top: '50%',

          transform: `translateX(-50%) translateY(-50%)`
        }}
      />
    </div>
  )
}
