import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import {
  makeRequiredFields,
  makeValidateName,
  makeValidateEmail,
  makeValidatePassword,
  makeComparePasswords
} from '.'

export const makeAccountValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateName())
  validations.push(makeValidateEmail())
  validations.push(makeValidatePassword())
  validations.push(makeComparePasswords())

  const accountValidationComposite = new ValidationComposite(validations)

  return accountValidationComposite
}
