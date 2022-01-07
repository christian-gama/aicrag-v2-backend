export class TokenMissingError extends Error {
  constructor () {
    super('É necessário um token')
    this.name = 'TokenMissingError'
  }
}
