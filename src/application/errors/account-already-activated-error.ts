export class AccountAlreadyActivatedError extends Error {
  constructor () {
    super('Conta já ativada')
    this.name = 'AccountAlreadyActivatedError'
  }
}
