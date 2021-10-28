import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeActivateAccountValidator,
  makeRequiredFields,
  makeValidateActivationPin
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('activateAccountValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeActivateAccountValidator()

    const validations: IValidator[] = []

    const fields = ['email', 'activationPin']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateActivationPin())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
