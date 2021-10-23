import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeActivateAccountValidator,
  makeRequiredFields,
  makeValidateActivationCode
} from '@/factories/validators/user'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('activateAccountValidator', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeActivateAccountValidator()

    const validations: IValidator[] = []

    const fields = ['email', 'activationCode']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateActivationCode())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
