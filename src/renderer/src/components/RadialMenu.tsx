import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { routes } from '../routes/config';

export function RadialMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useKeyboardShortcut(
    { key: 'r' },
    () => setIsOpen((prev) => !prev)
  );

  const handleItemClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Menu Container */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
          >
            <div className="flex items-center space-x-4">
              {routes.map((route, index) => {
                const Icon = route.icon;
                return (
                  <motion.button
                    key={route.path}
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleItemClick(route.path)}
                    className="
                      flex items-center justify-center
                      w-12 h-12
                      bg-gray-800/90 hover:bg-gray-700/90
                      rounded-full border border-gray-700
                      text-gray-200 hover:text-white
                      transition-colors
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50
                      group
                      tooltip-bottom
                    "
                    data-tip={route.label}
                  >
                    <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}