# GestureAI-UI

Una aplicación de escritorio moderna construida con Electron, React y TypeScript que permite el control del sistema mediante gestos utilizando la cámara.

## 🌟 Características

- 📸 Interfaz de cámara integrada para detección de gestos
- ⚡ Procesamiento en tiempo real
- 🎯 Control preciso del sistema mediante gestos
- 🎨 Interfaz de usuario moderna y responsive
- ⚙️ Panel de configuración personalizable
- 🌓 Soporte para temas claros y oscuros

## 🚀 Instalación

### Instalación rápida
1. Descarga los ejecutables precompilados desde la [carpeta de Google Drive](https://drive.google.com/drive/folders/1drqi04MM8nAxVIhdl-bsmkj3-CR4QBdK?usp=sharing)
2. Coloca los ejecutables en la carpeta `executables/` del proyecto

### Instalación desde el código fuente

```bash
# Clonar el repositorio
git clone https://github.com/JohnMarulanda/GestureAI-UI.git

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## 🛠️ Construcción del proyecto

```bash
# Para Windows
npm run build:win

# Para macOS
npm run build:mac

# Para Linux
npm run build:linux
```

## 📁 Estructura del Proyecto

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
│   └── Settings2.tsx      # Panel de configuración
└── lib/
    └── utils.ts           # Utilidades compartidas
```

## 🔧 Configuración

La aplicación utiliza un sistema de comunicación IPC (Inter-Process Communication) para la interacción entre el proceso principal y el renderer:

- Control de ventana (maximizar, minimizar, cerrar)
- Configuración de la cámara
- Gestión de gestos y acciones del sistema

## ⚠️ Nota Importante

Los ejecutables del proyecto son demasiado pesados para ser alojados en GitHub. Por favor, descárgalos desde la [carpeta de Google Drive](https://drive.google.com/drive/folders/1drqi04MM8nAxVIhdl-bsmkj3-CR4QBdK?usp=sharing) y colócalos en la carpeta `executables/` del proyecto.

## 🔜 Próximas Mejoras

- Sistema de plugins para extender funcionalidad
- Editor de temas integrado
- Configuración de atajos de teclado
- Modo offline
- Exportación/importación de configuraciones

## 🛡️ Tecnologías Utilizadas

- Electron
- React
- TypeScript
- Framer Motion (para animaciones)
- Electron Builder
- Vite

## 👨‍💻 Desarrollo

Se recomienda usar VSCode con las siguientes extensiones:
- ESLint
- Prettier

## 📄 Licencia

[MIT](LICENSE)

---
