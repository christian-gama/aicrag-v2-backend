import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import { makeUpdateEmailByPinValidator, makeRequiredFields, makeValidateEmailPin } from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('updateEmailByPinValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeUpdateEmailByPinValidator()

    const validations: IValidator[] = []

    const fields = ['emailPin']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateEmailPin())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
