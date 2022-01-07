export class ConflictParamError extends Error {
  constructor (field: string) {
    super(`Parâmetro já existe: ${field}`)
    this.name = 'ConflictParamError'
  }
}
