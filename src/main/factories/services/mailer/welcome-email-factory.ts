import { WelcomeEmail } from '@/main/services/mailer/welcome-email'

export const makeWelcomeEmail = (): WelcomeEmail => {
  return new WelcomeEmail()
}
