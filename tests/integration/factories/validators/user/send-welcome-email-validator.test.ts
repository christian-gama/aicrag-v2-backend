import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeSendWelcomeEmailValidator,
  makeValidateEmail,
  makeValidateEmailExists
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('sendWelcomeEmail', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeSendWelcomeEmailValidator()

    const validations: IValidator[] = []

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
