import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { makeAccountValidatorComposite } from '@/main/factories/account/account-validator/account-validator-composite-factory'
import { makeEmailValidatorStub } from './mocks/email-validator-mock'
import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  AccountValidationComposite
} from '@/application/usecases/validators/account'

jest.mock('../../../../src/application/usecases/validators/account/account-validation-composite.ts')

describe('AccountValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeAccountValidatorComposite()

    const validations: AccountValidatorProtocol[] = []

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(new RequiredFields(field))
    }

    const emailValidatorAdapter = makeEmailValidatorStub()

    validations.push(new ValidateName())
    validations.push(new ValidateEmail(emailValidatorAdapter))
    validations.push(new ValidatePassword())
    validations.push(new ComparePasswords())

    expect(AccountValidationComposite).toHaveBeenCalledWith(validations)
  })
})
