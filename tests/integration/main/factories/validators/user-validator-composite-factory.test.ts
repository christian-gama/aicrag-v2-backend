import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import { makeUserValidatorComposite, makeRequiredFields, makeValidateName, makeValidateEmail, makeValidatePassword, makeValidatePasswordComparasion } from '@/main/factories/validators'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('userValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

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
