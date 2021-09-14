import { ValidationComposite, ValidatorProtocol } from '@/application/usecases/validators/user-validator'
import {
  makeUserValidatorComposite,
  makeRequiredFields,
  makeValidateName,
  makeValidateEmail,
  makeValidatePassword,
  makeValidatePasswordComparasion
} from '@/main/factories/validators/user-validator'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('UserValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeUserValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateName())
    validations.push(makeValidateEmail())
    validations.push(makeValidatePassword())
    validations.push(makeValidatePasswordComparasion())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
