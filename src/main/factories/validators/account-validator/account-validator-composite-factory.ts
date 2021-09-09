import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { EmailValidatorAdapter } from '@/infra/adapters/validators/email-validator/email-validator-adapter'
import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  ValidationComposite
} from '@/application/usecases/validators/account'

export const makeAccountValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(new RequiredFields(field))
  }

  const emailValidatorAdapter = new EmailValidatorAdapter()

  validations.push(new ValidateName())
  validations.push(new ValidateEmail(emailValidatorAdapter))
  validations.push(new ValidatePassword())
  validations.push(new ComparePasswords())

  const accountValidationComposite = new ValidationComposite(validations)

  return accountValidationComposite
}
