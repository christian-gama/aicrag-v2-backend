import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import {
  makeValidateFields,
  makeValidateLimit,
  makeValidatePage,
  makeValidateSort,
  makeValidateMonth,
  makeValidateYear,
  makeValidateType
} from '@/factories/validators/query'
import { makeInvoiceByMonthValidator } from '@/factories/validators/query/invoice-by-month-validator-factory'
import { makeValidateTaskId } from '@/factories/validators/task'
import { makeRequiredFields } from '@/factories/validators/validate-required-fields-factory'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('getInvoiceByMonthValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeInvoiceByMonthValidator()

    const validations: IValidator[] = []

    const fields = ['month', 'type', 'year']
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
    validations.push(makeValidateType())
    validations.push(makeValidateYear())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
