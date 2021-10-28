import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidateEmailPin } from '.'

export const makeUpdateEmailByPinValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['emailPin']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateEmailPin())

  return new ValidationComposite(validations)
}
