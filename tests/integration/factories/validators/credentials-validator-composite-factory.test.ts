import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/user'

import {
  makeCredentialsValidatorComposite,
  makeRequiredFields,
  makeValidateEmail,
  makeValidatePassword,
  makeValidateEmailExists,
  makeValidatePasswordMatch,
  makeValidateActiveAccount
} from '@/factories/validators/user'

jest.mock('../../../../src/application/validators/validation-composite.ts')

describe('credentialsValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

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
