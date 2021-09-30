import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

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
