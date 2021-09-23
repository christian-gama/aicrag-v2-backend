import { ForgotPasswordEmail } from '@/main/services/mailer/forgot-password-email'

export const makeForgotPasswordEmail = (): ForgotPasswordEmail => {
  return new ForgotPasswordEmail()
}
