import { WelcomeEmail } from '@/main/mailer/welcome-email'

export const makeWelcomeEmail = (): WelcomeEmail => {
  return new WelcomeEmail()
}
