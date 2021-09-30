import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

import {
  makeUserValidatorComposite,
  makeRequiredFields,
  makeValidateName,
  makeValidateEmail,
  makeValidatePassword,
  makeValidatePasswordComparasion
} from '@/factories/validators'

jest.mock('../../../../src/application/validators/validation-composite.ts')

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
