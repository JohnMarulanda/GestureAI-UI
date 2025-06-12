interface SeparatorProps {
  className?: string
}

export const Separator = ({ className = '' }: SeparatorProps) => {
  return <div className={`h-px bg-zinc-800 ${className}`} />
}
