import { InvalidParamError } from '@/infra/errors'
import { makeSut } from './mocks/validate-email-mock'
import { config } from '@/tests/config'

import faker from 'faker'

describe('ValidateEmail', () => {
  it('Should return a new InvalidParamError if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)

    const data = { email: 'invalid_email' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('email'))
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

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()

    let error = 0
    for (let i = 0; i < config.loopTimes; i++) {
      const data = { email: faker.internet.email() }

      const value = sut.validate(data)

      if (value !== undefined) error++
    }

    expect(error).toBe(0)
  })
})
