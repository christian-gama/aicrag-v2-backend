export class MailerServiceError extends Error {
  constructor () {
    super('Could not send the email')
    this.name = 'MailerServiceError'
  }
}
