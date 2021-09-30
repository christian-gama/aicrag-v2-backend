export class InvalidTokenError extends Error {
  constructor () {
    super('Token is invalid')
    this.name = 'InvalidTokenError'
  }
}
