import { ISocketUsers } from './socket.users'

interface IElectronApi {
  users: ISocketUsers
}

export class ElectronApi {
  static native: Window = window
  static api: IElectronApi = (window as any).api
}
