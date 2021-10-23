import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeRequiredFields, makeValidatePassword, makeValidatePasswordComparison } from '@/factories/validators/user'
import { makeResetPasswordValidator } from '@/factories/validators/user/reset-password-validator-factory'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('resetPasswordValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeResetPasswordValidator()

    const validations: IValidator[] = []

    const fields = ['password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidatePassword())
    validations.push(makeValidatePasswordComparison())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
