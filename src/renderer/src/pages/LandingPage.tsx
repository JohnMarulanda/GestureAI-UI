'use client'

import { motion } from 'framer-motion'
import { Cpu, Eye, Hand, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GestureShape({
  className = '',
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-cyan-500/[0.15]'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 }
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-cyan-400/[0.25] shadow-[0_8px_32px_0_rgba(6,182,212,0.15)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  )
}

function HandTracker({ className = '' }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({ x: 30 + Math.random() * 40, y: 40 + Math.random() * 20 })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{ left: `${position.x}%`, top: `${position.y}%` }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <Hand className="w-8 h-8 text-cyan-400" />
        <motion.div
          className="absolute -inset-4 rounded-full border-2 border-cyan-400/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}

function StatusIndicator() {
  const [status, setStatus] = useState('Initializing...')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const statuses = [
      'Initializing...',
      'Calibrating sensors...',
      'Ready for gestures',
      'Tracking active'
    ]
    let index = 0
    const interval = setInterval(() => {
      setStatus(statuses[index])
      setIsActive(index >= 2)
      index = (index + 1) % statuses.length
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-cyan-400/20 backdrop-blur-sm"
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-yellow-400'}`}
        animate={isActive ? { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
      />
      <span className="text-sm text-cyan-100 font-mono">{status}</span>
    </motion.div>
  )
}

export default function LandingPage2() {
  const [gestureCount, setGestureCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const navigate = useNavigate()

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] }
    })
  }

  const handleRun = () => {
    setIsRunning(true)
    setGestureCount((prev) => prev + 1)
    window.electron.ipcRenderer.send('open-control-panel')
    setTimeout(() => setIsRunning(false), 3000)
  }

  const handleTest = () => {
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
      navigate('/detection-test')
    }, 1000)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-transparent to-blue-500/[0.08] blur-3xl" />
      <HandTracker className="z-20" />

      <div className="absolute inset-0 overflow-hidden">
        <GestureShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-cyan-500/[0.2]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <GestureShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-blue-500/[0.2]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <GestureShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-teal-500/[0.2]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <GestureShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-cyan-400/[0.2]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <GestureShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-blue-400/[0.2]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/[0.1] border border-cyan-400/[0.3] mb-8 md:mb-12"
          >
            <Eye className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-cyan-100 tracking-wider font-semibold">GestOS</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Natural
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300">
                Interaction
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-cyan-100/60 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
              Experience the future of human-computer interaction through real-time gesture
              recognition. GestOS transforms natural movements into seamless digital commands.
            </p>
          </motion.div>

          <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-cyan-200/80">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium">Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-200/80">
                <Hand className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium">Gesture Recognition</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-200/80">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium">Computer Vision</span>
              </div>
            </div>
          </motion.div>

          <motion.div custom={4} variants={fadeUpVariants} initial="hidden" animate="visible">
            <StatusIndicator />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="relative z-10 pb-8 flex gap-6"
      >
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isRunning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="flex items-center gap-2"
            >
              <Cpu className="w-5 h-5" /> Running...
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" /> Run
            </div>
          )}
        </button>

        <button
          onClick={handleTest}
          disabled={isTesting}
          className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-cyan-400/50 text-cyan-100 hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isTesting ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <Eye className="w-5 h-5" /> Testing...
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5" /> Test
            </div>
          )}
        </button>
      </motion.div>

      {gestureCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30"
        >
          <span className="text-cyan-100 text-sm font-semibold">Gestures: {gestureCount}</span>
        </motion.div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80 pointer-events-none" />
    </div>
  )
}
