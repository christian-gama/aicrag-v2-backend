import { MissingParamError, InvalidParamError } from '@/application//errors'
import { makeSut } from './mocks/account-validator-mocks'

describe('AccountValidator', () => {
  it('Should return a new InvalidParamError if email is invalid', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
    const account = {
      name: 'Example',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validateRequiredFields(account, 'email')

    expect(value).toEqual(new MissingParamError('email'))
  })

  it('Should return a new MissingParamError if name is missing', () => {
    const { sut } = makeSut()
    const account = {
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validateRequiredFields(account, 'name')

    expect(value).toEqual(new MissingParamError('name'))
  })

  it('Should return a new MissingParamError if password is missing', () => {
    const { sut } = makeSut()
    const account = {
      name: 'Example',
      email: 'example@email.com',
      passwordConfirmation: 'password'
    }

    const value = sut.validateRequiredFields(account, 'password')

    expect(value).toEqual(new MissingParamError('password'))
  })

  it('Should return a new MissingParamError if passwordConfirmation is missing', () => {
    const { sut } = makeSut()
    const account = {
      name: 'Example',
      email: 'example@email.com',
      password: 'password'
    }

    const value = sut.validateRequiredFields(account, 'passwordConfirmation')

    expect(value).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return true if all validatons succeds', () => {
    const { sut } = makeSut()
    const account = {
      name: 'Example',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const requiredEmail = sut.validateRequiredFields(account, 'email')
    expect(requiredEmail).toBe(true)

    const requiredName = sut.validateRequiredFields(account, 'name')
    expect(requiredName).toBe(true)

    const requiredPassword = sut.validateRequiredFields(account, 'password')
    expect(requiredPassword).toBe(true)

    const requiredPasswordConfirmation = sut.validateRequiredFields(account, 'passwordConfirmation')
    expect(requiredPasswordConfirmation).toBe(true)

    const email = sut.validateEmail(account.email)
    expect(email).toBe(true)

    const name = sut.validateName(account.name)
    expect(name).toBe(true)

    const password = sut.validatePassword(account.password)
    expect(password).toBe(true)

    const passwordEquality = sut.validatePasswordEquality(
      account.password,
      account.passwordConfirmation
    )
    expect(passwordEquality).toBe(true)
  })
})
