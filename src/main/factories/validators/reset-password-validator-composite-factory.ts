import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import { makeRequiredFields, makeValidatePassword, makeValidatePasswordComparasion } from '.'

export const makeResetPasswordValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidatePassword())
  validations.push(makeValidatePasswordComparasion())

  const resetPasswordValidatorComposite = new ValidationComposite(validations)

  return resetPasswordValidatorComposite
}
