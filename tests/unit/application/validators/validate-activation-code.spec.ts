import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import {
  InvalidCodeError,
  CodeIsExpiredError,
  AccountAlreadyActivatedError
} from '@/application/errors'
import { ValidateActivationCode } from '@/application/validators'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateActivationCode
  userDbRepositoryStub: UserDbRepositoryProtocol
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
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ValidateActivationCode(userDbRepositoryStub)

  return { fakeUser, request, sut, userDbRepositoryStub }
}

describe('validateActivationCode', () => {
  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(request.body)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return an InvalidCodeError if actiavtion code is not valid', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.activationCode = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
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

    const { request, sut, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
  })
})
