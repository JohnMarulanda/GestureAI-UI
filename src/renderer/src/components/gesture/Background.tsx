import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Efecto para crear un fondo de partículas interactivas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar el tamaño del canvas
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Configuración de partículas
    const particlesArray: Particle[] = []
    const numberOfParticles = 100
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150
    }

    // Capturar posición del mouse
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x
      mouse.y = event.y
    })

    window.addEventListener('mouseout', () => {
      mouse.x = null
      mouse.y = null
    })

    // Clase para las partículas
    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 3 + 1
        this.baseX = this.x
        this.baseY = this.y
        this.density = Math.random() * 30 + 1
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
        this.opacity = Math.random() * 0.3 + 0.1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }

      update() {
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const maxDistance = mouse.radius
          const force = (maxDistance - distance) / maxDistance
          const directionX = forceDirectionX * force * this.density
          const directionY = forceDirectionY * force * this.density

          if (distance < mouse.radius) {
            this.x -= directionX
            this.y -= directionY
          } else {
            if (this.x !== this.baseX) {
              const dx = this.x - this.baseX
              this.x -= dx / 10
            }
            if (this.y !== this.baseY) {
              const dy = this.y - this.baseY
              this.y -= dy / 10
            }
          }
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX
            this.x -= dx / 20
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY
            this.y -= dy / 20
          }
        }
      }
    }

    // Inicializar partículas
    const init = () => {
      particlesArray.length = 0
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    init()

    // Animar partículas
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar conexiones entre partículas cercanas
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw()
        particlesArray[i].update()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('mousemove', (event) => {
        mouse.x = event.x
        mouse.y = event.y
      })
      window.removeEventListener('mouseout', () => {
        mouse.x = null
        mouse.y = null
      })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background-primary">
      {/* Canvas para partículas interactivas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Gradiente animado de fondo */}
      <div
        className="absolute inset-0 opacity-30 gradient-shift"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Patrón de rejilla sutil */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23FFFFFF' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Elementos decorativos flotantes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10"
        animate={{
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
          scale: [1, 1.05, 0.95, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ filter: 'blur(60px)' }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10"
        animate={{
          x: [0, -15, 15, 0],
          y: [0, 15, -15, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ filter: 'blur(70px)' }}
      />
    </div>
  )
}

export default Background
