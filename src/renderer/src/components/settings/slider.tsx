import type React from 'react'

interface SliderProps {
  value: number[]
  min: number
  max: number
  step: number
  onValueChange: (value: number[]) => void
  className?: string
  id?: string
  'aria-label'?: string
}

export const Slider = ({ 
  value, 
  min, 
  max, 
  step, 
  onValueChange, 
  className = '',
  id,
  'aria-label': ariaLabel 
}: SliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number.parseInt(e.target.value)])
  }

  return (
    <div className={`relative ${className}`}>
      <style>
        {`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: none;
          }
        `}
      </style>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
        id={id}
        aria-label={ariaLabel}
      />
    </div>
  )
}
