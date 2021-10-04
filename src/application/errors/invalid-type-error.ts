export class InvalidTypeError extends Error {
  constructor (field: string) {
    super(`Invalid type: ${field}`)
    this.name = 'InvalidTypeError'
  }
}
