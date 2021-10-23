import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidateEmail, makeValidateEmailExists } from '.'

export const makeForgotPasswordValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['email']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailExists())

  const forgotPasswordComposite = new ValidationComposite(validations)

  return forgotPasswordComposite
}
