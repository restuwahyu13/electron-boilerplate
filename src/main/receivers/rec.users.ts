import { ipcRenderer as ipc } from 'electron'

export class UsersReceiver {
  static getText(cb: (data: any) => void) {
    ipc.on('sub:text', (_event: Electron.IpcRendererEvent, args: any) => cb(args))
  }

  static getError(cb: (data: any) => void): void {
    ipc.on('sub:error', (_event: Electron.IpcRendererEvent, args: any) => cb(args))
  }
}
