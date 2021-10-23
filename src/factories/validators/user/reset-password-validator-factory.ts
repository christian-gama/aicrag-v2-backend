import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidatePassword, makeValidatePasswordComparison } from '.'

export const makeResetPasswordValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidatePassword())
  validations.push(makeValidatePasswordComparison())

  const resetPasswordValidator = new ValidationComposite(validations)

  return resetPasswordValidator
}
