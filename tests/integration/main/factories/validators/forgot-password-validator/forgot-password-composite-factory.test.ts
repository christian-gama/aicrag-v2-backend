import {
  ValidationComposite,
  ValidatorProtocol
} from '@/application/usecases/validators/credentials-validator'
import {
  makeForgotPasswordComposite,
  makeRequiredFields,
  makeValidateEmail,
  makeValidateEmailExists
} from '@/main/factories/validators/forgot-password-validator'

jest.mock('../../../../../../src/application/usecases/validators/validation-composite.ts')

describe('CredentialsValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeForgotPasswordComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['email']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    // Must have this exact validation order
    validations.push(makeValidateEmail())
    validations.push(makeValidateEmailExists())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
