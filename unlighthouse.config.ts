import { defineConfig } from 'unlighthouse'

export default defineConfig({
  site: 'http://localhost:5174',
  scanner: {
    maxRoutes: 100,
    throttle: false,
    device: 'desktop',
    // Forzar el escaneo de todas las rutas especificadas
    routePatterns: [
      '/',
      '/home',
      '/detection-test', 
      '/detection-info',
      '/settings',
      '/help'
    ],
    // Incluir todas las rutas conocidas
    include: [
      '/',
      '/home',
      '/detection-test', 
      '/detection-info',
      '/settings',
      '/help'
    ]
  },
  // Habilitar debug para ver más información
  debug: true,
  // Configuración de cache para mejorar el rendimiento
  cache: true,
  // Forzar el escaneo aunque haya errores
  skipJsErrors: true
})
