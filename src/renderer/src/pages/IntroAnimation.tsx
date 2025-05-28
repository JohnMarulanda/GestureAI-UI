import backgroundImage from '@renderer/assets/hands/Fondo.png'
import introSound from '@renderer/assets/IntroSound.mp3'
import { BackgroundLines } from '@renderer/components/BackgroundLines'
import { GlowingText } from '@renderer/components/GlowingText'
import { AnimatePresence, motion } from 'framer-motion'
import { SkipForward } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function IntroAnimation() {
  const [showTitle, setShowTitle] = useState(false)
  const [showBackground, setShowBackground] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const navigate = useNavigate()

  const handleSkip = () => {
    setFadeOut(true)
    setTimeout(() => {
      navigate('/home')
    }, 500)
  }

  useEffect(() => {
    const audio = new Audio(introSound)
    audio.volume = 0.2 // Set volume to a lower level
    audio.play()

    const titleTimer = setTimeout(() => {
      setShowTitle(true)

      const bgTimer = setTimeout(() => {
        setShowBackground(true)
        setShowSkipButton(true) // Show skip button when background appears

        // Navigate to landing screen after 5 seconds
        const navigationTimer = setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            navigate('/home')
            audio.pause() // Stop the audio when navigating away
          }, 1000) // Delay navigation to allow fade-out
        }, 4000)

        return () => clearTimeout(navigationTimer)
      }, 2500)

      return () => clearTimeout(bgTimer)
    }, 2000)

    return () => {
      clearTimeout(titleTimer)
      audio.pause() // Ensure audio stops if component unmounts
    }
  }, [])

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center w-full h-screen bg-black overflow-hidden transition-opacity duration-1000 ${showTitle ? 'opacity-100' : 'opacity-0'}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      animate={{ opacity: fadeOut ? 0 : showTitle ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {showBackground && <BackgroundLines />}

      <div className="relative flex items-center justify-center w-full">
        <AnimatePresence>
          {showTitle && (
            <div className="relative z-10">
              <GlowingText />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <AnimatePresence>
        {showSkipButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
            className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-background-secondary/80 backdrop-blur-sm border border-border-primary rounded-lg text-foreground-secondary hover:bg-background-tertiary hover:text-foreground-primary transition-all duration-250 group"
          >
            <span className="text-sm font-medium">Saltar</span>
            <SkipForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-250" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
