export class PinIsExpiredError extends Error {
  constructor () {
    super('Pin is expired')
    this.name = 'PinIsExpiredError'
  }
}
