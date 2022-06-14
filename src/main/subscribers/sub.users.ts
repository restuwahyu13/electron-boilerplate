import { ipcMain as ipc, dialog } from 'electron'
import { BrowserWindow } from 'electron/main'

export class UsersSubscriber {
  private win: InstanceType<typeof BrowserWindow>

  constructor(win: InstanceType<typeof BrowserWindow>) {
    this.win = win
  }

  private subText(): void {
    ipc.on('pub:text', (event: Electron.IpcMainEvent, args: any) => {
      console.info(`data from react: ${args}`)
      event.sender.send('sub:text', args)
    })
  }

  private subError(): void {
    ipc.on('pub:error', (event: Electron.IpcMainEvent, args: any) => {
      if (args) dialog.showErrorBox('Error Message', args)
      else event.sender.send('sub:error', 'error')
    })
  }

  public loadHandler(): void {
    this.subText()
    this.subError()
  }
}
