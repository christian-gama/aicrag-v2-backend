import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { makeAccountValidatorComposite } from '@/main/factories/account/account-validator/account-validator-composite-factory'
import { makeEmailValidatorStub } from './mocks/email-validator-mock'
import {
  RequiredFields,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ComparePasswords,
  ValidationComposite
} from '@/application/usecases/validators/account'

jest.mock('../../../../src/application/usecases/validators/validation-composite.ts')

describe('AccountValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeAccountValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(new RequiredFields(field))
    }

    const emailValidatorAdapter = makeEmailValidatorStub()

    validations.push(new ValidateName())
    validations.push(new ValidateEmail(emailValidatorAdapter))
    validations.push(new ValidatePassword())
    validations.push(new ComparePasswords())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
