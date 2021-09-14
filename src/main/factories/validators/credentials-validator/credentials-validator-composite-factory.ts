import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { makeRequiredFields, makeValidateEmail, makeValidatePassword, makeValidateEmailExists, makeValidatePasswordMatch, makeValidateActiveAccount } from '.'

export const makeCredentialsValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeValidateEmailExists())
  validations.push(makeValidatePasswordMatch())
  validations.push(makeValidateActiveAccount())

  const credentialsValidationComposite = new ValidationComposite(validations)

  return credentialsValidationComposite
}
