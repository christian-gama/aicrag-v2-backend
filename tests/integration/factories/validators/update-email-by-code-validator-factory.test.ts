import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators'

import {
  makeUpdateEmailByCodeValidatorComposite,
  makeRequiredFields,
  makeValidateEmailCode,
  makeValidateEmailExists,
  makeValidateEmail
} from '@/factories/validators'

jest.mock('../../../../src/application/validators/validation-composite.ts')

describe('updateEmailByCodeValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeUpdateEmailByCodeValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['email', 'tempEmailCode']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateEmail())
    validations.push(makeValidateEmailExists())
    validations.push(makeValidateEmailCode())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
