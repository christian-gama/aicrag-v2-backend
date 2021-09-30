export class CodeIsExpiredError extends Error {
  constructor () {
    super('Code is expired')
    this.name = 'CodeIsExpiredError'
  }
}
