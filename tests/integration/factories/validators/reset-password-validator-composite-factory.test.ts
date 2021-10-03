import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeValidatePassword,
  makeValidatePasswordComparasion
} from '@/factories/validators'
import { makeResetPasswordValidatorComposite } from '@/factories/validators/reset-password-validator-composite-factory'

jest.mock('../../../../src/application/validators/validation-composite.ts')

describe('resetPasswordValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeResetPasswordValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidatePassword())
    validations.push(makeValidatePasswordComparasion())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
