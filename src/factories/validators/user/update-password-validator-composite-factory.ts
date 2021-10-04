import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeValidateCurrentPassword,
  makeValidatePassword,
  makeValidatePasswordComparison
} from '.'

export const makeUpdatePasswordValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['currentPassword', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateCurrentPassword())
  validations.push(makeValidatePassword())
  validations.push(makeValidatePasswordComparison())

  const updatePasswordValidatorComposite = new ValidationComposite(validations)

  return updatePasswordValidatorComposite
}
