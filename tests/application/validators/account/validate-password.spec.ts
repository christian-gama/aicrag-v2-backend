import { InvalidParamError } from '@/application/errors'
import { makeSut } from './mocks/validate-password-mock'

describe('ValidateName', () => {
  it('Should return InvalidParamError if password is lesser than 6 characters', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Example Name',
      email: 'example@email.com',
      password: '12345',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return InvalidParamError if password is greater than 32 characters', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Example Name',
      email: 'example@email.com',
      password: '012345678901234567890123456789012',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return InvalidParamError if password is empty', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Example Name',
      email: 'example@email.com',
      password: '',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return nothing if succeds', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Example Name',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toBeFalsy()
  })
})
