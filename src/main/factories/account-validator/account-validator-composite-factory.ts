import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  AccountValidationComposite
} from '@/infra/validators/account'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'
import { EmailValidatorAdapter } from '@/main/adapters/email-validator/email-validator-adapter'

export const makeAccountValidatorComposite = (): AccountValidator => {
  const validations: AccountValidator[] = []

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
