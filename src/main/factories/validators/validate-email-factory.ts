import { ValidateEmail } from '@/application/usecases/validators'

import { makeEmailValidator } from '.'

export const makeValidateEmail = (): ValidateEmail => {
  const emailValidator = makeEmailValidator()

  return new ValidateEmail(emailValidator)
}
