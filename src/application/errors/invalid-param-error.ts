export class InvalidParamError extends Error {
  constructor (private readonly field: string) {
    super(`Parâmetro inválido: ${field}`)
    this.name = 'InvalidParamError'
  }
}
