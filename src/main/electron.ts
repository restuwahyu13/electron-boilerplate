import { app, screen, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import electronReload from 'electron-reload'
import { join } from 'path'
import os from 'os'

import { UsersSubscriber } from './subscribers/sub.users'

const options: string =
  +process.version.replace(/^[^]/gi, '').split('.')[0] < 16
    ? `--max-old-space-size=32768 --v8-pool-size=${os.cpus().length} --napi-modules`
    : `--max-old-space-size=32768 --v8-pool-size=${os.cpus().length} --napi-modules --no-global-search-paths`

process.env.NODE_OPTIONS = options
process.env.UV_THREADPOOL_SIZE = `${os.cpus().length}`

class App {
  private static host: string = 'http://localhost:3000'
  private static rootPath: string = `file://${join(__dirname, '../build/index.html')}`
  private static frameRate: number = 60

  private static runWindow(): InstanceType<typeof BrowserWindow> {
    const win: InstanceType<typeof BrowserWindow> = new BrowserWindow({
      frame: isDev ? true : false,
      webPreferences: {
        nodeIntegration: true,
        preload: join(__dirname, 'preload.js')
      }
    })

    /**
     * @description production and development environment configuration here
     */

    if (isDev) {
      win.loadURL(App.host)
      win.setBounds({ width: screen.getPrimaryDisplay().size.width, height: screen.getPrimaryDisplay().size.height })
      win.webContents.isDevToolsOpened()
      electronReload(__dirname, {
        electron: join(process.cwd(), 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'quit',
        persistent: true
      })
    } else {
      win.loadFile(App.rootPath)
      win.setMenu(null)
      win.setAlwaysOnTop(true, 'screen-saver')
      win.webContents.setFrameRate(App.frameRate)
    }

    return win
  }

  private static windowEvents(): void {
    app.on('ready', () => {
      const win: BrowserWindow = App.runWindow()
      App.windowSubscribers(win)
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) App.runWindow()
    })

    app.on('window-all-closed', () => {
      if (['darwin', 'win32', 'linux'].includes(process.platform)) app.quit()
    })

    app.on('gpu-info-update', () => {
      if (process.platform !== 'win32') {
        app.commandLine.appendArgument('disable-software-rasterizer')
        app.commandLine.appendArgument('disable-gpu')
        app.commandLine.appendArgument('disable-angle')
      }
    })
  }

  private static windowSubscribers(win: BrowserWindow): void {
    win.webContents.on('dom-ready', (): void => {
      new UsersSubscriber(win).loadHandler()
    })
  }

  public static run(): void {
    App.windowEvents()
  }
}

/**
 * @description boostraping electron application
 */

App.run()
