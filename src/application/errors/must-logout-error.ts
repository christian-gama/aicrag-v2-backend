export class MustLogoutError extends Error {
  constructor () {
    super('You must logout first')
    this.name = 'MustLogoutError'
  }
}
