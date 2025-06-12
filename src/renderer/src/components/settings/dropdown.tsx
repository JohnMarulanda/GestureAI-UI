import { Check } from 'lucide-react'
import type React from 'react'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick: () => void
  isSelected: boolean
}

export const Dropdown = ({ trigger, children, isOpen, onToggle }: DropdownProps) => {
  return (
    <div className="relative">
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-48 rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export const DropdownItem = ({ children, onClick, isSelected }: DropdownItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2 text-white hover:bg-zinc-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
    >
      {children}
      {isSelected && <Check className="h-4 w-4" />}
    </div>
  )
}
