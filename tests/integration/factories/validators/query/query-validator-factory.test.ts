import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import { makeQueryValidator } from '@/factories/validators/query'
import { makeValidateFields } from '@/factories/validators/query/validate-fields-factory'
import { makeValidateLimit } from '@/factories/validators/query/validate-limit-factory'
import { makeValidatePage } from '@/factories/validators/query/validate-page-factory'
import { makeValidateSort } from '@/factories/validators/query/validate-sort-factory'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('queryValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeQueryValidator()

    const validations: ValidatorProtocol[] = []

    // Must have this exact validation order
    validations.push(makeValidateFields())
    validations.push(makeValidateLimit())
    validations.push(makeValidatePage())
    validations.push(makeValidateSort())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
