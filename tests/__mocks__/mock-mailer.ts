import { MailerServiceProtocol } from '@/application/protocols/mailer'
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