import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/domain/mailer'

import { MailerServiceError } from '@/application/errors'

export const makeMailerServiceStub = (): MailerServiceProtocol => {
  class MailerServiceStub implements MailerServiceProtocol {
    async send (user: IUser): Promise<true | MailerServiceError> {
      return await Promise.resolve(true)
    }
  }

  return new MailerServiceStub()
}
