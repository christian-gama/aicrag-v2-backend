import { MailerService } from '@/main/services/mailer/mailer-service'

export const makeMailerService = (): MailerService => {
  return new MailerService()
}
