export class MissingParamError extends Error {
  constructor (field: string) {
    super(`Parâmetro necessário: ${field}`)
    this.name = 'MissingParamError'
  }
}
