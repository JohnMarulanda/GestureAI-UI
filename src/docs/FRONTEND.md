# GestureAI-UI Frontend Documentation

## Descripción General

GestureAI-UI es una aplicación de escritorio construida con Electron que proporciona una interfaz moderna y accesible para el reconocimiento de gestos. El frontend está desarrollado con React, TypeScript y TailwindCSS, ofreciendo una experiencia de usuario fluida y personalizable.

## Arquitectura del Frontend

### Stack Tecnológico

- **Electron**: Runtime de aplicación de escritorio
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **TailwindCSS**: Framework de CSS utility-first
- **Vite**: Herramienta de construcción y desarrollo
- **Framer Motion**: Biblioteca de animaciones
- **Lucide React**: Iconografía moderna
- **shadcn/ui**: Componentes de UI reutilizables

### Estructura del Proyecto

```
src/renderer/src/
├── components/
│   ├── gesture/           # Componentes relacionados con gestos
│   │   ├── Background.tsx
│   │   ├── CameraInterface.tsx
│   │   └── MacWindow.tsx
│   └── settings/          # Componentes de configuración
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown.tsx
│       ├── separator.tsx
│       ├── slider.tsx
│       └── switch.tsx
├── pages/
│   ├── LandingPage.tsx    # Página principal
│   └── Settings2.tsx     # Panel de configuración
└── lib/
    └── utils.ts           # Utilidades compartidas
```

## Componentes Principales

### 1. LandingPage.tsx

**Propósito**: Página principal de la aplicación que muestra el estado del sistema y controles principales.

**Características**:

- Diseño moderno con gradientes y efectos visuales
- Indicadores de estado en tiempo real
- Botones de acción principales
- Integración con el sistema de gestos
- Tema consistente con variables CSS personalizadas

**Elementos clave**:

- StatusIndicator: Muestra el estado de conexión
- Botones de control: Iniciar/detener reconocimiento
- Información del sistema
- Navegación a configuraciones

### 2. Settings2.tsx

**Propósito**: Panel de configuración completo con múltiples categorías de ajustes.

**Secciones**:

- **Temas y Idiomas**: Selección de tema (claro/oscuro) e idioma
- **Notificaciones**: Control de alertas del sistema
- **Accesibilidad**: Ajustes para usuarios con necesidades especiales
- **Avanzado**: Configuraciones técnicas y de rendimiento

**Funcionalidades implementadas**:

- Ajuste dinámico del tamaño de ventana
- Persistencia de configuraciones
- Interfaz accesible con ARIA labels
- Validación en tiempo real

### 3. CameraInterface.tsx

**Propósito**: Interfaz para la visualización y control de la cámara.

**Características**:

- Contenedor responsivo con tamaño ajustable
- Animaciones suaves con Framer Motion
- Integración con el sistema de captura de gestos
- Diseño adaptativo para diferentes resoluciones

## Sistema de Componentes UI

### Componentes Reutilizables

#### Button

- Variantes: `default`, `outline`, `ghost`
- Estados: hover, focus, disabled
- Accesibilidad completa

#### Dropdown

- Posicionamiento inteligente (arriba/abajo)
- Selección múltiple y simple
- Indicadores visuales de selección
- Navegación por teclado

#### Switch

- Estados on/off con animaciones
- Etiquetas descriptivas
- Soporte para screen readers

#### Slider

- Rangos personalizables
- Valores en tiempo real
- Indicadores visuales

## Comunicación IPC (Inter-Process Communication)

### Eventos Implementados

#### Desde Renderer a Main

```typescript
// Actualizar tamaño de ventana
window.electron.ipcRenderer.send('update-window-size', {
  width: 1920,
  height: 1080
})

// Abrir panel de control
window.electron.ipcRenderer.send('open-control-panel')

// Cerrar ventana
window.electron.ipcRenderer.send('close-window')

// Minimizar ventana
window.electron.ipcRenderer.send('minimize-window')
```

#### Manejadores en Main Process

```typescript
// Ajuste dinámico de ventana
ipcMain.on('update-window-size', (_, dimensions) => {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    mainWindow.setSize(dimensions.width, dimensions.height)
    mainWindow.center()
  }
})

// Gestión de ventanas secundarias
ipcMain.on('open-control-panel', () => {
  // Crear ventana de panel de control
})
```

### Flujo de Datos

1. **Usuario interactúa** con componente UI
2. **Componente React** procesa la acción
3. **IPC message** se envía al proceso principal
4. **Main process** ejecuta la acción del sistema
5. **Respuesta** (si es necesaria) vuelve al renderer

## Sistema de Temas

### Variables CSS Personalizadas

```css
:root {
  --background-primary: #0a0a0a;
  --background-secondary: #1a1a1a;
  --background-hover: #2a2a2a;
  --foreground-primary: #ffffff;
  --foreground-secondary: #a1a1aa;
  --accent-muted: #06b6d4;
  --accent-hover: #0891b2;
}
```

### Implementación en Componentes

- Uso consistente de variables de tema
- Soporte para modo claro/oscuro
- Transiciones suaves entre temas
- Accesibilidad de contraste

## Características de Accesibilidad

### Implementaciones

- **Navegación por teclado**: Todos los componentes son navegables
- **Screen readers**: ARIA labels y roles apropiados
- **Alto contraste**: Modo de contraste mejorado
- **Tamaño de texto**: Ajustable desde 12px a 24px
- **Reducción de movimiento**: Opción para deshabilitar animaciones

### Estándares Cumplidos

- WCAG 2.1 AA compliance
- Semantic HTML structure
- Focus management
- Color contrast ratios

## Gestión de Estado

### Estado Local (useState)

```typescript
// Configuraciones de usuario
const [language, setLanguage] = useState('English')
const [theme, setTheme] = useState('dark')
const [screenSize, setScreenSize] = useState('standard')

// Estados de UI
const [dropdownOpen, setDropdownOpen] = useState(false)
const [notifications, setNotifications] = useState(true)
```

### Persistencia

- Configuraciones guardadas en localStorage
- Sincronización con el proceso principal
- Restauración automática al iniciar

## Animaciones y Transiciones

### Framer Motion

```typescript
// Animaciones de entrada
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// Transiciones de estado
const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}
```

### Principios de Diseño

- Animaciones sutiles y funcionales
- Duración apropiada (200-500ms)
- Easing natural
- Respeto por preferencias de accesibilidad

## Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Estrategias

- Mobile-first approach
- Flexible grid systems
- Adaptive component sizing
- Touch-friendly interactions

## Optimización de Rendimiento

### Técnicas Implementadas

- **Lazy loading** de componentes
- **Memoización** con React.memo
- **Debouncing** en inputs
- **Optimización de re-renders**

### Métricas

- Tiempo de carga inicial: < 2s
- First Contentful Paint: < 1s
- Smooth 60fps animations
- Memory usage optimizado

## Próximas Mejoras

### Funcionalidades Planificadas

1. **Sistema de plugins**: Arquitectura extensible
2. **Temas personalizados**: Editor de temas integrado
3. **Shortcuts de teclado**: Configuración personalizable
4. **Modo offline**: Funcionalidad sin conexión
5. **Exportación de configuraciones**: Backup y restore

### Mejoras Técnicas

1. **Testing**: Implementación de tests unitarios
2. **Storybook**: Documentación de componentes
3. **Performance monitoring**: Métricas en tiempo real
4. **Error boundaries**: Manejo robusto de errores

---

_Documentación actualizada: Diciembre 2024_
_Versión del frontend: 1.0.0_
