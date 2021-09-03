import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  AccountValidationComposite
} from '@/application/validators/account'
import { Validation } from '@/application/validators/protocols/validation-protocol'
import { makeAccountValidatorComposite } from '@/main/factories/account-validator/account-validator-composite-factory'
import { makeEmailValidatorStub } from './mocks/email-validator-mock'

jest.mock('../../../../src/application/validators/account/account-validation-composite.ts')

describe('AccountValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeAccountValidatorComposite()

    const validations: Validation[] = []

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(new RequiredFields(field))
    }

    const emailValidatorAdapter = makeEmailValidatorStub()

    validations.push(new ValidateEmail(emailValidatorAdapter))
    validations.push(new ValidateName())
    validations.push(new ValidatePassword())
    validations.push(new ComparePasswords())

    expect(AccountValidationComposite).toHaveBeenCalledWith(validations)
  })
})
