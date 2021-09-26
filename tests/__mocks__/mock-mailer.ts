import { IUser } from '@/domain'

import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { MailerServiceError } from '@/application/usecases/errors'

export const makeMailerServiceStub = (): MailerServiceProtocol => {
  class MailerServiceStub implements MailerServiceProtocol {
    async send (user: IUser): Promise<true | MailerServiceError> {
      return await Promise.resolve(true)
    }
  }

  return new MailerServiceStub()
}
