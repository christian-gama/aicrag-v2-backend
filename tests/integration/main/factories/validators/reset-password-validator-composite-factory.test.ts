import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'

import {
  makeRequiredFields,
  makeValidatePassword,
  makeValidatePasswordComparasion
} from '@/main/factories/validators'
import { makeResetPasswordValidatorComposite } from '@/main/factories/validators/reset-password-validator-composite-factory'

jest.mock('../../../../../src/application/usecases/validators/validation-composite.ts')

describe('CredentialsValidator Factory', () => {
  it('Should create factory with all validations', () => {
    makeResetPasswordValidatorComposite()

    const validations: ValidatorProtocol[] = []

    const fields = ['password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(makeRequiredFields(field))
    }

    validations.push(makeValidatePassword())
    validations.push(makeValidatePasswordComparasion())

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
