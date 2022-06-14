import { contextBridge } from 'electron'

import { UsersPublisher } from './publishers/pub.users'
import { UsersReceiver } from './receivers//rec.users'

export class Preload {
  private static contextHandler: Record<string, any>

  private static setter(): void {
    Preload.contextHandler = {
      users: {
        getText: UsersReceiver.getText,
        getError: UsersReceiver.getError,
        sendText: UsersPublisher.sendText,
        sendError: UsersPublisher.sendError
      }
    }
  }

  private static getter(): void {
    contextBridge.exposeInMainWorld('api', Preload.contextHandler)
  }

  public static loadHandler(): void {
    Preload.setter()
    Preload.getter()
  }
}

/**
 * @description boostraping preload handler
 */

Preload.loadHandler()
