import { IUser } from '@/domain'

import { InvalidPinError, PinIsExpiredError, InvalidTypeError } from '@/application/errors'
import { ValidateEmailPin } from '@/application/validators/user'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateEmailPin
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.temporary.tempEmail = 'any_email@mail.com'
  fakeUser.temporary.tempEmailPin = 'abcde'
  fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() + 10 * 60 * 1000)
  const request: HttpRequest = {
    body: {
      emailPin: fakeUser.temporary.tempEmailPin,
      user: fakeUser
    }
  }

  const sut = new ValidateEmailPin()

  return { fakeUser, request, sut }
}

describe('validateEmailPin', () => {
  it('should return InvalidTypeError if tempEmailPin is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.emailPin = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('tempEmailPin'))
  })

  it('should return an InvalidPinError if email pin is not valid', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.emailPin = '123'

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidPinError())
  })

  it('should return an InvalidCode if there is no temporary email', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmail = null

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidPinError())
  })

  it('should return an InvalidCode if there is no temporary email pin', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailPin = null

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidPinError())
  })

  it('should return a PinIsExpiredError if temporary email pin is expired', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() - 1000)

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new PinIsExpiredError())
  })

  it('should return an InvalidPinError if there is no tempEmailPinExpiration', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailPinExpiration = null

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidPinError())
  })

  it('should return an InvalidPinError if there is no user', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.user = undefined

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidPinError())
  })
})
