import { IUser } from '@/domain'
import { IMailerService } from '@/domain/mailer'
import { MailerServiceError } from '@/application/errors'

export const makeMailerServiceStub = (): IMailerService => {
  class MailerServiceStub implements IMailerService {
    async send (user: IUser): Promise<true | MailerServiceError> {
      return await Promise.resolve(true)
    }
  }

  return new MailerServiceStub()
}
