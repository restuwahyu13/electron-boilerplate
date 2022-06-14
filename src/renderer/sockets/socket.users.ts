export interface ISocketUsers {
  /**
   * @description initialize all subscriber here
   */

  getText: (data: any) => void
  getError: (data: any) => void

  /**
   * @description initialize all publisher here
   */

  sendText: (data: any) => void
  sendError: (data: string) => void
}
