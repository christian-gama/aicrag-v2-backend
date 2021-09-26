import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import { makeActivateAccountValidatorComposite, makeRequiredFields, makeValidateActivationCode } from '@/main/factories/validators'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('activateAccountValidator Factory', () => {
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
