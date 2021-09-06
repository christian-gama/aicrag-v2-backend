export interface DbHelperProtocol {
  connect: (url: string) => Promise<void>
  disconnect: () => Promise<void>
}
