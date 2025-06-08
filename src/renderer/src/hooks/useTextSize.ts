import { useEffect, useState } from 'react'

interface AppSettings {
  textSize: number
  screenSize: string
  highContrast: boolean
}

export const useTextSize = () => {
  const [textSize, setTextSize] = useState<number>(16)

  // Cargar el tamaño de texto desde localStorage
  useEffect(() => {
    const loadSavedSettings = (): AppSettings => {
      const saved = localStorage.getItem('appSettings')
      if (saved) {
        return JSON.parse(saved)
      }
      return {
        textSize: 16,
        screenSize: 'standard',
        highContrast: false
      }
    }

    const settings = loadSavedSettings()
    setTextSize(settings.textSize)
    applyTextSize(settings.textSize)
  }, [])

  // Función para aplicar el tamaño de texto usando CSS custom properties
  const applyTextSize = (size: number) => {
    // Aplicar CSS custom properties al documento
    document.documentElement.style.setProperty('--custom-text-base', `${size}px`)
    document.documentElement.style.setProperty('--custom-text-sm', `${size * 0.875}px`) // 14px when base is 16px
    document.documentElement.style.setProperty('--custom-text-xs', `${size * 0.75}px`)  // 12px when base is 16px
    document.documentElement.style.setProperty('--custom-text-lg', `${size * 1.125}px`) // 18px when base is 16px
    document.documentElement.style.setProperty('--custom-text-xl', `${size * 1.25}px`)  // 20px when base is 16px
    document.documentElement.style.setProperty('--custom-text-2xl', `${size * 1.5}px`)  // 24px when base is 16px
    document.documentElement.style.setProperty('--custom-text-3xl', `${size * 1.875}px`) // 30px when base is 16px
  }

  // Función para actualizar el tamaño de texto
  const updateTextSize = (newSize: number) => {
    setTextSize(newSize)
    applyTextSize(newSize)
  }

  return {
    textSize,
    updateTextSize,
    applyTextSize
  }
} 