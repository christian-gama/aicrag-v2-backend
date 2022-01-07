export class PinIsExpiredError extends Error {
  constructor () {
    super('O pin expirou')
    this.name = 'PinIsExpiredError'
  }
}
