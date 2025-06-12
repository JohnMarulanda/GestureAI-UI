import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function GlowingText() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const textElement = textRef.current
    if (!textElement) return

    const letters = textElement.querySelectorAll('.letter')

    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('revealed')
      }, index * 200)
    })
  }, [])

  const text = 'GestOS'

  return (
    <motion.div
      ref={textRef}
      className="relative text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <style>
        {`
          .letter.revealed {
            opacity: 0.9 !important;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4) !important;
          }
        `}
      </style>
      <div className="relative flex justify-center items-center">
        {text.split('').map((char, index) => (
          <div
            key={index}
            className="letter relative inline-block text-9xl font-bold text-white opacity-0"
            style={{
              transition: 'all 0.5s ease-out',
              filter: 'blur(0.5px)'
            }}
          >
            {char}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
