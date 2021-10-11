import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import {
  makeValidateFields,
  makeValidateLimit,
  makeValidatePage,
  makeValidateSort,
  makeQueryAllInvoicesValidatorComposite,
  makeValidateType
} from '@/factories/validators/query'
import { makeRequiredFields } from '@/factories/validators/validate-required-fields-factory'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('queryAllInvoicesValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeQueryAllInvoicesValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['type']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateFields())
    validations.push(makeValidateLimit())
    validations.push(makeValidateType())
    validations.push(makeValidatePage())
    validations.push(makeValidateSort())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
