import { ValidationComposite, ValidatorProtocol } from '@/application/usecases/validators/account'
import { makeActivateAccountValidatorComposite, makeRequiredFields, makeValidateActivationCode } from '@/main/factories/validators/activate-account-validator'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('AccountValidator Factory', () => {
  it('Should create factory with all validations', () => {
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
