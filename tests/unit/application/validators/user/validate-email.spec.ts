import { ValidatorProtocol, EmailValidatorProtocol } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateEmail } from '@/application/validators/user'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeEmailValidatorStub } from '@/tests/__mocks__'

import faker from 'faker'

interface SutTypes {
  emailValidatorStub: EmailValidatorProtocol
  request: HttpRequest
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const request: HttpRequest = {
    body: { email: faker.internet.email() }
  }

  const sut = new ValidateEmail(emailValidatorStub)

  return { emailValidatorStub, request, sut }
}

describe('validateEmail', () => {
  it('should return InvalidTypeError if email is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.email = 123

    const error = await sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidTypeError('email'))
  })

  it('should return a new InvalidParamError if email is invalid', () => {
    expect.hasAssertions()

    const { emailValidatorStub, request, sut } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)
    request.body.email = 'invalid_email'

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('email'))
  })

  it('should call emailValidator with correct value', async () => {
    expect.hasAssertions()

    const { emailValidatorStub, request, sut } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')

    sut.validate(request.body) as unknown

    expect(isEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should throw if emailValidator throws', () => {
    expect.hasAssertions()

    const { emailValidatorStub, sut } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow('')
  })

  it('should return nothing if succeeds', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const value = sut.validate(request.body)

    expect(value).toBeUndefined()
  })
})
