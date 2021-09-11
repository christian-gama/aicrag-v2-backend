import {
  ValidationComposite,
  ValidatorProtocol
} from '@/application/usecases/validators/credentials'
import {
  makeCredentialsValidatorComposite,
  makeValidateCredentials,
  makeValidateActiveAccount,
  makeRequiredFields,
  makeValidateEmail,
  makeValidatePassword
} from '@/main/factories/validators/credentials-validator'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('CredentialsValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeCredentialsValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['email', 'password']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateEmail())
    validations.push(makeValidatePassword())
    validations.push(makeValidateCredentials())
    validations.push(makeValidateActiveAccount())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
