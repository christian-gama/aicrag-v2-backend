import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeValidateEmail,
  makeValidateEmailExists,
  makeValidateTempEmail
} from '.'

export const makeSendEmailCodeValidator = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

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
