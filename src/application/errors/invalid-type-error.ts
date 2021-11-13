export type ITypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'

export class InvalidTypeError extends Error {
  constructor (field: string, expectedType: ITypes, actualType: ITypes) {
    super(`The field ${field} was expecting a ${expectedType} but receive ${actualType}`)
    this.name = 'InvalidTypeError'
  }
}
