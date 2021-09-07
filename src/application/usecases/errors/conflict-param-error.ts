export class ConflictParamError extends Error {
  constructor (private readonly field: string) {
    super(`Param already exists: ${field}`)
    this.name = 'ConflictParamError'
  }
}
