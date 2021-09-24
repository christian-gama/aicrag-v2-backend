import { ValidateEmail } from '@/application/usecases/validators'

import { EmailValidatorAdapter } from '@/infra/adapters/validators'

export const makeValidateEmail = (): ValidateEmail => {
  const emailValidator = new EmailValidatorAdapter()

  return new ValidateEmail(emailValidator)
}
