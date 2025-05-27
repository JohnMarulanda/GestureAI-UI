import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ['open-control-panel']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data)
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
      send: (channel, data) => ipcRenderer.send(channel, data)
    }
  }
  // @ts-ignore (define in dts)
  window.api = api
}
