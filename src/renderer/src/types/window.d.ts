export interface IElectronAPI {
  ipcRenderer: {
    send: (channel: string, data?: any) => void
    on: (channel: string, func: (...args: any[]) => void) => () => void
    invoke: (channel: string, data?: any) => Promise<any>
    removeListener: (channel: string, func: (...args: any[]) => void) => void
  }
}

export interface ICustomAPI {
  send: (channel: string, data?: any) => void
  executeGestosVolumen: () => void
  executeGestosAplicaciones: () => void
  executeGestosMultimedia: () => void
  executeGestosSistema: () => void
  executeGestosAtajos: () => void
  executeGestosMouse: () => void
  executeGestosNavegacion: () => void
  getProcessStatus: (processId: string) => Promise<boolean>
  closeProcess: (processId: string) => void
  onProcessStatusChanged: (callback: (data: { processId: string; isRunning: boolean }) => void) => void
  removeProcessStatusListener: () => void
}

declare global {
  interface Window {
    electron?: IElectronAPI
    api?: ICustomAPI
  }
} 