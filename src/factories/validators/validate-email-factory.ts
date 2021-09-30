import { ValidateEmail } from '@/application/validators'

import { makeEmailValidator } from '.'

export const makeValidateEmail = (): ValidateEmail => {
  const emailValidator = makeEmailValidator()

  return new ValidateEmail(emailValidator)
}
