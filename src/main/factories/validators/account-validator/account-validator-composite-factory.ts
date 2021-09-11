import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import {
  makeComparePasswords,
  makeRequiredFields,
  makeValidateEmail,
  makeValidateName,
  makeValidatePassword
} from '.'

export const makeAccountValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateName())
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeComparePasswords())

  const accountValidationComposite = new ValidationComposite(validations)

  return accountValidationComposite
}
