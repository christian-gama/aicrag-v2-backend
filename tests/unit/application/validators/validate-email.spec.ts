import { ValidatorProtocol, EmailValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '@/application/usecases/errors'
import { ValidateEmail } from '@/application/usecases/validators'

import { makeEmailValidatorStub } from '@/tests/__mocks__'

import faker from 'faker'

interface SutTypes {
  emailValidatorStub: EmailValidatorProtocol
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()

  const sut = new ValidateEmail(emailValidatorStub)

  return { emailValidatorStub, sut }
}

describe('validateEmail', () => {
  it('should return a new InvalidParamError if email is invalid', () => {
    expect.hasAssertions()

    const { sut, emailValidatorStub } = makeSut()
    const data = { email: 'invalid_email' }
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('email'))
  })

  it('should call emailValidator with correct value', async () => {
    expect.hasAssertions()

    const { emailValidatorStub, sut } = makeSut()
    const data = { email: faker.internet.email() }
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')

    sut.validate(data) as unknown

    expect(isEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should throw if emailValidator throws', () => {
    expect.hasAssertions()

    const { emailValidatorStub, sut } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow('')
  })

  it('should return nothing if succeds', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { email: faker.internet.email() }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })
})
