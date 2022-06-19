import { app, screen, BrowserWindow, globalShortcut, nativeImage, session } from 'electron'
import electronReload from 'electron-reload'
import { join } from 'path'
import os from 'os'
import url from 'url'

import { UsersSubscriber } from './subscribers/sub.users'

class App {
  private static hostDev: string = 'http://localhost:3000'
  private static hostProd: string = url.format({
    pathname: join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  private static frameRate: number = 60
  private static nds: InstanceType<typeof NodeDiskStorage> = new NodeDiskStorage()
  private static win: InstanceType<typeof BrowserWindow>
  private static isProd: boolean = app.isPackaged ? true : false

  private static runWindow(): InstanceType<typeof BrowserWindow> {
    App.win = new BrowserWindow({
      frame: App.isProd ? false : true,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        preload: join(__dirname, 'preload.js')
      }
    })

    /**
     * @description production and development environment configuration here
     */

    App.win.setTitle('Electron Boilerplate')
    App.win.setBounds({ width: screen.getPrimaryDisplay().size.width, height: screen.getPrimaryDisplay().size.height })
    App.win.webContents.setZoomLevel(1)
    App.win.webContents.setWebRTCIPHandlingPolicy('default_public_and_private_interfaces')

    if (App.win.getMaxListeners() === 1000) App.win.webContents.setMaxListeners(1000)
    else App.win.webContents.setMaxListeners(1000)

    if (App.isProd) {
      App.win.loadURL(App.hostProd)
      App.win.webContents.setFrameRate(App.frameRate)
    } else {
      App.win.loadURL(App.hostDev)
      App.win.webContents.openDevTools({ mode: 'detach' })
      electronReload(__dirname, {
        electron: join(process.cwd(), 'node_modules', '.bin', 'electron'),
        cwd: join(process.cwd()),
        ignored: ['dist', 'build', 'node_modules'],
        usePolling: true,
        forceHardReset: true,
        hardResetMethod: 'exit'
      })
    }

    return App.win
  }

  private static windowEvents(): void {
    app.on('ready', () => {
      const win: BrowserWindow = App.runWindow()
      App.windowSubscribers(win)
      App.windowShortcutRegisters(win)
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) App.runWindow()
    })

    app.on('window-all-closed', () => {
      if (['darwin', 'win32', 'linux'].includes(process.platform)) {
        app.quit()
      }
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
    new UsersSubscriber(win).loadHandler()
  }

  private static windowShortcutRegisters(win: BrowserWindow): void {}

  private static windowNodeConfigs() {
    const nodeVersion: number = +process.version.replace(/^[^]/gi, '').split('.')[0]
    const options: string =
      nodeVersion < 16
        ? `--max-old-space-size=32768 --v8-pool-size=${os.cpus().length} --napi-modules`
        : `--max-old-space-size=32768 --v8-pool-size=${os.cpus().length} --napi-modules --no-global-search-paths`

    process.env.NODE_OPTIONS = options
    process.env.UV_THREADPOOL_SIZE = `${os.cpus().length}`
  }

  public static run(): void {
    App.windowNodeConfigs()
    App.windowEvents()
  }
}

/**
 * @description boostraping electron application
 */

App.run()
