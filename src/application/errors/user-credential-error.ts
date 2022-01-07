export class UserCredentialError extends Error {
  constructor () {
    super('Suas credenciais estão inválidas')
    this.name = 'UserCredentialError'
  }
}
