import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidateEmailCode } from '.'

export const makeUpdateEmailByCodeValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['emailCode']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateEmailCode())

  const updateEmailByCodeController = new ValidationComposite(validations)

  return updateEmailByCodeController
}
