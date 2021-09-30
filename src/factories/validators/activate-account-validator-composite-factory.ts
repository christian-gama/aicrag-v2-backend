import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

import { makeRequiredFields, makeValidateActivationCode } from '.'

export const makeActivateAccountValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email', 'activationCode']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateActivationCode())

  const activateAccountValidatorComposite = new ValidationComposite(validations)

  return activateAccountValidatorComposite
}
