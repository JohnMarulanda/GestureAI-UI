import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Select } from '../components/form/Select';
import { Toggle } from '../components/form/Toggle';
import { Slider } from '../components/form/Slider';

export default function Settings() {
  // State for all settings
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('US');
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true
  });
  const [accessibility, setAccessibility] = useState({
    fontSize: [16],
    highContrast: false,
    reduceMotion: false,
    screenReader: false
  });

  const handleSave = () => {
    // TODO: Implement settings save logic
    console.log('Saving settings...');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        <h1 className="text-4xl font-bold">Settings</h1>

        {/* Language & Region */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-purple-400">Language & Region</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </Select>

            <Select
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="US">United States</option>
              <option value="CO">Colombia</option>
              <option value="ES">Spain</option>
            </Select>
          </div>
        </section>

        {/* Theme */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-purple-400">Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['light', 'dark', 'system', 'high-contrast'].map((themeOption) => (
              <motion.button
                key={themeOption}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(themeOption)}
                className={`
                  p-4 rounded-lg border-2 transition-colors
                  ${theme === themeOption
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }
                `}
              >
                <span className="capitalize">{themeOption}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-purple-400">Notifications</h2>
          <div className="space-y-4">
            <Toggle
              label="Enable Notifications"
              checked={notifications.enabled}
              onChange={(checked) =>
                setNotifications((prev) => ({ ...prev, enabled: checked }))
              }
            />
            <Toggle
              label="Sound Alerts"
              checked={notifications.sound}
              onChange={(checked) =>
                setNotifications((prev) => ({ ...prev, sound: checked }))
              }
              disabled={!notifications.enabled}
            />
            <Toggle
              label="Vibration Feedback"
              checked={notifications.vibration}
              onChange={(checked) =>
                setNotifications((prev) => ({ ...prev, vibration: checked }))
              }
              disabled={!notifications.enabled}
            />
            <Toggle
              label="Desktop Pop-ups"
              checked={notifications.desktop}
              onChange={(checked) =>
                setNotifications((prev) => ({ ...prev, desktop: checked }))
              }
              disabled={!notifications.enabled}
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-purple-400">Accessibility</h2>
          <div className="space-y-6">
            <Slider
              label="Font Size"
              value={accessibility.fontSize}
              onValueChange={(value) =>
                setAccessibility((prev) => ({ ...prev, fontSize: value }))
              }
              min={12}
              max={24}
              step={2}
              marks={[
                { value: 12, label: 'S' },
                { value: 16, label: 'M' },
                { value: 20, label: 'L' },
                { value: 24, label: 'XL' }
              ]}
            />
            <Toggle
              label="High Contrast Mode"
              checked={accessibility.highContrast}
              onChange={(checked) =>
                setAccessibility((prev) => ({ ...prev, highContrast: checked }))
              }
              description="Increase contrast for better visibility"
            />
            <Toggle
              label="Reduce Motion"
              checked={accessibility.reduceMotion}
              onChange={(checked) =>
                setAccessibility((prev) => ({ ...prev, reduceMotion: checked }))
              }
              description="Minimize animations and transitions"
            />
            <Toggle
              label="Screen Reader Mode"
              checked={accessibility.screenReader}
              onChange={(checked) =>
                setAccessibility((prev) => ({ ...prev, screenReader: checked }))
              }
              description="Optimize for screen readers"
            />
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-6">
          <Button
            size="lg"
            onClick={handleSave}
            className="w-full md:w-auto"
          >
            Save Settings
          </Button>
        </div>
      </motion.div>
    </div>
  );
}