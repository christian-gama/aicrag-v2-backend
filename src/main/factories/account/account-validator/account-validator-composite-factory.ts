import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { EmailValidatorAdapter } from '@/infra/adapters/validators/email-validator/email-validator-adapter'
import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  AccountValidationComposite
} from '@/application/usecases/validators/account'

export const makeAccountValidatorComposite = (): AccountValidatorProtocol => {
  const validations: AccountValidatorProtocol[] = []

  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(new RequiredFields(field))
  }

  const emailValidatorAdapter = new EmailValidatorAdapter()

  validations.push(new ValidateName())
  validations.push(new ValidateEmail(emailValidatorAdapter))
  validations.push(new ValidatePassword())
  validations.push(new ComparePasswords())

  const accountValidationComposite = new AccountValidationComposite(validations)

  return accountValidationComposite
}
