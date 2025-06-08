import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { execFile, ChildProcess } from 'child_process'
import icon from '../../resources/Icono.ico?asset'
import { initializeEmailService, getEmailService, EmailData } from './services/emailService'

// Mapa para rastrear procesos ejecutables activos
const activeProcesses = new Map<string, ChildProcess>()

// Variable para rastrear la ventana de control
let controlPanelWindow: BrowserWindow | null = null

// Variable para rastrear la ventana principal
let mainWindow: BrowserWindow | null = null

// Mapeo de ejecutables disponibles
const executables = {
  'gestos-volumen': 'GestOS Volumen.exe',
  'gestos-aplicaciones': 'GestOS App.exe',
  'gestos-multimedia': 'GestOS Multimedia.exe',
  'gestos-sistema': 'GestOS Sistema.exe',
  'gestos-atajos': 'GestOS Atajos.exe',
  'gestos-mouse': 'GestOS Mouse.exe',
  'gestos-navegacion': 'GestOS Navegacion.exe'
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    icon: icon,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.maximize()
  })

  mainWindow.on('closed', () => {
    console.log('Ventana principal cerrada - cerrando procesos activos')
    closeAllActiveProcesses()
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Función genérica para ejecutar cualquier ejecutable GestOS
function executeGestOSApp(processId: string, executableName: string) {
  // Verificar si el proceso ya está corriendo
  if (activeProcesses.has(processId)) {
    console.log(`${executableName} ya está ejecutándose`)
    return
  }

  console.log(`Ejecutando ${executableName}...`)
  
  // Ruta al ejecutable
  const executablePath = is.dev 
    ? join(__dirname, `../../src/renderer/src/executables/${executableName}`)
    : join(process.resourcesPath, `executables/${executableName}`)
  
  console.log('Ruta del ejecutable:', executablePath)
  
  // Ejecutar el archivo
  const childProcess = execFile(executablePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar ${executableName}:`, error)
      // Remover del mapa si hay error
      activeProcesses.delete(processId)
      // Notificar al renderer que el proceso se cerró
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('process-status-changed', { 
          processId, 
          isRunning: false 
        })
      })
      return
    }
    
    if (stdout) {
      console.log(`Salida del ${executableName}:`, stdout)
    }
    
    if (stderr) {
      console.error(`Error en ${executableName}:`, stderr)
    }
  })

  // Manejar cuando el proceso se cierra
  childProcess.on('close', (code) => {
    console.log(`${executableName} cerrado con código: ${code}`)
    activeProcesses.delete(processId)
    // Notificar al renderer que el proceso se cerró
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('process-status-changed', { 
        processId, 
        isRunning: false 
      })
    })
  })

  childProcess.on('error', (err) => {
    console.error(`Error en proceso ${executableName}:`, err)
    activeProcesses.delete(processId)
    // Notificar al renderer que el proceso se cerró
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('process-status-changed', { 
        processId, 
        isRunning: false 
      })
    })
  })

  // Agregar al mapa de procesos activos
  activeProcesses.set(processId, childProcess)
  
  // Notificar al renderer que el proceso se inició
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send('process-status-changed', { 
      processId, 
      isRunning: true 
    })
  })
}

// Función para cerrar todos los procesos activos
function closeAllActiveProcesses() {
  console.log('Cerrando todos los procesos activos...')
  
  activeProcesses.forEach((childProcess, processId) => {
    try {
      console.log(`Cerrando proceso: ${processId}`)
      
      // En Windows, necesitamos usar taskkill para asegurar que el proceso se cierre
      if (process.platform === 'win32') {
        const { execSync } = require('child_process')
        // Primero intentamos cerrar normalmente
        childProcess.kill()
        
        // Luego forzamos el cierre de cualquier proceso relacionado
        try {
          const executableName = executables[processId as keyof typeof executables]
          if (executableName) {
            execSync(`taskkill /F /IM "${executableName}"`, { stdio: 'ignore' })
          }
        } catch (err) {
          console.log(`Proceso ${processId} ya cerrado o no encontrado`)
        }
      } else {
        // En otros sistemas operativos
        childProcess.kill('SIGTERM')
      }
    } catch (err) {
      console.error(`Error al cerrar el proceso ${processId}:`, err)
    }
  })
  
  // Limpiar el mapa de procesos activos
  activeProcesses.clear()
  console.log('Todos los procesos han sido cerrados')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Initialize email service
  initializeEmailService()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Email service handler
  ipcMain.handle('send-support-email', async (_, emailData: EmailData) => {
    const emailService = getEmailService()
    if (!emailService) {
      return {
        success: false,
        message: 'Servicio de correo no disponible'
      }
    }
    
    try {
      const result = await emailService.sendSupportEmail(emailData)
      return result
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor, inténtalo más tarde.'
      }
    }
  })

  // Manejadores para todos los ejecutables GestOS
  Object.entries(executables).forEach(([processId, executableName]) => {
    ipcMain.on(`execute-${processId}`, () => {
      executeGestOSApp(processId, executableName)
    })
  })

  // Manejador para verificar el estado de un proceso
  ipcMain.handle('get-process-status', (_, processId: string) => {
    return activeProcesses.has(processId)
  })

  // Manejador para cerrar un proceso específico
  ipcMain.on('close-process', (_, processId: string) => {
    const childProcess = activeProcesses.get(processId)
    if (childProcess) {
      try {
        // En Windows, necesitamos usar taskkill para asegurar que el proceso se cierre
        if (process.platform === 'win32') {
          const { execSync } = require('child_process')
          // Primero intentamos cerrar normalmente
          childProcess.kill()
          
          // Luego forzamos el cierre de cualquier proceso relacionado
          try {
            const executableName = executables[processId as keyof typeof executables]
            if (executableName) {
              execSync(`taskkill /F /IM "${executableName}"`, { stdio: 'ignore' })
            }
          } catch (err) {
            console.log('Proceso ya cerrado o no encontrado')
          }
        } else {
          // En otros sistemas operativos
          childProcess.kill('SIGTERM')
        }
      } catch (err) {
        console.error(`Error al cerrar el proceso ${processId}:`, err)
      }

      activeProcesses.delete(processId)
      console.log(`Proceso ${processId} cerrado manualmente`)
      
      // Notificar al renderer que el proceso se cerró
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('process-status-changed', { 
          processId, 
          isRunning: false 
        })
      })
    }
  })

  // Manejador para actualizar el tamaño de la ventana
  ipcMain.on('update-window-size', (_, dimensions: { width: number; height: number }) => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (mainWindow) {
      mainWindow.setSize(dimensions.width, dimensions.height)
      mainWindow.center() // Centrar la ventana después de cambiar el tamaño
    }
  })

  ipcMain.on('open-control-panel', () => {
    // Si la ventana ya existe, no crear una nueva
    if (controlPanelWindow && !controlPanelWindow.isDestroyed()) {
      controlPanelWindow.focus()
      return
    }

    // Obtener las dimensiones de la pantalla principal
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize

    controlPanelWindow = new BrowserWindow({
      width: 350,
      height: 400,
      frame: false,
      icon: icon,
      autoHideMenuBar: true,
      transparent: true,
      resizable: false,
      x: width - 360,
      y: Math.round(height / 2) - 200,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: true,
        contextIsolation: true
      }
    })

    // Cerrar la ventana principal cuando se abra el control panel
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close()
      mainWindow = null
    }

    // Notificar cuando la ventana se cierre
    controlPanelWindow.on('closed', () => {
      console.log('Panel de control cerrado - cerrando procesos activos')
      closeAllActiveProcesses()
      controlPanelWindow = null
      // Notificar a todas las ventanas que el panel de control se ha cerrado
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('control-panel-status', false)
      })
    })

    // Registrar eventos para minimizar y cerrar la ventana
    ipcMain.on('minimize-window', () => {
      if (controlPanelWindow && !controlPanelWindow.isDestroyed()) {
        controlPanelWindow.minimize()
      }
    })

    ipcMain.on('close-window', () => {
      if (controlPanelWindow && !controlPanelWindow.isDestroyed()) {
        controlPanelWindow.close()
      }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      controlPanelWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/control-panel`)
    } else {
      controlPanelWindow.loadFile(join(__dirname, '../renderer/index.html'), {
        hash: 'control-panel'
      })
    }

    // Notificar a todas las ventanas que el panel de control está abierto
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('control-panel-status', true)
    })
  })

  // Manejador para verificar si la ventana de control está abierta
  ipcMain.handle('is-control-panel-open', () => {
    return controlPanelWindow !== null && !controlPanelWindow.isDestroyed()
  })

  // Manejador para abrir la ventana principal desde el control panel
  ipcMain.on('open-main-window', () => {
    // Cerrar el panel de control si está abierto
    if (controlPanelWindow && !controlPanelWindow.isDestroyed()) {
      controlPanelWindow.close()
      controlPanelWindow = null
    }

    // Crear o mostrar la ventana principal
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  console.log('Todas las ventanas cerradas - cerrando procesos activos')
  closeAllActiveProcesses()
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Manejar el evento before-quit para cerrar procesos antes de salir
app.on('before-quit', (_) => {
  console.log('Aplicación cerrándose - limpiando procesos activos')
  closeAllActiveProcesses()
})

// Manejar el cierre forzado de la aplicación
app.on('will-quit', (_) => {
  console.log('Aplicación terminando - última limpieza de procesos')
  closeAllActiveProcesses()
})

// Manejar señales del sistema (Ctrl+C, etc.)
process.on('SIGINT', () => {
  console.log('Señal SIGINT recibida - cerrando procesos y aplicación')
  closeAllActiveProcesses()
  app.quit()
})

process.on('SIGTERM', () => {
  console.log('Señal SIGTERM recibida - cerrando procesos y aplicación')
  closeAllActiveProcesses()
  app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
