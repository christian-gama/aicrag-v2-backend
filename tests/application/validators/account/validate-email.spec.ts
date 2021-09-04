import { InvalidParamError } from '@/application/errors'
import { makeSut } from './mocks/validate-email-mock'

import faker from 'faker'

describe('ValidateEmail', () => {
  it('Should return a new InvalidParamError if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)

    const data = { email: 'invalid_email' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('email'))
  })

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()

    const data = { email: faker.internet.email() }

    const value = sut.validate(data)

    expect(value).toBeFalsy()
  })

  it('Should call emailValidator with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')

    const data = { email: faker.internet.email() }

    sut.validate(data)

    expect(isEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('Should throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
