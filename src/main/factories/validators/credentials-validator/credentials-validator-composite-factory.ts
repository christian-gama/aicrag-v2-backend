import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { makeRequiredFields, makeValidateEmail, makeValidatePassword } from '../account-validator'
import { makeValidateCredentials } from './validate-credential-factory'

export const makeCredentialsValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []
  const validateCredentials = makeValidateCredentials()

  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(validateCredentials)

  const credentialsValidationComposite = new ValidationComposite(validations)

  return credentialsValidationComposite
}
