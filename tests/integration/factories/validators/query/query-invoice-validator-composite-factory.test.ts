import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import {
  makeValidateFields,
  makeValidateLimit,
  makeValidatePage,
  makeValidateSort,
  makeValidateMonth,
  makeValidateYear
} from '@/factories/validators/query'
import { makeQueryInvoiceValidatorComposite } from '@/factories/validators/query/query-invoice-validator-composite-factory'
import { makeValidateTaskId } from '@/factories/validators/task'
import { makeRequiredFields } from '@/factories/validators/validate-required-fields-factory'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('queryInvoiceValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeQueryInvoiceValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['month', 'year']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateFields())
    validations.push(makeValidateLimit())
    validations.push(makeValidateMonth())
    validations.push(makeValidatePage())
    validations.push(makeValidateSort())
    validations.push(makeValidateTaskId())
    validations.push(makeValidateYear())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
