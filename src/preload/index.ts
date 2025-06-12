import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  send: (channel, data) => {
    // whitelist channels - incluir todos los canales de ejecutables GestOS
    const validChannels = [
      'open-control-panel', 
      'close-process', 
      'open-main-window',
      'execute-gestos-volumen',
      'execute-gestos-aplicaciones',
      'execute-gestos-multimedia',
      'execute-gestos-sistema',
      'execute-gestos-atajos',
      'execute-gestos-mouse',
      'execute-gestos-navegacion'
    ]
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // Funciones específicas para ejecutar cada tipo de GestOS
  executeGestosVolumen: () => {
    ipcRenderer.send('execute-gestos-volumen')
  },
  executeGestosAplicaciones: () => {
    ipcRenderer.send('execute-gestos-aplicaciones')
  },
  executeGestosMultimedia: () => {
    ipcRenderer.send('execute-gestos-multimedia')
  },
  executeGestosSistema: () => {
    ipcRenderer.send('execute-gestos-sistema')
  },
  executeGestosAtajos: () => {
    ipcRenderer.send('execute-gestos-atajos')
  },
  executeGestosMouse: () => {
    ipcRenderer.send('execute-gestos-mouse')
  },
  executeGestosNavegacion: () => {
    ipcRenderer.send('execute-gestos-navegacion')
  },
  // Función para verificar el estado de un proceso
  getProcessStatus: (processId: string) => {
    return ipcRenderer.invoke('get-process-status', processId)
  },
  // Función para cerrar un proceso específico
  closeProcess: (processId: string) => {
    ipcRenderer.send('close-process', processId)
  },
  // Función para escuchar cambios de estado de procesos
  onProcessStatusChanged: (callback: (data: { processId: string; isRunning: boolean }) => void) => {
    ipcRenderer.on('process-status-changed', (_, data) => callback(data))
  },
  // Función para remover el listener
  removeProcessStatusListener: () => {
    ipcRenderer.removeAllListeners('process-status-changed')
  },
  // Función para enviar email de soporte
  sendSupportEmail: (emailData: { name: string; email: string; reason: string; message: string }) => {
    return ipcRenderer.invoke('send-support-email', emailData)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => {
          const subscription = (_event, ...args) => func(...args)
          ipcRenderer.on(channel, subscription)
          return () => {
            ipcRenderer.removeListener(channel, subscription)
          }
        },
        invoke: (channel, data) => ipcRenderer.invoke(channel, data),
        removeListener: (channel, func) => ipcRenderer.removeListener(channel, func)
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = {
    ipcRenderer: {
      send: (channel, data) => ipcRenderer.send(channel, data),
      on: (channel, func) => ipcRenderer.on(channel, func),
      invoke: (channel, data) => ipcRenderer.invoke(channel, data),
      removeListener: (channel, func) => ipcRenderer.removeListener(channel, func)
    }
  }
  // @ts-ignore (define in dts)
  window.api = api
}
