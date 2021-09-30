export class MustLoginError extends Error {
  constructor () {
    super('You must login first')
    this.name = 'MustLoginError'
  }
}
