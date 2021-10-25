import { IUser } from '@/domain'

import { InvalidCodeError, CodeIsExpiredError, InvalidTypeError } from '@/application/errors'
import { ValidateEmailCode } from '@/application/validators/user'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateEmailCode
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.temporary.tempEmail = 'any_email@mail.com'
  fakeUser.temporary.tempEmailCode = 'abcde'
  fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() + 10 * 60 * 1000)
  const request: HttpRequest = {
    body: {
      emailCode: fakeUser.temporary.tempEmailCode,
      user: fakeUser
    }
  }

  const sut = new ValidateEmailCode()

  return { fakeUser, request, sut }
}

describe('validateEmailCode', () => {
  it('should return InvalidTypeError if tempEmailCode is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.emailCode = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('tempEmailCode'))
  })

  it('should return an InvalidCodeError if email code is not valid', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.emailCode = '123'

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidCodeError())
  })

  it('should return an InvalidCode if there is no temporary email', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmail = null

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidCodeError())
  })

  it('should return an InvalidCode if there is no temporary email code', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailCode = null

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidCodeError())
  })

  it('should return a CodeIsExpiredError if temporary email code is expired', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() - 1000)

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new CodeIsExpiredError())
  })

  it('should return an InvalidCodeError if there is no tempCodeExpiration', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailCodeExpiration = null

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidCodeError())
  })

  it('should return an InvalidCodeError if there is no user', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.user = undefined

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidCodeError())
  })
})
