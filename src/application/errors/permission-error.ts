export class PermissionError extends Error {
  constructor () {
    super('Você não tem permissão')
    this.name = 'PermissionError'
  }
}
