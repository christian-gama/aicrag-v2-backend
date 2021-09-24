import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import {
  makeRequiredFields,
  makeValidateEmail,
  makeValidateName,
  makeValidatePassword,
  makeValidatePasswordComparasion
} from '.'

export const makeUserValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateName())
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeValidatePasswordComparasion())

  const userValidationComposite = new ValidationComposite(validations)

  return userValidationComposite
}
