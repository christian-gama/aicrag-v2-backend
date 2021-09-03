import { InvalidParamError } from '@/application/errors'
import { makeSut } from './mocks/validate-name-mock'

describe('ValidateName', () => {
  it('Should return InvalidParamError if name is invalid with symbols', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Ex@mple Name',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return InvalidParamError if name is invalid with numbers', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Example N4me',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return InvalidParamError if name is invalid with both numbers and symbols', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Ex@mple N4me',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('name'))
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
