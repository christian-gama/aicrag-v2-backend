export class InactiveAccountError extends Error {
  constructor () {
    super('Account is not activated')
    this.name = 'InactiveAccountError'
  }
}
