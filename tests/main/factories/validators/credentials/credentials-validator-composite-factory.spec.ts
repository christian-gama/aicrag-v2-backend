import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/validation-composite'
import { makeCredentialsValidatorComposite } from '@/main/factories/validators/credentials-validator/credentials-validator-composite-factory'
import { makeValidateCredentials } from '@/main/factories/validators/credentials-validator/validate-credential-factory'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('CredentialsValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeCredentialsValidatorComposite()

    const validations: ValidatorProtocol[] = []
    const validateCredentials = makeValidateCredentials()

    validations.push(validateCredentials)

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
