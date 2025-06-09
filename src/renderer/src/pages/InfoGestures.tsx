import GestureCard from '@/components/GestureCard2'
import Background from '@/components/gesture/Background'
import { MainHeading, Subtitle } from '@renderer/components/gesture/Typography'
import { useTextSize } from '@/hooks/useTextSize'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Volume2, AppWindow, SquarePlay, Monitor, Command, Mouse, Compass, House } from 'lucide-react'
import { useState } from 'react'
import '../styles/custom-text-sizes.css'

// Datos de los gestos con información detallada basada en el README.md
const GESTURES_DATA = [
  [
    {
      id: 1,
      name: 'Control de Volumen 🔊',
      value: 'Gesto Básico',
      icon: Volume2,
      description: '🔊 Controla el volumen del sistema con gestos simples de mano.',
      details: {
        howTo: '🎮 Ejecuta el controlador y utiliza gestos simples: 👍 pulgar arriba para subir volumen, 👎 pulgar abajo para bajar volumen, y ✊ puño cerrado para silenciar/desilenciar.',
        features: [
          '👍 Subir volumen con gesto de pulgar arriba',
          '👎 Bajar volumen con gesto de pulgar abajo',
          '✊ Silenciar/desilenciar con gesto de mano cerrada (delay 2s)'
        ],
        tips: [
          '⚡ Cada gesto de volumen arriba/abajo cambia 3 niveles de volumen',
          '⏱️ El silenciado tiene un retraso de 2 segundos para evitar activaciones accidentales',
          '🎵 Funciona con el volumen del sistema independientemente de la aplicación en primer plano'
        ]
      }
    },
    {
      id: 2,
      name: 'Control de Aplicaciones 🖥️',
      value: 'Gesto Avanzado',
      icon: AppWindow,
      description: '🖥️ Abre y cierra aplicaciones específicas con gestos de mano.',
      details: {
        howTo: '🎮 Ejecuta el controlador y utiliza gestos específicos para abrir o cerrar aplicaciones como Chrome, Bloc de notas, Calculadora y Spotify.',
        features: [
          '✊ Mano cerrada: Abrir/cerrar Google Chrome',
          '👍 Pulgar arriba: Abrir/cerrar Bloc de notas',
          '✌️ Victoria (V): Abrir/cerrar Calculadora',
          '🤟 Te amo (🤟): Abrir/cerrar Spotify'
        ],
        tips: [
          '📹 Mantén tu mano dentro del encuadre de la cámara',
          '👐 Realiza gestos claros y definidos',
          '🔄 Si una aplicación ya está abierta, el mismo gesto la cerrará',
          '💡 Si tienes problemas para que se detecte un gesto, intenta ajustar la iluminación'
        ]
      }
    },
    {
      id: 3,
      name: 'Control Multimedia ▶️',
      value: 'Gesto Multimedia',
      icon: SquarePlay,
      description: '▶️ Controla la reproducción multimedia con gestos intuitivos.',
      details: {
        howTo: '🎮 Ejecuta el controlador y utiliza gestos para controlar la reproducción: adelantar, retroceder, cambiar pistas, reproducir/pausar y silenciar.',
        features: [
          '👍 Pulgar arriba: Adelantar / Mantener 4s para siguiente pista ⏭️',
          '👎 Pulgar abajo: Retroceder / Mantener 4s para pista anterior ⏮️',
          '✊ Mano cerrada: Silenciar/desilenciar (delay 2s) 🔇',
          '🤟 Te amo (🤟): Play/Pause (delay 2s) ⏯️'
        ],
        tips: [
          '🎵 Funciona mejor con reproductores multimedia en primer plano',
          '⏱️ Los gestos mantenidos (como pulgar arriba/abajo) mostrarán una barra de progreso',
          '⌨️ Si usas pistas con teclas multimedia, el gesto de mantener cambiará la pista completa',
          '⚠️ El delay en silenciar y play/pause evita activaciones accidentales'
        ]
      }
    },
    {
      id: 4,
      name: 'Control del Sistema 💻',
      value: 'Gesto Sistema',
      icon: Monitor,
      description: '💻 Controla funciones del sistema como apagado, reinicio y bloqueo.',
      details: {
        howTo: '🎮 Ejecuta el controlador y mantén gestos específicos durante 3 segundos para activar funciones del sistema como bloquear, suspender, apagar o reiniciar.',
        features: [
          '✌️ Victoria (V) (mantener 3s): Bloquear PC 🔒',
          '🖐️ Mano abierta (mantener 3s): Suspender PC 😴',
          '✊ Puño cerrado (mantener 3s): Apagar PC 🔌',
          '🤟 Te amo (🤟) (mantener 3s): Reiniciar PC 🔄'
        ],
        tips: [
          '✅ Este controlador incluye una confirmación adicional para evitar acciones accidentales',
          '⚠️ Usa con precaución, especialmente las funciones de apagado y reinicio',
          '⏱️ Debes mantener el gesto durante el tiempo indicado para que se active',
          '📊 Se mostrará una barra de progreso mientras mantienes el gesto'
        ]
      }
    }
  ],
  [
    {
      id: 5,
      name: 'Control de Atajos ⌨️',
      value: 'Gesto Atajo',
      icon: Command,
      description: '⌨️ Ejecuta atajos de teclado comunes con gestos de mano.',
      details: {
        howTo: '🎮 Ejecuta el controlador y utiliza gestos específicos para activar atajos de teclado como copiar, pegar, deshacer, rehacer y guardar.',
        features: [
          '✌️ Victoria (V): Copiar (Ctrl+C) 📋',
          '🖐️ Mano abierta: Pegar (Ctrl+V) 📄',
          '✊ Puño cerrado: Tecla Escape ❌',
          '👍 Pulgar arriba: Deshacer (Ctrl+Z) ↩️',
          '👎 Pulgar abajo: Rehacer (Ctrl+Y) ↪️',
          '🤟 Te amo (🤟): Guardar (Ctrl+S) 💾'
        ],
        tips: [
          '📝 Ideal para uso en editores de texto y aplicaciones creativas',
          '🖥️ Mantén la aplicación de destino en primer plano',
          '⏱️ Espera al menos 0.8 segundos entre atajos para que funcionen correctamente',
          '⚠️ Si el gesto no funciona, asegúrate de que la aplicación soporte el atajo correspondiente'
        ]
      }
    },
    {
      id: 6,
      name: 'Control del Mouse 🖱️',
      value: 'Gesto Mouse',
      icon: Mouse,
      description: '🖱️ Controla el cursor y realiza acciones de clic con gestos de mano.',
      details: {
        howTo: '🎮 Ejecuta el controlador y utiliza la mano derecha para mover el cursor y realizar acciones como clic izquierdo, doble clic, clic derecho y arrastrar.',
        features: [
          '👌 Pulgar + Índice extendidos: Mover el cursor 🔄',
          '☝️👍 Pulgar + Índice + Medio extendidos: Doble clic izquierdo ⏩',
          '🖖 Pulgar + Índice + Medio + Anular extendidos: Clic derecho 📋',
          '🖐️ Cuatro dedos sin pulgar (palma): Arrastrar elementos ✋'
        ],
        tips: [
          '🟣 Mantén la mano dentro del área de control (rectángulo morado)',
          '🎯 Realiza movimientos suaves para mayor precisión',
          '🔴 El controlador solo reconoce la mano derecha (se mostrará en rojo si usa la izquierda)',
          '⏱️ Intenta mantener el gesto por al menos 0.5 segundos para que se active'
        ]
      }
    },
    {
      id: 7,
      name: 'Control de Navegación 🪟',
      value: 'Gesto Navegación',
      icon: Compass,
      description: '🪟 Controla las ventanas del sistema con gestos de mano.',
      details: {
        howTo: '🎮 Ejecuta el controlador y utiliza gestos específicos para controlar las ventanas: vista de tareas, minimizar, maximizar y cerrar ventanas.',
        features: [
          '✌️ Victoria (V): Activar vista de tareas (Win+Tab) 📑',
          '🤟 Te amo (🤟): Minimizar ventana actual (Win+Down) ⬇️',
          '✊ Puño cerrado: Maximizar ventana actual (Win+Up) ⬆️',
          '🖐️ Mano abierta: Cerrar ventana actual (Alt+F4) ❌'
        ],
        tips: [
          '⚠️ Ten cuidado con el gesto de cerrar ventana, podría cerrar trabajos no guardados',
          '⏱️ Cada acción tiene un retraso de 1 segundo para evitar repeticiones accidentales',
          '👐 Realiza gestos claros y bien definidos para mayor precisión',
          '📊 La función de vista de tareas es útil para cambiar entre aplicaciones'
        ]
      }
    },
    {
      id: 8,
      name: 'Gestos Comunes 🔄',
      value: 'Gesto Universal',
      icon: House,
      description: '🔄 Gestos comunes a todos los controladores para salir o cerrar.',
      details: {
        howTo: '🎮 Estos gestos funcionan en todos los controladores y te permiten salir o cerrar el controlador actual de forma rápida.',
        features: [
          '☝️ Dedo índice arriba (mantener 3s): Cierra el controlador actual ❌',
          '⌨️ Tecla ESC: Salir del controlador 🚪',
          '🔄 Funciona en todos los modos de control',
          '✅ Proporciona una forma consistente de salir'
        ],
        tips: [
          '⏱️ Mantén el dedo índice arriba durante al menos 3 segundos para cerrar',
          '⚡ La tecla ESC es la forma más rápida de salir',
          '🔄 Estos gestos son universales en todos los controladores',
          '🔀 Útil cuando necesitas cambiar rápidamente entre controladores'
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
