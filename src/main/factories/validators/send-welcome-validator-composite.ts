import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import { makeRequiredFields, makeValidateEmail, makeValidateEmailExists } from '.'

export const makeSendWelcomeEmailValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailExists())

  const sendWelcomeEmailValidatorComposite = new ValidationComposite(validations)

  return sendWelcomeEmailValidatorComposite
}
