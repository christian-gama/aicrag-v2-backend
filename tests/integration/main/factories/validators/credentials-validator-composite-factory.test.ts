import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'
import { makeRequiredFields } from '@/main/factories/validators/activate-account-validator'
import { makeCredentialsValidatorComposite, makeValidatePassword, makeValidatePasswordMatch } from '@/main/factories/validators/credentials-validator'
import { makeValidateEmail, makeValidateEmailExists, makeValidateActiveAccount } from '@/main/factories/validators/forgot-password-validator'

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
    validations.push(makeValidateEmailExists())
    validations.push(makeValidatePasswordMatch())
    validations.push(makeValidateActiveAccount())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
