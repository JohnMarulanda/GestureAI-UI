'use client'

import Background from '@/components/gesture/Background'
import { Button } from '@/components/settings/button'
import { Card } from '@/components/settings/card'
import { Dropdown, DropdownItem } from '@/components/settings/dropdown'
import { Separator } from '@/components/settings/separator'
import { Slider } from '@/components/settings/slider'
import { Switch } from '@/components/settings/switch'
import {
  Bell,
  ChevronDown,
  Eye,
  Globe,
  Keyboard,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  Volume2,
  Zap
} from 'lucide-react'
import { useState } from 'react'

export default function SettingsInterface() {
  const [language, setLanguage] = useState('English')
  const [theme, setTheme] = useState('dark')
  const [textSize, setTextSize] = useState(16)
  const [screenSize, setScreenSize] = useState('standard')

  // Dropdown states
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [screenSizeDropdownOpen, setScreenSizeDropdownOpen] = useState(false)

  // Toggle states
  const [notifications, setNotifications] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [keyboardNav, setKeyboardNav] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [disableAnimations, setDisableAnimations] = useState(false)

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">General Settings</h1>

        {/* Main Settings Card with Architecture Imagery */}
        <Card className="mb-8 overflow-hidden transition-all duration-300 hover:shadow-zinc-800/30">
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
              <div className="absolute inset-0 opacity-40">
                <svg
                  viewBox="0 0 400 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                >
                  {/* Abstract Architecture Elements */}
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.2 }} />
                    </linearGradient>
                  </defs>

                  {/* Building structures */}
                  <rect x="50" y="80" width="60" height="120" fill="url(#grad1)" opacity="0.6" />
                  <rect x="120" y="60" width="40" height="140" fill="url(#grad1)" opacity="0.4" />
                  <rect x="170" y="90" width="50" height="110" fill="url(#grad1)" opacity="0.5" />
                  <rect x="230" y="70" width="35" height="130" fill="url(#grad1)" opacity="0.3" />

                  {/* Geometric patterns */}
                  <polygon points="280,50 320,80 280,110 240,80" fill="white" opacity="0.3" />
                  <circle
                    cx="340"
                    cy="80"
                    r="25"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.4"
                  />

                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1="150"
                    x2="400"
                    y2="150"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="400"
                    y2="100"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.15"
                  />

                  {/* Connecting lines */}
                  <path
                    d="M0,180 Q100,160 200,170 T400,160"
                    stroke="white"
                    fill="none"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-3xl font-bold text-white">Customize Your Experience</h2>
              <p className="mt-2 text-lg text-zinc-300">
                Tailor the interface to your preferences and needs
              </p>
            </div>
          </div>

          <div className="space-y-8 p-8">
            {/* Themes & Languages Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Themes & Languages</h3>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Theme Preference</span>
                    </div>
                    <Dropdown
                      isOpen={themeDropdownOpen}
                      onToggle={() => setThemeDropdownOpen(!themeDropdownOpen)}
                      trigger={
                        <Button variant="outline">
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}{' '}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      }
                    >
                      {['light', 'dark'].map((t) => (
                        <DropdownItem
                          key={t}
                          onClick={() => {
                            setTheme(t)
                            setThemeDropdownOpen(false)
                          }}
                          isSelected={theme === t}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Choose between light and dark interface themes
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Language Selection</span>
                    </div>
                    <Dropdown
                      isOpen={languageDropdownOpen}
                      onToggle={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                      trigger={
                        <Button variant="outline">
                          {language} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      }
                    >
                      {['English', 'Spanish'].map((lang) => (
                        <DropdownItem
                          key={lang}
                          onClick={() => {
                            setLanguage(lang)
                            setLanguageDropdownOpen(false)
                          }}
                          isSelected={language === lang}
                        >
                          {lang}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>
                  <p className="text-sm text-zinc-400">Select your preferred interface language</p>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Notifications</h3>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Notification Preferences</span>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <p className="text-sm text-zinc-400">
                    {notifications ? 'Notifications are enabled' : 'Notifications are disabled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Accessibility Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Accessibility</h3>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Text Size</span>
                    </div>
                    <span className="text-sm text-zinc-400">{textSize}px</span>
                  </div>
                  <Slider
                    value={[textSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={setTextSize}
                    className="py-2"
                  />
                  <p className="text-sm text-zinc-400">
                    Adjust the text size for better readability
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sun className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">High Contrast Mode</span>
                    </div>
                    <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                  </div>
                  <p className="text-sm text-zinc-400">
                    {highContrast
                      ? 'High contrast mode is enabled'
                      : 'High contrast mode is disabled'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Keyboard className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Keyboard Navigation</span>
                    </div>
                    <Switch checked={keyboardNav} onCheckedChange={setKeyboardNav} />
                  </div>
                  <p className="text-sm text-zinc-400">
                    {keyboardNav
                      ? 'Keyboard navigation is enabled'
                      : 'Keyboard navigation is disabled'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Screen Reader Support</span>
                    </div>
                    <Switch checked={screenReader} onCheckedChange={setScreenReader} />
                  </div>
                  <p className="text-sm text-zinc-400">
                    {screenReader
                      ? 'Screen reader support is enabled'
                      : 'Screen reader support is disabled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Advanced</h3>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Screen Size Setting</span>
                    </div>
                    <Dropdown
                      isOpen={screenSizeDropdownOpen}
                      onToggle={() => setScreenSizeDropdownOpen(!screenSizeDropdownOpen)}
                      trigger={
                        <Button variant="outline">
                          {screenSize.charAt(0).toUpperCase() + screenSize.slice(1)}{' '}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      }
                    >
                      {['compact', 'standard', 'wide'].map((size) => (
                        <DropdownItem
                          key={size}
                          onClick={() => {
                            setScreenSize(size)
                            setScreenSizeDropdownOpen(false)
                          }}
                          isSelected={screenSize === size}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Choose your preferred screen layout density
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-white">Disable Animations</span>
                    </div>
                    <Switch checked={disableAnimations} onCheckedChange={setDisableAnimations} />
                  </div>
                  <p className="text-sm text-zinc-400">
                    {disableAnimations ? 'Animations are disabled' : 'Animations are enabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
