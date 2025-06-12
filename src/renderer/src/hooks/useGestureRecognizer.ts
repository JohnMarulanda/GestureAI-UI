import { useCallback, useEffect, useRef, useState } from 'react'
import { GestureRecognizer, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision'

export interface GestureResult {
  gesture: string
  confidence: number
  handedness: string
}

export const useGestureRecognizer = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [currentGesture, setCurrentGesture] = useState<GestureResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const lastVideoTimeRef = useRef(-1)
  const isInitializingRef = useRef(false)

  // Gestos disponibles
  const availableGestures = [
    "None", 
    "Closed_Fist", 
    "Open_Palm", 
    "Pointing_Up", 
    "Thumb_Down", 
    "Thumb_Up", 
    "Victory", 
    "ILoveYou"
  ]

  // Traducciones de los gestos
  const gestureTranslations: Record<string, string> = {
    "None": "Ninguno",
    "Closed_Fist": "Puño Cerrado",
    "Open_Palm": "Palma Abierta", 
    "Pointing_Up": "Apuntando Arriba",
    "Thumb_Down": "Pulgar Abajo",
    "Thumb_Up": "Pulgar Arriba", 
    "Victory": "Victoria",
    "ILoveYou": "Te Amo"
  }

  // Función para manejar errores de extensiones del navegador
  const suppressBrowserExtensionErrors = () => {
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (
        message.includes('message channel closed') ||
        message.includes('Extension context invalidated') ||
        message.includes('A listener indicated an asynchronous response')
      ) {
        // Suprimir estos errores de extensiones
        return
      }
      originalConsoleError.apply(console, args)
    }
  }

  // Inicializar MediaPipe con mejor manejo de errores
  const initializeGestureRecognizer = useCallback(async () => {
    if (isInitializingRef.current || isInitialized) {
      return
    }

    isInitializingRef.current = true
    
    try {
      setError(null)
      suppressBrowserExtensionErrors()
      console.log('Inicializando reconocedor de gestos...')
      
      // Timeout para evitar que la inicialización se cuelgue
      const initPromise = new Promise<GestureRecognizer>(async (resolve, reject) => {
        try {
          // Resolver el conjunto de archivos de visión
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          )

          let gestureRecognizer: GestureRecognizer
          
          // Intentar primero con el modelo de Google (más confiable)
          try {
            console.log('Cargando modelo de Google...')
            gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                delegate: "CPU" // Usar CPU por defecto para mayor compatibilidad
              },
              runningMode: "VIDEO",
              numHands: 1 // Reducir a 1 mano para mejor rendimiento
            })
            console.log('✅ Modelo de Google cargado exitosamente')
          } catch (remoteError) {
            console.warn('❌ Error cargando modelo remoto, intentando con modelo local:', remoteError)
            
            // Fallback al modelo local
            console.log('🔄 Cargando modelo local desde ./models/gesture_recognizer.task')
            gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: "./models/gesture_recognizer.task",
                delegate: "CPU"
              },
              runningMode: "VIDEO",
              numHands: 1
            })
            console.log('✅ Modelo local cargado exitosamente')
          }

          resolve(gestureRecognizer)
        } catch (err) {
          reject(err)
        }
      })

      // Timeout de 30 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout al inicializar MediaPipe')), 30000)
      })

      const gestureRecognizer = await Promise.race([initPromise, timeoutPromise])

      gestureRecognizerRef.current = gestureRecognizer
      setIsInitialized(true)
      console.log('Reconocedor de gestos inicializado correctamente')
      
    } catch (err) {
      console.error('Error inicializando el reconocedor de gestos:', err)
      setError('Error al cargar el reconocedor de gestos. Intenta recargar la página.')
    } finally {
      isInitializingRef.current = false
    }
  }, [isInitialized])

  // Procesar frame de video con mejor manejo de errores
  const processVideoFrame = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    if (!gestureRecognizerRef.current || !isRecognizing) return

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    // Validar que el video tenga dimensiones válidas
    if (!video.videoWidth || !video.videoHeight || video.videoWidth === 0 || video.videoHeight === 0) {
      // Si el video no está listo, reintentar en el próximo frame
      if (isRecognizing) {
        animationIdRef.current = requestAnimationFrame(() => 
          processVideoFrame(video, canvas)
        )
      }
      return
    }

    const nowInMs = Date.now()
    
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime
      
      try {
        // Configurar canvas ANTES de usar MediaPipe
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        const results = gestureRecognizerRef.current.recognizeForVideo(video, nowInMs)
        
        // Limpiar canvas
        canvasCtx.save()
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
        
        const drawingUtils = new DrawingUtils(canvasCtx)

        // Dibujar landmarks de las manos solo si hay resultados
        if (results.landmarks && results.landmarks.length > 0) {
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              GestureRecognizer.HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 3
              }
            )
            drawingUtils.drawLandmarks(landmarks, {
              color: "#FF0000",
              lineWidth: 2
            })
          }
        }
        
        canvasCtx.restore()

        // Procesar gestos detectados
        if (results.gestures && results.gestures.length > 0 && results.handednesses && results.handednesses.length > 0) {
          const gesture = results.gestures[0][0]
          const handedness = results.handednesses[0][0]
          
          setCurrentGesture({
            gesture: gestureTranslations[gesture.categoryName] || gesture.categoryName,
            confidence: Math.round(gesture.score * 100),
            handedness: handedness.displayName === 'Left' ? 'Izquierda' : 'Derecha'
          })
        } else {
          setCurrentGesture(null)
        }
        
      } catch (err) {
        // Solo mostrar errores que no sean de extensiones
        const errorMessage = String(err)
        if (!errorMessage.includes('message channel') && !errorMessage.includes('Extension context')) {
          console.error('Error procesando frame:', err)
        }
        // No parar el reconocimiento por un error de frame, continuar con el siguiente
      }
    }

    if (isRecognizing) {
      animationIdRef.current = requestAnimationFrame(() => 
        processVideoFrame(video, canvas)
      )
    }
  }, [isRecognizing, gestureTranslations])

  // Iniciar reconocimiento
  const startRecognition = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    if (!gestureRecognizerRef.current) {
      setError('El reconocedor no está inicializado')
      return
    }

    setIsRecognizing(true)
    setError(null)
    processVideoFrame(video, canvas)
  }, [processVideoFrame])

  // Detener reconocimiento con limpieza robusta
  const stopRecognition = useCallback(() => {
    console.log('🔴 Deteniendo reconocimiento de gestos...')
    
    try {
      // NIVEL 1: Cancelar inmediatamente cualquier animation frame pendiente
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
        console.log('🛑 Animation frame cancelado')
      }
      
      // NIVEL 2: Actualizar estados inmediatamente
      setIsRecognizing(false)
      setCurrentGesture(null)
      
      // NIVEL 3: Resetear referencias de tiempo
      lastVideoTimeRef.current = -1
      
      // NIVEL 4: Forzar una pausa en MediaPipe (importante para evitar conflictos)
      setTimeout(() => {
        // Segundo nivel de cancelación por si quedó algo pendiente
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
          animationIdRef.current = null
          console.log('🛑 Second-level animation frame cleanup')
        }
        
        // Forzar estados una vez más para asegurar
        setIsRecognizing(false)
        setCurrentGesture(null)
        
        console.log('🔄 Limpieza de segundo nivel completada')
      }, 100)
      
      // NIVEL 5: Limpieza tardía para asegurar que MediaPipe se libere completamente
      setTimeout(() => {
        setIsRecognizing(false)
        console.log('🧹 Limpieza final de reconocimiento completada')
      }, 300)
      
      console.log('✅ Reconocimiento detenido correctamente')
      
    } catch (error) {
      console.error('❌ Error durante stopRecognition:', error)
      // Incluso si hay error, forzar la limpieza
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
      setIsRecognizing(false)
      setCurrentGesture(null)
    }
  }, [])

  // Función de limpieza forzada para casos de emergencia
  const forceCleanup = useCallback(() => {
    console.log('🚨 FORZANDO limpieza completa del reconocedor')
    
    // Detener reconocimiento
    stopRecognition()
    
    // Intentar cerrar el reconocedor si existe
    if (gestureRecognizerRef.current) {
      try {
        gestureRecognizerRef.current.close?.()
        console.log('🛑 Reconocedor MediaPipe cerrado')
      } catch (err) {
        console.warn('⚠️ Error cerrando reconocedor:', err)
      }
      gestureRecognizerRef.current = null
    }
    
    // Resetear estado de inicialización para permitir reinicio
    setIsInitialized(false)
    setError(null)
    isInitializingRef.current = false
    
    console.log('✅ LIMPIEZA FORZADA completada')
  }, [stopRecognition])

  // Limpiar recursos
  useEffect(() => {
    return () => {
      stopRecognition()
      if (gestureRecognizerRef.current) {
        try {
          gestureRecognizerRef.current.close?.()
        } catch (err) {
          // Ignorar errores de limpieza
        }
      }
    }
  }, [stopRecognition])

  return {
    isInitialized,
    isRecognizing,
    currentGesture,
    error,
    availableGestures,
    gestureTranslations,
    initializeGestureRecognizer,
    startRecognition,
    stopRecognition,
    forceCleanup
  }
} 