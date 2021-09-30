export class UserCredentialError extends Error {
  constructor () {
    super('Credentials are invalid')
    this.name = 'UserCredentialError'
  }
}
