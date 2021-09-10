export class InactiveAccountError extends Error {
  constructor () {
    super('Inactive account: activate to get access')
    this.name = 'InactiveAccountError'
  }
}
