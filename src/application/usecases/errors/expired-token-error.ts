export class ExpiredTokenError extends Error {
  constructor () {
    super('Token is expired')
    this.name = 'ExpiredTokenError'
  }
}
