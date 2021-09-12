export class AccountAlreadyActivatedError extends Error {
  constructor () {
    super('Account is already activated')
    this.name = 'AccountAlreadyActivatedError'
  }
}
