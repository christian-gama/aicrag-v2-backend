import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'
import { MailerServiceError } from '@/application/usecases/errors'
import { IUser } from '@/domain'

export const makeMailerServiceStub = (): MailerServiceProtocol => {
  class MailerServiceStub implements MailerServiceProtocol {
    async send (user: IUser): Promise<true | MailerServiceError> {
      return Promise.resolve(true)
    }
  }

  return new MailerServiceStub()
}
