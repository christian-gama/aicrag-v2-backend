import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { makeCredentialsValidatorComposite } from '@/main/factories/validators/credentials-validator/credentials-validator-composite-factory'
import { makeValidateCredentials } from '@/main/factories/validators/credentials-validator/validate-credential-factory'
import { makeRequiredFields, makeValidateEmail, makeValidatePassword } from '@/main/factories/validators/account-validator'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('CredentialsValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeCredentialsValidatorComposite()

    const validations: ValidatorProtocol[] = []
    const validateCredentials = makeValidateCredentials()

    const fields = ['email', 'password']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateEmail())
    validations.push(makeValidatePassword())
    validations.push(validateCredentials)

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
