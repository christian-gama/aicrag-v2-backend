export class InvalidParamError extends Error {
  constructor (private readonly field: string) {
    super(`Invalid param: ${field}`)
    this.name = 'InvalidParamError'
  }
}
