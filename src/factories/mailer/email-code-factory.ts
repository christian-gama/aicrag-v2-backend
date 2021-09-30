import { EmailCode } from '@/main/mailer'

export const makeEmailCode = (): EmailCode => {
  return new EmailCode()
}
