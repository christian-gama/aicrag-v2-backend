export class PermissionError extends Error {
  constructor () {
    super('You have no permission')
    this.name = 'PermissionError'
  }
}
