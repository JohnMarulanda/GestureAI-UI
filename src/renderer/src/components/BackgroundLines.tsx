import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function BackgroundLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 50

    class Particle {
      x: number
      y: number
      dirX: number
      dirY: number
      size: number
      color: string
      speed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.dirX = (Math.random() - 0.5) * 2
        this.dirY = (Math.random() - 0.5) * 2
        this.size = Math.random() * 1.5 + 0.5 // Slightly smaller particles

        // Use white to cyan color palette
        const blueValue = Math.floor(Math.random() * 55 + 200) // 200-255 range for blue
        this.color = `rgba(255, 255, ${blueValue}, ${Math.random() * 0.4 + 0.3})` // More white/cyan colors

        this.speed = Math.random() * 0.4 + 0.1 // Slightly slower for subtlety
      }

      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.dirX = -this.dirX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.dirY = -this.dirY
        }

        this.x += this.dirX * this.speed
        this.y += this.dirY * this.speed
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            if (!ctx) return
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 150)})` // White lines with lower opacity
            ctx.lineWidth = 0.4 // Thinner lines
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      requestAnimationFrame(animate)
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      connectParticles()
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </motion.div>
  )
}
