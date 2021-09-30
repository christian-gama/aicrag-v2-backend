import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

import {
  makeRequiredFields,
  makeSendWelcomeEmailValidatorComposite,
  makeValidateEmail,
  makeValidateEmailExists
} from '@/factories/validators'

jest.mock('../../../../src/application/validators/validation-composite.ts')

describe('sendWelcomeEmail', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeSendWelcomeEmailValidatorComposite()

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