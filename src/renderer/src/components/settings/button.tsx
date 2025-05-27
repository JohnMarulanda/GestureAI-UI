import type React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
  onClick?: () => void
  [key: string]: any
}

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center'
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-100',
    outline: 'border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
