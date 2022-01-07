export class UserNotFoundError extends Error {
  constructor () {
    super('Não foi possível encontrar usuários')
    this.name = 'UserNotFoundError'
  }
}
