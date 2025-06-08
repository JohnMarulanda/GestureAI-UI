import Background from '@/components/gesture/Background'
import {
  CustomAccordion,
  CustomAccordionContent,
  CustomAccordionItem,
  CustomAccordionTrigger
} from '@/components/support/CustomAccordion'
import { CustomButton } from '@/components/support/CustomButton'
import { CustomInput } from '@/components/support/CustomInput'
import { CustomSelect } from '@/components/support/CustomSelect'
import { CustomTextarea } from '@/components/support/CustomTextarea'
import { useTextSize } from '@/hooks/useTextSize'
import EmailService from '@/services/emailService'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Copy,
  ExternalLink,
  GitFork,
  HelpCircle,
  Info,
  Mail,
  MessageSquare,
  Send,
  Star
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MainHeading, Subtitle } from '@renderer/components/gesture/Typography'
import '../styles/custom-text-sizes.css'

// Variantes de animación mejoradas con física de resorte para movimientos más naturales
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Ligeramente más rápido para mejor UX
      delayChildren: 0.1,
      when: 'beforeChildren'
    }
  }
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300, // Mayor rigidez para animaciones más rápidas
      damping: 24, // Mayor amortiguación para menos rebote
      mass: 0.9 // Masa ligeramente menor para movimientos más rápidos
    }
  },
  hover: {
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15
    }
  }
}

// Variantes para animaciones de entrada de formulario
const formItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  })
}

export default function HelpAndSupport() {
  // Hook para aplicar el tamaño de texto personalizado
  useTextSize()
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    reason: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Validar formulario cuando cambian los campos
  useEffect(() => {
    const errors: Record<string, string> = {}

    if (formState.name && formState.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (formState.email && !/^\S+@\S+\.\S+$/.test(formState.email)) {
      errors.email = 'Por favor, introduce un correo electrónico válido'
    }

    if (formState.message && formState.message.length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres'
    }

    setFormErrors(errors)
    setIsFormValid(
      Boolean(formState.name) &&
        Boolean(formState.email) &&
        Boolean(formState.reason) &&
        Boolean(formState.message) &&
        Object.keys(errors).length === 0
    )
  }, [formState])

  const handleFormChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid || isSubmitting) return

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const result = await EmailService.sendSupportEmail(formState)
      
      if (result.success) {
        setFormSubmitted(true)
        setSubmitMessage(result.message)
        // Reset after 5 seconds
        setTimeout(() => {
          setFormSubmitted(false)
          setSubmitMessage('')
          // Clear form
          setFormState({
            name: '',
            email: '',
            reason: '',
            message: ''
          })
        }, 5000)
      } else {
        setSubmitMessage(result.message)
        // Clear error message after 5 seconds
        setTimeout(() => {
          setSubmitMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Error al enviar email:', error)
      setSubmitMessage('Error al enviar el mensaje. Por favor, inténtalo más tarde.')
      setTimeout(() => {
        setSubmitMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="relative min-h-screen text-foreground-primary font-sans supports-custom-text-size">
      <Background />
      <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Sección de encabezado */}
        
       <motion.header className="mb-4 pt-4 md:pt-8" variants={itemVariants}>
          <div className="mb-8 float-animation text-center">
            <MainHeading>Ayuda y Soporte</MainHeading>

            <Subtitle className="text-center max-w-2xl mx-auto mt-2" secondary>
              Estamos aquí para ayudarte a sacar el máximo provecho de tu experiencia con el control gestual.
            </Subtitle>
          </div>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Opciones de soporte y formulario de contacto"
        >
          {/* Contact Form */}
          <motion.div
            className="col-span-1 md:col-span-2 bg-background-secondary/40 rounded-2xl p-8 shadow-dark-lg backdrop-blur-md transition-all duration-300 flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-6 text-accent-primary">
              <MessageSquare className="h-6 w-6" />
              <h2 className="text-2xl font-serif">Contactar Soporte</h2>
            </div>

            {formSubmitted ? (
              <motion.div
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                  }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                </motion.div>
                <h3 className="text-xl font-medium mb-2">¡Mensaje Enviado!</h3>
                <p className="text-foreground-secondary mb-6">
                  {submitMessage || 'Gracias por contactarnos. Te responderemos pronto.'}
                </p>
                <CustomButton variant="outline" onClick={() => setFormSubmitted(false)}>
                  Enviar Otro Mensaje
                </CustomButton>
              </motion.div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <motion.div
                  custom={0}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CustomInput
                    label="Tu Nombre"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    required
                    value={formState.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    error={formErrors.name}
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                </motion.div>

                <motion.div
                  custom={1}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CustomInput
                    label="Correo Electrónico"
                    type="email"
                    placeholder="Ingresa tu correo"
                    required
                    value={formState.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    error={formErrors.email}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                  />
                </motion.div>

                <motion.div
                  custom={2}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CustomSelect
                    label="Motivo de Contacto"
                    options={[
                      { value: 'technical', label: 'Problema Técnico' },
                      { value: 'billing', label: 'Consulta' },
                      { value: 'feature', label: 'Sugerencia' },
                      { value: 'feedback', label: 'Comentarios Generales' },
                      { value: 'other', label: 'Otro' }
                    ]}
                    placeholder="Selecciona un motivo"
                    value={formState.reason}
                    onChange={(value) => handleFormChange('reason', value)}
                    required
                  />
                </motion.div>

                <motion.div
                  custom={3}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CustomTextarea
                    label="Tu Mensaje"
                    placeholder="Por favor, describe tu problema o pregunta en detalle"
                    rows={5}
                    required
                    value={formState.message}
                    onChange={(e) => handleFormChange('message', e.target.value)}
                    maxLength={500}
                    showCharCount
                    error={formErrors.message}
                    aria-describedby={formErrors.message ? 'message-error' : undefined}
                  />
                </motion.div>

                <motion.div
                  custom={4}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-2"
                >
                  <CustomButton
                    type="submit"
                    icon={isSubmitting ? undefined : <Send className="h-4 w-4" />}
                    fullWidth
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </CustomButton>
                  
                  {submitMessage && !formSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-lg text-sm ${
                        submitMessage.includes('Error') || submitMessage.includes('error')
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}
                    >
                      {submitMessage}
                    </motion.div>
                  )}
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Top Right Tile 1 */}
          <motion.div
            className="col-span-1 bg-background-secondary/30 rounded-2xl p-6 shadow-dark-lg backdrop-blur-md flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover transition-all duration-300"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="mb-4 pb-4 border-b border-border-primary">
              <div className="flex items-center gap-3 mb-3 text-accent-primary">
                <HelpCircle className="h-5 w-5" />
                <h3 className="text-xl font-serif">¿Necesitas ayuda?</h3>
              </div>
              <p className="text-foreground-secondary text-sm">
                Estamos comprometidos a hacer que tu experiencia con nuestra aplicación sea lo más fluida posible.
              </p>
            </div>

            <div className="flex items-center gap-3 mb-4 text-accent-primary">
              <GitFork className="h-5 w-5" />
              <h3 className="text-xl font-serif">Repositorios</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground-primary mb-2">Frontend (UI)</h4>
                <p className="text-foreground-secondary text-sm mb-3">
                  Interfaz de usuario construida con React y Electron.
                </p>
                <CustomButton
                  variant="outline"
                  size="sm"
                  icon={<ExternalLink size={14} />}
                  iconPosition="right"
                  onClick={() => window.open('https://github.com/JohnMarulanda/GestureAI-UI', '_blank')}
                  aria-label="Visitar repositorio de Frontend (se abre en nueva ventana)"
                  className="w-full"
                >
                  Ver Frontend
                </CustomButton>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground-primary mb-2">Backend (API)</h4>
                <p className="text-foreground-secondary text-sm mb-3">
                  Procesamiento de gestos en Python.
                </p>
                <CustomButton
                  variant="outline"
                  size="sm"
                  icon={<ExternalLink size={14} />}
                  iconPosition="right"
                  onClick={() => window.open('https://github.com/JohnMarulanda/GestureAI-Core', '_blank')}
                  aria-label="Visitar repositorio de Backend (se abre en nueva ventana)"
                  className="w-full"
                >
                  Ver Backend
                </CustomButton>
              </div>

              <div className="pt-2 pb-4 border-b border-border-primary">
                <p className="text-foreground-secondary text-sm">
                  ¿Encontraste un error o tienes una sugerencia? ¡Contribuye al proyecto!
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground-primary mb-2">Encuesta de Usabilidad</h4>
                <p className="text-foreground-secondary text-sm mb-3">
                  ¡Ayúdanos a mejorar! Completa nuestra encuesta de usabilidad y comparte tu experiencia con GestOS.
                </p>
                <CustomButton
                  variant="outline"
                  size="sm"
                  icon={<Star size={14} />}
                  iconPosition="right"
                  onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSe-xFfvsmlu-toMN2OKWokRlKbVYD-nDxtjD9j-bCESe6djrg/viewform?usp=preview', '_blank')}
                  aria-label="Participar en la encuesta de usabilidad (se abre en nueva ventana)"
                  className="w-full"
                >
                  Participar en Encuesta
                </CustomButton>
              </div>
            </div>
          </motion.div>

          {/* Documentation */}
          <motion.div
            className="col-span-1 bg-background-secondary/30 rounded-2xl p-6 shadow-dark-lg backdrop-blur-md flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover transition-all duration-300"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-4 text-accent-primary">
              <BookOpen className="h-5 w-5" />
              <h3 className="text-xl font-serif">Documentación</h3>
            </div>
            <p className="text-foreground-secondary">
              Accede a tutoriales, guías y documentación detallada para ayudarte a sacar el máximo provecho
              de nuestra aplicación.
            </p>
            <div className="mt-auto pt-4">
              <CustomButton
                variant="outline"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                aria-label="Ver documentación"
              >
                Ver Documentación
              </CustomButton>
            </div>
          </motion.div>

          {/* Email Support */}
          <motion.div
            className="col-span-1 bg-background-secondary/30 rounded-2xl p-6 shadow-dark-lg backdrop-blur-md flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover transition-all duration-300"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-4 text-accent-primary">
              <Mail className="h-5 w-5" />
              <h3 className="text-xl font-serif">Soporte por Email</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 bg-background-primary/60 p-3 rounded-lg border border-border-primary">
              <span className="text-foreground-primary text-sm sm:text-base break-all">john.valero@correounivalle.edu.co</span>
              <EmailCopyButton
                email="john.valero@correounivalle.edu.co"
                success={copySuccess}
                onCopy={handleCopyEmail}
              />
            </div>
            <p className="text-foreground-muted text-sm mt-3">
              Normalmente respondemos en menos de 72 horas.
            </p>
          </motion.div>

          {/* Learn More */}
          <motion.div
            className="col-span-1 bg-background-secondary/30 rounded-2xl p-6 shadow-dark-lg backdrop-blur-md flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover transition-all duration-300"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-3 text-accent-primary">
              <Info className="h-5 w-5" />
              <h3 className="text-xl font-serif">Obtén soporte y aprende más</h3>
            </div>
            <p className="text-foreground-secondary">
              Descubre cómo usar el controlador gestual y desbloquea todo su potencial desde la página de inicio de presentación.
            </p>
            <div className="mt-auto pt-4">
              <CustomButton variant="secondary" aria-label="Aprende más sobre los controles gestuales">
                Aprende Más
              </CustomButton>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            className="col-span-1 md:col-span-3 bg-background-secondary/40 rounded-2xl p-8 shadow-dark-lg backdrop-blur-md border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2 text-accent-primary">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-accent-primary text-foreground-contrast rounded-full text-sm">
                ?
              </span>
              Preguntas Frecuentes
            </h3>
            <CustomAccordion type="single" collapsible className="w-full">
              {[
                {
                  q: '¿Puedo usar la aplicación gestual en múltiples dispositivos?',
                  a: '¡Pronto! Pronto sera posible esta funcionalidad para que puedas usar la aplicación en múltiples dispositivos.'
                },
                {
                  q: '¿Cómo puedo personalizar los controles gestuales?',
                  a: 'Actualmente estamos trabajando en esta funcionalidad. Quedate al pendiente de nuevas actualizaciones.'
                },
                {
                  q: '¿Qué requisitos de hardware se necesitan para un rendimiento óptimo?',
                  a: 'Para mejores resultados, recomendamos un dispositivo con al menos 4GB de RAM, un procesador moderno y una cámara con resolución mínima de 720p.'
                },
                {
                  q: '¿Mis datos están seguros al usar los controles gestuales?',
                  a: 'Sí, todo el procesamiento de gestos ocurre localmente en tu dispositivo. No almacenamos ni transmitimos los datos de tu cámara a nuestros servidores.'
                }
              ].map(({ q, a }, i) => (
                <CustomAccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-border-primary last:border-b-0"
                >
                  <CustomAccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                    {q}
                  </CustomAccordionTrigger>
                  <CustomAccordionContent className="text-foreground-secondary pb-4">
                    {a}
                  </CustomAccordionContent>
                </CustomAccordionItem>
              ))}
            </CustomAccordion>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

// Copy Email Button con animación de éxito
function EmailCopyButton({
  email,
  success,
  onCopy
}: {
  email: string
  success: boolean
  onCopy: (email: string) => void
}) {
  return (
    <CustomButton
      onClick={() => onCopy(email)}
      variant="ghost"
      className="h-8 w-8 p-0 rounded-full hover:bg-accent-primary/10"
      aria-label="Copiar dirección de correo"
    >
      {success ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <CheckCircle size={16} className="text-green-500" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <Copy size={16} className="text-accent-primary hover:text-accent-primary/80" />
        </motion.div>
      )}
    </CustomButton>
  )
}
