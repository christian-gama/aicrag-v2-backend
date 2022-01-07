export class MustLogoutError extends Error {
  constructor () {
    super('Você deve sair da sua conta antes')
    this.name = 'MustLogoutError'
  }
}
