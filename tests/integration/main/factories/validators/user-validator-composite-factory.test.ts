import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import { makeRequiredFields, makeValidatePassword, makeValidateEmail, makeUserValidatorComposite, makeValidateName, makeValidatePasswordComparasion } from '@/main/factories/validators'

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
