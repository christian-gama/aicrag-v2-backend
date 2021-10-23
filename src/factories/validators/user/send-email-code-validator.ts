import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidateEmail, makeValidateEmailExists, makeValidateTempEmail } from '.'

export const makeSendEmailCodeValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['email']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailExists())
  validations.push(makeValidateTempEmail())

  const sendEmailCodeValidator = new ValidationComposite(validations)

  return sendEmailCodeValidator
}
