import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeUpdateEmailByCodeValidatorComposite,
  makeRequiredFields,
  makeValidateEmailCode
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('updateEmailByCodeValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeUpdateEmailByCodeValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['emailCode']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateEmailCode())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
