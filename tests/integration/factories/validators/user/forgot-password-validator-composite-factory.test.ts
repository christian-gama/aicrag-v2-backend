import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeForgotPasswordValidatorComposite,
  makeRequiredFields,
  makeValidateEmail,
  makeValidateEmailExists
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('forgotPasswordValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeForgotPasswordValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['email']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateEmail())
    validations.push(makeValidateEmailExists())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
