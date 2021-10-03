import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeActivateAccountValidatorComposite,
  makeRequiredFields,
  makeValidateActivationCode
} from '@/factories/validators'

jest.mock('../../../../src/application/validators/validation-composite.ts')

describe('activateAccountValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeActivateAccountValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['email', 'activationCode']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateActivationCode())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
