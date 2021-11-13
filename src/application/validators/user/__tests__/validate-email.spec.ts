import { IValidator, IEmailValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateEmail } from '@/application/validators/user'
import { HttpRequest } from '@/presentation/http/protocols'
import { makeEmailValidatorStub } from '@/tests/__mocks__'
import faker from 'faker'

interface SutTypes {
  emailValidatorStub: IEmailValidator
  request: HttpRequest
  sut: IValidator
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
    const { request, sut } = makeSut()
    request.body.email = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('email', 'string', typeof request.body.email))
  })

  it('should return a new InvalidParamError if email is invalid', () => {
    const { emailValidatorStub, request, sut } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)
    request.body.email = 'invalid_email'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('email'))
  })

  it('should call emailValidator with correct value', async () => {
    const { emailValidatorStub, request, sut } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')

    sut.validate(request.body) as unknown

    expect(isEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should throw if emailValidator throws', () => {
    const { emailValidatorStub, sut } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow('')
  })

  it('should return nothing if succeeds', () => {
    const { request, sut } = makeSut()

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if param is undefined', () => {
    const { sut } = makeSut()
    const data = {}

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })
})
