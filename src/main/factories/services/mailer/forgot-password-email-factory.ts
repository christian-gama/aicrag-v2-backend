import { ForgotPasswordEmail } from '@/main/mailer/forgot-password-email'

export const makeForgotPasswordEmail = (): ForgotPasswordEmail => {
  return new ForgotPasswordEmail()
}
