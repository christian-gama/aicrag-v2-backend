import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { makeValidateActiveAccount, makeValidateCredentials, makeRequiredFields, makeValidateEmail, makeValidatePassword } from '.'

export const makeCredentialsValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeValidateCredentials())
  validations.push(makeValidateActiveAccount())

  const credentialsValidationComposite = new ValidationComposite(validations)

  return credentialsValidationComposite
}
