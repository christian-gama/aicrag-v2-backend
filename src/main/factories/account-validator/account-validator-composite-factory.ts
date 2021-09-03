import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  AccountValidationComposite
} from '@/application/validators/account'
import { Validation } from '@/application/validators/protocols/validation-protocol'
import { EmailValidatorAdapter } from '@/main/adapters/email-validator/email-validator-adapter'

export const makeAccountValidatorComposite = (): Validation => {
  const validations: Validation[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(new RequiredFields(field))
  }

  const emailValidatorAdapter = new EmailValidatorAdapter()

  validations.push(new ValidateEmail(emailValidatorAdapter))
  validations.push(new ValidateName())
  validations.push(new ValidatePassword())
  validations.push(new ComparePasswords())

  const accountValidationComposite = new AccountValidationComposite(validations)

  return accountValidationComposite
}
