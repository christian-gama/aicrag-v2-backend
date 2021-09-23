import { ValidationComposite } from '@/application/usecases/validators'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { makeRequiredFields } from '.'
import { makeValidateActivationCode } from './validate-activation-code-factory'

export const makeActivateAccountValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email', 'activationCode']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateActivationCode())

  const credentialsValidationComposite = new ValidationComposite(validations)

  return credentialsValidationComposite
}
