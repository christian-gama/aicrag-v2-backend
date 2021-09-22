import { MailerSettingsProtocol } from '@/application/protocols/services/mailer/mailer-settings-protocol'
import { MailerService } from '@/main/services/mailer/mailer-service'

interface SutTypes {
  sut: MailerService
  options: MailerSettingsProtocol
}

export const makeSut = (): SutTypes => {
  const options: MailerSettingsProtocol = {
    to: 'any_email',
    subject: 'any_subject',
    text: 'any_text',
    html: 'any_html'
  }
  const sut = new MailerService()

  return { sut, options }
}
