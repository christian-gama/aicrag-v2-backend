import { IValidator } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidatePassword } from '@/application/validators/user'

import { HttpRequest } from '@/presentation/http/protocols'

import faker from 'faker'

interface SutTypes {
  request: HttpRequest
  sut: IValidator
}

const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { password: faker.internet.password(8) } }

  const sut = new ValidatePassword()

  return { request, sut }
}

describe('validatePassword', () => {
  it('should return InvalidTypeError if password is not a string', () => {
    const { request, sut } = makeSut()
    request.body.password = 123

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('password'))
  })

  it('should return InvalidParamError if password is lesser than 6 characters', () => {
    const { request, sut } = makeSut()
    request.body.password = faker.internet.password(5)

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('password'))
  })

  it('should return InvalidParamError if password is greater than 32 characters', () => {
    const { request, sut } = makeSut()
    request.body.password = faker.internet.password(33)

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('password'))
  })

  it('should return InvalidParamError if password is empty', () => {
    const { request, sut } = makeSut()
    request.body.password = ''

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('password'))
  })

  it('should return nothing if succeeds', () => {
    const { request, sut } = makeSut()
    request.body.password = faker.internet.password(6)
    request.body.password = faker.internet.password(32)

    const value1 = sut.validate(request.body)
    const value2 = sut.validate(request.body)

    expect(value1).toBeFalsy()
    expect(value2).toBeFalsy()
  })
})
