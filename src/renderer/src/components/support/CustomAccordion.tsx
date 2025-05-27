import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

type AccordionProps = {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  collapsible?: boolean
  className?: string
}

type AccordionItemProps = {
  value: string
  children: React.ReactNode
  className?: string
}

type AccordionTriggerProps = {
  children: React.ReactNode
  className?: string
}

type AccordionContentProps = {
  children: React.ReactNode
  className?: string
}

export function CustomAccordion({
  children,
  type = 'single',
  collapsible = false,
  className = ''
}: AccordionProps) {
  return (
    <div className={`w-full ${className}`} data-type={type} data-collapsible={collapsible}>
      {children}
    </div>
  )
}

export function CustomAccordionItem({ value, children, className = '' }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`border-b border-border-primary overflow-hidden ${className}`}
      data-value={value}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === CustomAccordionTrigger) {
          return React.cloneElement(child as React.ReactElement<AccordionTriggerProps>, {
            onClick: () => setIsOpen(!isOpen)
          })
        }
        if (React.isValidElement(child) && child.type === CustomAccordionContent) {
          return isOpen ? child : null
        }
        return child
      })}
    </div>
  )
}

export function CustomAccordionTrigger({
  children,
  onClick,
  className = ''
}: AccordionTriggerProps & { onClick?: () => void }) {
  return (
    <button
      className={`
        flex w-full justify-between items-center py-4 px-1 text-foreground-primary
        text-sm font-medium transition-all hover:text-accent-muted
        focus:outline-none focus:ring-2 focus:ring-accent-muted focus:ring-offset-2
        focus:ring-offset-background-primary rounded-md
        ${className}
      `}
      onClick={onClick}
      aria-expanded={onClick ? 'true' : 'false'}
    >
      {children}
      <motion.div
        animate={{ rotate: onClick ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="text-foreground-secondary"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </button>
  )
}

export function CustomAccordionContent({ children, className = '' }: AccordionContentProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: 'auto',
          opacity: 1,
          transition: {
            height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: 0.25, delay: 0.05 }
          }
        }}
        exit={{
          height: 0,
          opacity: 0,
          transition: {
            height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: 0.25 }
          }
        }}
        className={`overflow-hidden ${className}`}
      >
        <div className="pb-4 pt-1 px-1 text-foreground-secondary">{children}</div>
      </motion.div>
    </AnimatePresence>
  )
}
