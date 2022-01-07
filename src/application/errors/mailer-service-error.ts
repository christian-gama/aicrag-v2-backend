export class MailerServiceError extends Error {
  constructor () {
    super('Não foi possível enviar o email')
    this.name = 'MailerServiceError'
  }
}
