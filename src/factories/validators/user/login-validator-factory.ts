import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeValidateEmail,
  makeValidatePassword,
  makeValidateEmailExists,
  makeValidatePasswordMatch,
  makeValidateActiveAccount
} from '.'

export const makeLoginValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeValidateEmailExists())
  validations.push(makeValidatePasswordMatch())
  validations.push(makeValidateActiveAccount())

  const dataValidationComposite = new ValidationComposite(validations)

  return dataValidationComposite
}
