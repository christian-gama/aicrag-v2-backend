import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import {
  makeRequiredFields,
  makeValidateEmail,
  makeValidatePassword,
  makeValidateEmailExists,
  makeValidatePasswordComparasion
} from '.'

export const makeUpdatePasswordValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeValidateEmailExists())
  validations.push(makeValidatePasswordComparasion())

  const updatePasswordValidatorComposite = new ValidationComposite(validations)

  return updatePasswordValidatorComposite
}
