import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'
import { makeRequiredFields } from '@/main/factories/validators/activate-account-validator'
import { makeValidatePassword } from '@/main/factories/validators/credentials-validator'
import { makeValidateEmail } from '@/main/factories/validators/forgot-password-validator'
import { makeUserValidatorComposite, makeValidateName, makeValidatePasswordComparasion } from '@/main/factories/validators/user-validator'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('UserValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeUserValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidateName())
    validations.push(makeValidateEmail())
    validations.push(makeValidatePassword())
    validations.push(makeValidatePasswordComparasion())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
