import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'

import {
  InvalidCodeError,
  CodeIsExpiredError,
  AccountAlreadyActivatedError,
  InvalidTypeError
} from '@/application/errors'
import { ValidateActivationCode } from '@/application/validators/user'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateActivationCode
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.temporary.activationCode = 'abcde'
  fakeUser.temporary.activationCodeExpiration = new Date(Date.now() + 10 * 60 * 1000)
  const request: HttpRequest = {
    body: {
      activationCode: fakeUser.temporary.activationCode,
      email: fakeUser.personal.email
    }
  }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateActivationCode(userRepositoryStub)

  return { fakeUser, request, sut, userRepositoryStub }
}

describe('validateActivationCode', () => {
  it('should return InvalidTypeError if activationCode is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.activationCode = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('activationCode'))
  })

  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.validate(request.body)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return an InvalidCode if activation code is different from user activation code', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.activationCode = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
  })

  it('should return a CodeIsExpiredError if activation code is expired', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000)

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new CodeIsExpiredError())
  })

  it('should return an InvalidCodeError if there is no tempCodeExpiration', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.activationCodeExpiration = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
  })

  it('should return an AccountAlreadyActivatedError if there is no tempCodeExpiration', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.settings.accountActivated = true

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new AccountAlreadyActivatedError())
  })

  it('should return an InvalidCodeError if there is no user', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
  })
})
