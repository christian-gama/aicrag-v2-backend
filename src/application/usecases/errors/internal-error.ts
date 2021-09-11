export class InternalError extends Error {
  constructor () {
    super('Internal error: Try again later')
    this.name = 'InternalError'
  }
}
