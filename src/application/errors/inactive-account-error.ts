export class InactiveAccountError extends Error {
  constructor () {
    super('A conta não está ativada')
    this.name = 'InactiveAccountError'
  }
}
