import { RecoverPasswordEmail } from '@/main/mailer'

export const makeRecoverPasswordEmail = (): RecoverPasswordEmail => {
  return new RecoverPasswordEmail()
}
