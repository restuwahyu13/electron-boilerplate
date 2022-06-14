import { ipcRenderer as ipc } from 'electron'

export class UsersPublisher {
  static sendText(data: any) {
    ipc.send('pub:text', data)
  }

  static sendError(data: any): void {
    ipc.send('pub:error', data)
  }
}
