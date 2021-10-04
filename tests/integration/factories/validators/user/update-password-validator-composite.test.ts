import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeUpdatePasswordValidatorComposite,
  makeRequiredFields,
  makeValidatePassword,
  makeValidatePasswordComparison,
  makeValidateCurrentPassword
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('updatePasswordValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeUpdatePasswordValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['currentPassword', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateCurrentPassword())
    validations.push(makeValidatePassword())
    validations.push(makeValidatePasswordComparison())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
