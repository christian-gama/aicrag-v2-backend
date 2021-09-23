import { MailerSettingsProtocol } from '@/application/protocols/mailer'
import { MailerService } from '@/main/services/mailer/mailer-service'
interface SutTypes {
  sut: DummyService
  settings: MailerSettingsProtocol
}

class DummyService extends MailerService {
  async send (settings: MailerSettingsProtocol): Promise<any> {
    return this.sendEmail(settings)
  }
}

export const makeSut = (): SutTypes => {
  const settings: MailerSettingsProtocol = {
    to: 'any_email',
    subject: 'any_subject',
    text: 'any_text',
    html: 'any_html'
  }

  const sut = new DummyService()

  return { sut, settings }
}
