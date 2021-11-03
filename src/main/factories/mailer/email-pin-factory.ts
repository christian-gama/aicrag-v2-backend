import { EmailPin } from '@/main/mailer'

export const makeEmailPin = (): EmailPin => {
  return new EmailPin()
}
