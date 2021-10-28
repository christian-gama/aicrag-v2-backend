export class InvalidPinError extends Error {
  constructor () {
    super('Invalid pin')
    this.name = 'InvalidPinError'
  }
}
