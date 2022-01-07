export class MustLoginError extends Error {
  constructor () {
    super('Você deve fazer o login primeiro')
    this.name = 'MustLoginError'
  }
}
