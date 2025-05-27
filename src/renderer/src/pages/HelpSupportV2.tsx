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
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Copy,
  ExternalLink,
  Github,
  HelpCircle,
  Info,
  Mail,
  MessageSquare,
  Send,
  Star
} from 'lucide-react'
import { useEffect, useState } from 'react'

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

  // Validar formulario cuando cambian los campos
  useEffect(() => {
    const errors: Record<string, string> = {}

    if (formState.name && formState.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (formState.email && !/^\S+@\S+\.\S+$/.test(formState.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (formState.message && formState.message.length < 10) {
      errors.message = 'Message must be at least 10 characters'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    // Simulate form submission with loading state
    setTimeout(() => {
      setFormSubmitted(true)
      // Reset after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false)
        // Clear form
        setFormState({
          name: '',
          email: '',
          reason: '',
          message: ''
        })
      }, 3000)
    }, 800)
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="relative min-h-screen text-foreground-primary font-sans">
      <Background />
      <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Header con animación mejorada */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 20
          }}
        >
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 font-light tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Help and Support
          </motion.h1>
          <motion.p
            className="text-foreground-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            We're here to help you get the most out of your gesture control experience.
          </motion.p>
        </motion.header>

        {/* Bento Grid Layout con animaciones escalonadas */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Support options and contact form"
        >
          {/* Contact Form */}
          <motion.div
            className="col-span-1 md:col-span-2 bg-background-secondary/40 rounded-2xl p-8 shadow-dark-lg backdrop-blur-md transition-all duration-300 flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-6 text-accent-primary">
              <MessageSquare className="h-6 w-6" />
              <h2 className="text-2xl font-serif">Contact Support</h2>
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
                <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                <p className="text-foreground-secondary mb-6">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <CustomButton variant="outline" onClick={() => setFormSubmitted(false)}>
                  Send Another Message
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
                    label="Your Name"
                    type="text"
                    placeholder="Enter your name"
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
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
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
                    label="Reason for Contact"
                    options={[
                      { value: 'technical', label: 'Technical Issue' },
                      { value: 'billing', label: 'Billing Question' },
                      { value: 'feature', label: 'Feature Request' },
                      { value: 'feedback', label: 'General Feedback' },
                      { value: 'other', label: 'Other' }
                    ]}
                    placeholder="Select a reason"
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
                    label="Your Message"
                    placeholder="Please describe your issue or question in detail"
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
                    icon={<Send className="h-4 w-4" />}
                    fullWidth
                    disabled={!isFormValid}
                  >
                    Submit Request
                  </CustomButton>
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
                <h3 className="text-xl font-serif">Need help?</h3>
              </div>
              <p className="text-foreground-secondary text-sm">
                We're committed to making your experience with our app as smooth as possible.
              </p>
            </div>

            <div className="mt-1">
              <div className="flex items-center gap-3 mb-3 text-accent-primary">
                <Github className="h-5 w-5" />
                <h3 className="text-xl font-serif">View source code</h3>
              </div>
              <p className="text-foreground-secondary text-sm mb-3">
                Check out our GitHub repository to review the code and contribute.
              </p>
              <CustomButton
                variant="outline"
                icon={<ExternalLink size={16} />}
                iconPosition="right"
                onClick={() => window.open('https://github.com/yourusername/your-repo', '_blank')}
                aria-label="Visit GitHub repository (opens in new window)"
              >
                Visit GitHub
              </CustomButton>
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
              <h3 className="text-xl font-serif">Documentation</h3>
            </div>
            <p className="text-foreground-secondary">
              Access tutorials, guides, and detailed documentation to help you get the most out of
              our app.
            </p>
            <div className="mt-auto pt-4">
              <CustomButton
                variant="outline"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                aria-label="View documentation"
              >
                View Docs
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
              <h3 className="text-xl font-serif">Email Support</h3>
            </div>
            <div className="flex items-center justify-between bg-background-primary/60 p-3 rounded-lg border border-border-primary">
              <span className="text-foreground-primary">support@gestureapp.com</span>
              <EmailCopyButton
                email="support@gestureapp.com"
                success={copySuccess}
                onCopy={handleCopyEmail}
              />
            </div>
            <p className="text-foreground-muted text-sm mt-3">
              We typically respond within 24 hours.
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
              <h3 className="text-xl font-serif">Get support and learn more</h3>
            </div>
            <p className="text-foreground-secondary">
              Discover how to use the gesture app controller and unlock its full potential.
            </p>
            <div className="mt-auto pt-4">
              <CustomButton variant="secondary" aria-label="Learn more about gesture controls">
                Learn More
              </CustomButton>
            </div>
          </motion.div>

          {/* Featured Tutorials - Nuevo componente */}
          <motion.div
            className="col-span-1 bg-background-secondary/30 rounded-2xl p-6 shadow-dark-lg backdrop-blur-md flex flex-col border border-border-primary hover:border-accent-muted/30 hover:shadow-zinc-hover transition-all duration-300"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-4 text-accent-primary">
              <Star className="h-5 w-5" />
              <h3 className="text-xl font-serif">Featured Tutorials</h3>
            </div>
            <ul className="space-y-3 text-foreground-secondary">
              {[
                'Getting Started with Gesture Controls',
                'Advanced Gesture Customization',
                'Troubleshooting Common Issues'
              ].map((tutorial, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                  <span>{tutorial}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <CustomButton variant="outline" size="sm" aria-label="View all tutorials">
                View All
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
              Frequently Asked Questions
            </h3>
            <CustomAccordion type="single" collapsible className="w-full">
              {[
                {
                  q: 'How do I reset my password?',
                  a: "Click on 'Forgot Password' on the login page. You'll get an email with steps to reset it."
                },
                {
                  q: 'Can I use the gesture app on multiple devices?',
                  a: 'Yes! Just sign in on each device where the app is installed.'
                },
                {
                  q: 'How do I update the app to the latest version?',
                  a: 'Updates are automatic via your app store. You can also check manually in the settings menu under "Check for Updates".'
                },
                {
                  q: 'Is there a free trial available?',
                  a: 'Yes, we offer a 14-day free trial for new users with full access to all premium features.'
                },
                {
                  q: 'How can I customize gesture controls?',
                  a: 'Go to Settings > Gesture Controls > Customize to create your own gesture mappings and adjust sensitivity.'
                },
                {
                  q: 'What hardware requirements are needed for optimal performance?',
                  a: 'For best results, we recommend a device with at least 4GB RAM, a modern processor, and a camera with at least 720p resolution.'
                },
                {
                  q: 'Is my data secure when using gesture controls?',
                  a: 'Yes, all gesture processing happens locally on your device. We do not store or transmit your camera data to our servers.'
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
      className="h-8 w-8 p-0 rounded-full"
      aria-label="Copy email address"
    >
      {success ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <CheckCircle size={16} className="text-green-500" />
        </motion.div>
      ) : (
        <Copy size={16} />
      )}
    </CustomButton>
  )
}
