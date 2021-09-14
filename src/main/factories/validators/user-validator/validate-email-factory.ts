import { ValidateEmail } from '@/application/usecases/validators/user-validator'
import { EmailValidatorAdapter } from '@/infra/adapters/validators/email-validator/email-validator-adapter'

export const makeValidateEmail = (): ValidateEmail => {
  const emailValidator = new EmailValidatorAdapter()

  return new ValidateEmail(emailValidator)
}
