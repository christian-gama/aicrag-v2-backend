import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeValidateCurrentPassword,
  makeValidatePassword,
  makeValidatePasswordComparison
} from '.'

export const makeUpdatePasswordValidator = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['currentPassword', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateCurrentPassword())
  validations.push(makeValidatePassword())
  validations.push(makeValidatePasswordComparison())

  const updatePasswordValidator = new ValidationComposite(validations)

  return updatePasswordValidator
}
