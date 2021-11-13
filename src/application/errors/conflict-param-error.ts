export class ConflictParamError extends Error {
  constructor (field: string) {
    super(`Param already exists: ${field}`)
    this.name = 'ConflictParamError'
  }
}
