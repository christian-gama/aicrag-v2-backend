export class InvalidTokenError extends Error {
  constructor () {
    super('O token é inválido')
    this.name = 'InvalidTokenError'
  }
}
