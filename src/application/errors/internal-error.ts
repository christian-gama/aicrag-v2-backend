export class InternalError extends Error {
  constructor () {
    super('Erro interno, tente novamente mais tarde')
    this.name = 'InternalError'
  }
}
