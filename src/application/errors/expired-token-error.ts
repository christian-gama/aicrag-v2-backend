export class ExpiredTokenError extends Error {
  constructor () {
    super('O token está expirado')
    this.name = 'ExpiredTokenError'
  }
}
