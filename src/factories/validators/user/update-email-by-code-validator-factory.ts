import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidateEmailCode } from '.'

export const makeUpdateEmailByCodeValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['emailCode']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateEmailCode())

  return new ValidationComposite(validations)
}
