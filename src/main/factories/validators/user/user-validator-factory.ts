import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import {
  makeRequiredFields,
  makeValidateEmail,
  makeValidateName,
  makeValidatePassword,
  makeValidatePasswordComparison
} from '.'

export const makeUserValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateName())
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeValidatePasswordComparison())

  return new ValidationComposite(validations)
}
