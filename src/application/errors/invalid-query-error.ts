export class InvalidQueryError extends Error {
  constructor (private readonly field: string) {
    super(`Invalid query: ${field}`)
    this.name = 'InvalidQueryError'
  }
}
