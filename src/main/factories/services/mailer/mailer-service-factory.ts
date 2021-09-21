import { MailerService } from '@/main/services/mailer-service'

export const makeMailerService = (): MailerService => {
  return new MailerService()
}
