import { Button } from '@/components/settings/button'
import { Slider } from '@/components/settings/slider'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'

type GestureConfigPanelProps = {
  gesture: {
    id: number
    name: string
    value: string
    image: string
    description: string
    settings: string[]
  }
}

export default function GestureConfigPanel({ gesture }: GestureConfigPanelProps) {
  return (
    <div
      className="
      relative
      bg-gradient-to-br from-background-tertiary/50 to-background-hover/50
      backdrop-blur-sm
      rounded-2xl
      p-6
      border border-border-secondary
      shadow-dark-lg
      overflow-hidden
    "
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-muted/5 to-transparent"
        animate={{
          x: ['-200%', '200%'],
          transition: { repeat: Infinity, duration: 4, ease: 'linear' }
        }}
      />

      <div className="relative z-10 space-y-6">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h3 className="text-foreground-primary text-xl font-medium mb-2">{gesture.name}</h3>
            <p className="text-foreground-secondary text-sm">{gesture.description}</p>
          </div>

          <div
            className="
            px-4
            py-2
            rounded-xl
            bg-gradient-to-r from-accent-muted/20 to-accent-primary/20
            border border-accent-muted/30
            text-accent-primary
            font-medium
          "
          >
            {gesture.value}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gesture.settings.map((setting, index) => (
            <motion.div
              key={setting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="
                bg-gradient-to-br from-background-secondary/80 to-background-tertiary/80
                backdrop-blur-sm
                rounded-xl
                p-4
                border border-border-primary
                shadow-dark-md
              "
            >
              <label
                htmlFor={`setting-${index}`}
                className="block text-foreground-primary text-sm font-medium mb-3"
              >
                {setting}
              </label>
              <Slider
                value={[50]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => console.log(value)}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              className="
                bg-gradient-to-r from-accent-primary to-accent-hover
                text-white
                font-medium
                px-6
                py-2
                rounded-xl
                shadow-dark-lg
                hover:shadow-dark-xl
                transition-all duration-300
                flex items-center gap-2
              "
              onClick={() => console.log('Saving changes...')}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
