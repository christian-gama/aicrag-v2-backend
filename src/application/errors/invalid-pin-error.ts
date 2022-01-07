export class InvalidPinError extends Error {
  constructor () {
    super('O pin é inválido')
    this.name = 'InvalidPinError'
  }
}
