import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

import { makeRequiredFields, makeValidateEmail, makeValidateEmailCode, makeValidateEmailExists } from '.'

export const makeUpdateEmailByCodeValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email', 'tempEmailCode']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailExists())
  validations.push(makeValidateEmailCode())

  const updateEmailByCodeController = new ValidationComposite(validations)

  return updateEmailByCodeController
}
