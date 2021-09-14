export class InvalidTokenError extends Error {
  constructor () {
    super('Token is invalid or expired')
    this.name = 'InvalidTokenError'
  }
}
