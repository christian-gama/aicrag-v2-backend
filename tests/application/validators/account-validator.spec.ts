import { InvalidParamError } from '@/application/errors/invalid-param-error'
import { AccountValidator } from '@/application/validators/account-validator'

describe('AccountValidator', () => {
  it('Should return a new InvalidParamError if email is invalid', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'any_name',
      email: 'invalid_email',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }

    const value = sut.validateEmail(account.email)

    expect(value).toEqual(new InvalidParamError('email'))
  })
})
