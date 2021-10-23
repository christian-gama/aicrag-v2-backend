import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeRequiredFields,
  makeSendEmailCodeValidator,
  makeValidateEmail,
  makeValidateEmailExists,
  makeValidateTempEmail
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('sendEmailCodeValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeSendEmailCodeValidator()

    const validations: IValidator[] = []

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
