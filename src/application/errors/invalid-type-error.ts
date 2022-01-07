export type ITypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'

export class InvalidTypeError extends Error {
  constructor (field: string, expectedType: ITypes, actualType: ITypes) {
    super(`O campo ${field} esperava ${expectedType}, mas recebeu ${actualType}`)
    this.name = 'InvalidTypeError'
  }
}
