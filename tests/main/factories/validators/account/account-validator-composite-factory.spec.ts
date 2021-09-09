import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { makeAccountValidatorComposite } from '@/main/factories/validators/account-validator/account-validator-composite-factory'
import {
  makeRequiredFields,
  makeValidateName,
  makeValidateEmail,
  makeValidatePassword,
  makeComparePasswords
} from '@/main/factories/validators/account-validator'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('AccountValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeAccountValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateName())
    validations.push(makeValidateEmail())
    validations.push(makeValidatePassword())
    validations.push(makeComparePasswords())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
