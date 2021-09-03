import { AccountValidator } from '@/application/validators/account-validator'
import { MissingParamError, InvalidParamError } from '@/application//errors'

describe('AccountValidator', () => {
  it('Should return a new InvalidParamError if email is invalid', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'Example',
      email: 'invalid_email',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validateEmail(account.email)

    expect(value).toEqual(new InvalidParamError('email'))
  })

  it('Should return a new InvalidParamError if name is invalid', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'Ex@mple',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validateName(account.name)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return a new InvalidParamError if password is lesser than 6 characters', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'Example',
      email: 'example@email.com',
      password: 'pass',
      passwordConfirmation: 'password'
    }

    const value = sut.validatePassword(account.password)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return a new InvalidParamError if password is greater than 32 characters', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'Example',
      email: 'example@email.com',
      password: 'passwordpasswordpasswordpasswordp',
      passwordConfirmation: 'password'
    }

    const value = sut.validatePassword(account.password)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return a new InvalidParamError if passwords are different', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'Example',
      email: 'example@email.com',
      password: 'password1',
      passwordConfirmation: 'password2'
    }

    const value = sut.validatePasswordEquality(account.password, account.passwordConfirmation)

    expect(value).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return a new MissingParamError if email is missing', () => {
    const sut = new AccountValidator()
    const account = {
      name: 'Example',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validateRequiredFields(account)

    expect(value).toEqual(new MissingParamError('email'))
  })

  it('Should return a new MissingParamError if name is missing', () => {
    const sut = new AccountValidator()
    const account = {
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validateRequiredFields(account)

    expect(value).toEqual(new MissingParamError('name'))
  })
})
