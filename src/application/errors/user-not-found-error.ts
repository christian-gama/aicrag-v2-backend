export class UserNotFoundError extends Error {
  constructor () {
    super('No users were found')
    this.name = 'UserNotFoundError'
  }
}
