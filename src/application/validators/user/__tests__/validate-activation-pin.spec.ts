import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import {
  InvalidPinError,
  PinIsExpiredError,
  AccountAlreadyActivatedError,
  InvalidTypeError
} from '@/application/errors'
import { ValidateActivationPin } from '@/application/validators/user'
import { HttpRequest } from '@/presentation/http/protocols'
import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateActivationPin
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.temporary.activationPin = 'abcde'
  fakeUser.temporary.activationPinExpiration = new Date(Date.now() + 10 * 60 * 1000)
  const request: HttpRequest = {
    body: {
      activationPin: fakeUser.temporary.activationPin,
      userId: fakeUser.personal.id
    }
  }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateActivationPin(userRepositoryStub)

  return { fakeUser, request, sut, userRepositoryStub }
}

describe('validateActivationCode', () => {
  it('should return InvalidTypeError if activationPin is not a string', async () => {
    const { request, sut } = makeSut()
    request.body.activationPin = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('activationPin', 'string', typeof request.body.activationPin))
  })

  it('should call findById with correct email', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findById')

    await sut.validate(request.body)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.userId)
  })

  it('should return an InvalidCode if activation pin is different from user activation pin', async () => {
    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.activationPin = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidPinError())
  })

  it('should return a PinIsExpiredError if activation pin is expired', async () => {
    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.activationPinExpiration = new Date(Date.now() - 1000)

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new PinIsExpiredError())
  })

  it('should return an InvalidPinError if there is no tempCodeExpiration', async () => {
    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.activationPinExpiration = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidPinError())
  })

  it('should return an AccountAlreadyActivatedError if there is no tempCodeExpiration', async () => {
    const { fakeUser, request, sut } = makeSut()
    fakeUser.settings.accountActivated = true

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new AccountAlreadyActivatedError())
  })

  it('should return an InvalidPinError if there is no user', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null))

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidPinError())
  })

  it('should return undefined if param is undefined', async () => {
    const { sut } = makeSut()
    const data = {}

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })
})
