import GestureCard from '@/components/GestureCard2'
import Background from '@/components/gesture/Background'
import { MainHeading, Subtitle } from '@renderer/components/gesture/Typography'
import { useTextSize } from '@/hooks/useTextSize'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Volume2, AppWindow, SquarePlay, Monitor, Command, Mouse, Compass, House } from 'lucide-react'
import { useState } from 'react'
import '../styles/custom-text-sizes.css'

// Datos de los gestos con información detallada
const GESTURES_DATA = [
  [
    {
      id: 1,
      name: 'Control de Volumen',
      value: 'Gesto Básico',
      icon: Volume2,
      description: 'Control intuitivo del volumen del sistema mediante gestos de mano.',
      details: {
        howTo: 'Extiende tu mano con la palma abierta y muévela horizontalmente. Desliza hacia la derecha para subir el volumen y hacia la izquierda para bajarlo.',
        features: [
          'Control preciso del volumen del sistema',
          'Ajuste gradual o rápido según la velocidad del gesto',
          'Gesto de silencio disponible con movimiento vertical'
        ],
        tips: [
          'Mantén la mano estable para mayor precisión',
          'Usa movimientos suaves para ajustes finos',
          'La distancia óptima es entre 30-60cm de la cámara'
        ]
      }
    },
    {
      id: 2,
      name: 'Control de Aplicaciones',
      value: 'Gesto Avanzado',
      icon: AppWindow,
      description: 'Abre y gestiona aplicaciones con gestos naturales de la mano.',
      details: {
        howTo: 'Realiza un movimiento circular con el dedo índice para abrir el menú de aplicaciones. Selecciona una aplicación apuntando hacia ella.',
        features: [
          'Apertura rápida de aplicaciones frecuentes',
          'Cambio entre aplicaciones abiertas',
          'Cierre de aplicaciones con gesto de barrido'
        ],
        tips: [
          'Mantén un movimiento circular constante',
          'Espera la confirmación visual antes de seleccionar',
          'Practica el gesto de cierre para mayor precisión'
        ]
      }
    },
    {
      id: 3,
      name: 'Control Multimedia',
      value: 'Gesto Multimedia',
      icon: SquarePlay,
      description: 'Controla la reproducción multimedia con gestos intuitivos.',
      details: {
        howTo: 'Usa gestos de pellizcar y expandir con el pulgar e índice para controlar la reproducción. Desliza horizontalmente para avanzar o retroceder.',
        features: [
          'Control de reproducción/pausa',
          'Avance y retroceso rápido',
          'Control de volumen integrado'
        ],
        tips: [
          'Mantén los dedos juntos para el gesto de pellizco',
          'Usa movimientos fluidos para mejor respuesta',
          'Ajusta la velocidad según la distancia del gesto'
        ]
      }
    },
    {
      id: 4,
      name: 'Control del Sistema',
      value: 'Gesto Sistema',
      icon: Monitor,
      description: 'Accede y controla funciones del sistema operativo.',
      details: {
        howTo: 'Utiliza gestos específicos para acceder a funciones del sistema como brillo, notificaciones y configuraciones rápidas.',
        features: [
          'Acceso rápido a configuraciones',
          'Control de brillo y pantalla',
          'Gestión de notificaciones'
        ],
        tips: [
          'Aprende los gestos básicos primero',
          'Mantén la mano dentro del campo de visión',
          'Usa gestos precisos para mejor reconocimiento'
        ]
      }
    }
  ],
  [
    {
      id: 5,
      name: 'Atajos del Sistema',
      value: 'Gesto Atajo',
      icon: Command,
      description: 'Activa atajos y comandos rápidos del sistema con gestos.',
      details: {
        howTo: 'Realiza combinaciones de gestos predefinidos para activar atajos del sistema y funciones personalizadas.',
        features: [
          'Atajos personalizables',
          'Combinaciones de gestos',
          'Acciones rápidas del sistema'
        ],
        tips: [
          'Personaliza los atajos según tus necesidades',
          'Practica las combinaciones más usadas',
          'Mantén gestos simples para mayor eficiencia'
        ]
      }
    },
    {
      id: 6,
      name: 'Control del Mouse',
      value: 'Gesto Mouse',
      icon: Mouse,
      description: 'Controla el cursor y acciones del mouse con gestos naturales.',
      details: {
        howTo: 'Mueve tu mano en el aire para controlar el cursor. Realiza gestos específicos para clic, doble clic y arrastrar.',
        features: [
          'Control preciso del cursor',
          'Gestos para clic y arrastre',
          'Scroll y zoom integrados'
        ],
        tips: [
          'Mantén la mano estable para mejor precisión',
          'Usa movimientos suaves para el cursor',
          'Practica los gestos de clic y arrastre'
        ]
      }
    },
    {
      id: 7,
      name: 'Navegación',
      value: 'Gesto Navegación',
      icon: Compass,
      description: 'Navega entre ventanas y espacios de trabajo con gestos.',
      details: {
        howTo: 'Utiliza gestos de deslizamiento y rotación para cambiar entre ventanas y espacios de trabajo.',
        features: [
          'Cambio rápido entre ventanas',
          'Gestión de espacios de trabajo',
          'Vista de todas las ventanas'
        ],
        tips: [
          'Usa gestos amplios para cambios rápidos',
          'Mantén un ritmo constante en los gestos',
          'Aprende las transiciones entre espacios'
        ]
      }
    },
    {
      id: 8,
      name: 'Inicio Rápido',
      value: 'Gesto Inicio',
      icon: House,
      description: 'Accede rápidamente a funciones principales del sistema.',
      details: {
        howTo: 'Realiza un gesto de "casa" con la mano para acceder al menú de inicio y funciones principales.',
        features: [
          'Acceso al menú de inicio',
          'Vista de aplicaciones recientes',
          'Búsqueda rápida del sistema'
        ],
        tips: [
          'Mantén el gesto claro y definido',
          'Espera la confirmación visual',
          'Usa el gesto desde cualquier pantalla'
        ]
      }
    }
  ]
]

export default function InfoGestures() {
  // Hook para aplicar el tamaño de texto personalizado
  useTextSize()
  
  const [selectedGesture, setSelectedGesture] = useState(GESTURES_DATA[0][0])
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = GESTURES_DATA.length

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  return (
    <div className="relative min-h-screen supports-custom-text-size">
      <Background />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <motion.header className="mb-8 pt-4 md:pt-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 float-animation text-center">
            <MainHeading>Gestos Disponibles</MainHeading>
            <Subtitle className="text-center max-w-2xl mx-auto mt-2" secondary>
              Explora y aprende sobre los gestos que puedes utilizar para controlar tu sistema
            </Subtitle>
          </div>
        </motion.header>

        <div className="
          bg-gradient-to-br from-background-secondary/95 to-background-tertiary/95
          backdrop-blur-sm
          rounded-3xl
          p-8
          shadow-dark-xl
          border border-border-primary
          space-y-8
          relative
          overflow-hidden
        ">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-muted/5 to-transparent"
            animate={{
              x: ['-200%', '200%'],
              transition: { repeat: Infinity, duration: 5, ease: 'linear' }
            }}
          />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={handleNextPage}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  flex items-center gap-2
                  bg-gradient-to-r from-background-tertiary to-background-hover
                  text-foreground-primary
                  px-4 py-2
                  rounded-xl
                  text-sm font-medium
                  border border-border-secondary
                  shadow-dark-lg
                  transition-all duration-250
                  hover:shadow-dark-xl
                  focus:outline-none focus:ring-2 focus:ring-accent-muted
                "
              >
                Ver más gestos
                <ChevronRight className="h-4 w-4 text-foreground-secondary" />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <AnimatePresence mode="wait">
                {GESTURES_DATA[currentPage].map((gesture) => (
                  <motion.div
                    key={gesture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <GestureCard
                      gesture={gesture}
                      isSelected={selectedGesture.id === gesture.id}
                      onClick={() => setSelectedGesture(gesture)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGesture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-background-tertiary/50 to-background-hover/50 backdrop-blur-sm rounded-2xl p-6 border border-border-secondary shadow-dark-lg"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <selectedGesture.icon className="w-6 h-6 text-accent-primary" />
                        <h3 className="text-foreground-primary text-xl font-medium">{selectedGesture.name}</h3>
                      </div>
                      <p className="text-foreground-secondary text-sm">{selectedGesture.description}</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-muted/20 to-accent-primary/20 border border-accent-muted/30 text-accent-primary font-medium">
                      {selectedGesture.value}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-foreground-primary font-medium">Cómo Usar</h4>
                      <p className="text-foreground-secondary text-sm">{selectedGesture.details.howTo}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-foreground-primary font-medium">Características</h4>
                      <ul className="space-y-2">
                        {selectedGesture.details.features.map((feature, index) => (
                          <li key={index} className="text-foreground-secondary text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-foreground-primary font-medium">Consejos</h4>
                      <ul className="space-y-2">
                        {selectedGesture.details.tips.map((tip, index) => (
                          <li key={index} className="text-foreground-secondary text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-muted" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
