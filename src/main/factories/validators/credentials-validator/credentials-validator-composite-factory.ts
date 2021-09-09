import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { makeValidateCredentials } from './validate-credential-factory'

export const makeCredentialsValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []
  const validateCredentials = makeValidateCredentials()

  validations.push(validateCredentials)

  const credentialsValidationComposite = new ValidationComposite(validations)

  return credentialsValidationComposite
}
