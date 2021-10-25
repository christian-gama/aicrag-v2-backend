import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRecoverPasswordEmailValidator,
  makeRequiredFields,
  makeValidateEmail,
  makeValidateEmailExists,
  makeValidatePasswordToken
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('forgotPasswordValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeRecoverPasswordEmailValidator()

    const validations: IValidator[] = []

    const fields = ['email']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateEmail())
    validations.push(makeValidateEmailExists())
    validations.push(makeValidatePasswordToken())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
