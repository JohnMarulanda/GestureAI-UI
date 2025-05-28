import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { routes } from '../routes/config'

export function RadialMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const controls = useAnimation()

  // Páginas donde se debe mostrar el menú radial
  const allowedPaths = [
    '/detection-test',
    '/detection-settings',
    '/interactive-space',
    '/settings',
    '/help'
  ]

  useEffect(() => {
    // Mostrar el menú solo en las páginas especificadas
    const shouldShow = allowedPaths.includes(location.pathname)
    setShowMenu(shouldShow)
  }, [location.pathname])

  useKeyboardShortcut({ key: 'r' }, () => setIsOpen((prev) => !prev))

  const handleItemClick = (path: string) => {
    setIsOpen(false)

    // Lógica para los botones de navegación
    if (path === 'prev') {
      // Navegar a la página anterior
      const currentIndex = allowedPaths.indexOf(location.pathname)
      if (currentIndex > 0) {
        navigate(allowedPaths[currentIndex - 1])
      } else {
        // Si estamos en la primera página, ir a la última
        navigate(allowedPaths[allowedPaths.length - 1])
      }
    } else if (path === 'next') {
      // Navegar a la página siguiente
      const currentIndex = allowedPaths.indexOf(location.pathname)
      if (currentIndex < allowedPaths.length - 1) {
        navigate(allowedPaths[currentIndex + 1])
      } else {
        // Si estamos en la última página, ir a la primera
        navigate(allowedPaths[0])
      }
    } else {
      // Navegación normal
      navigate(path)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {showMenu && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              w-16 h-16
              bg-gradient-to-br from-background-secondary to-background-tertiary
              hover:from-background-tertiary hover:to-background-hover
              rounded-full
              flex items-center justify-center
              text-foreground-primary
              shadow-dark-lg hover:shadow-dark-xl
              transition-all duration-250
              focus:outline-none focus:ring-2 focus:ring-accent-muted focus:ring-offset-2
              focus:ring-offset-background-primary
              transform hover:scale-105
              relative
              overflow-hidden
              group
            "
            aria-label="Abrir menú radial"
            aria-expanded={isOpen}
            role="button"
          >
            <motion.div
              animate={isOpen ? { rotate: 135 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform transition-transform group-hover:scale-110"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-muted/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
                transition: { repeat: Infinity, duration: 1.5, ease: 'linear' }
              }}
            />
          </button>
        </motion.div>
      )}

      {isOpen && showMenu && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background-primary/85 backdrop-blur-sm z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50
              py-6 px-8
              bg-gradient-to-b from-background-secondary/95 to-background-tertiary/95
              backdrop-blur-md
              border border-border-primary
              rounded-3xl
              shadow-dark-xl
            "
          >
            <div className="flex items-center gap-4">
              {routes.map((route, index) => {
                const Icon = route.icon
                const isActive = location.pathname === route.path
                return (
                  <div key={route.path} className="relative flex flex-col items-center">
                    <motion.button
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 20 }}
                      transition={{
                        delay: index * 0.03,
                        type: 'spring',
                        stiffness: 400,
                        damping: 20
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleItemClick(route.path)}
                      onMouseEnter={() => setActiveTooltip(route.path)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      className={`
                        relative
                        flex items-center justify-center
                        w-12 h-12
                        ${
                          isActive
                            ? 'bg-gradient-to-br from-accent-hover to-accent-muted border-accent-muted'
                            : 'bg-gradient-to-br from-background-tertiary to-background-hover border-border-secondary'
                        }
                        rounded-full border-2
                        text-foreground-primary
                        transition-all duration-250
                        focus:outline-none focus:ring-2 focus:ring-accent-muted
                        group
                        overflow-hidden
                      `}
                      aria-label={route.label}
                      role="menuitem"
                    >
                      <Icon
                        className={`
                          w-6 h-6
                          transition-all duration-250
                          ${isActive ? 'text-foreground-primary' : 'text-foreground-secondary group-hover:text-foreground-primary'}
                        `}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground-primary/5 to-transparent"
                        animate={{
                          x: ['-200%', '200%'],
                          transition: { repeat: Infinity, duration: 2, ease: 'linear' }
                        }}
                      />
                    </motion.button>

                    {activeTooltip === route.path && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="
                          absolute top-full mt-2
                          px-3 py-1.5
                          bg-background-secondary/95
                          backdrop-blur-sm
                          border border-border-primary
                          rounded-lg
                          shadow-dark-lg
                          z-50
                          whitespace-nowrap
                        "
                        role="tooltip"
                      >
                        <span className="text-xs font-medium text-foreground-primary">
                          {route.label}
                        </span>
                        <div
                          className="
                          absolute -top-2 left-1/2 transform -translate-x-1/2
                          w-3 h-3
                          bg-background-secondary/95
                          border-t border-l border-border-primary
                          rotate-45
                        "
                        />
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
