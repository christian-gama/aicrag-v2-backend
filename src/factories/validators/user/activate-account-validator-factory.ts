import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidateActivationCode } from '.'

export const makeActivateAccountValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['email', 'activationCode']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateActivationCode())

  return new ValidationComposite(validations)
}
