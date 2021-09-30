import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

import {
  makeRequiredFields,
  makeSendEmailCodeValidatorComposite,
  makeValidateEmail,
  makeValidateEmailExists,
  makeValidateTempEmail
} from '@/factories/validators'

jest.mock('../../../../src/application/validators/validation-composite.ts')

describe('sendEmailCodeValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeSendEmailCodeValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['email']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateEmail())
    validations.push(makeValidateEmailExists())
    validations.push(makeValidateTempEmail())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
