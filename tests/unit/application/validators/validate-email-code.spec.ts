import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidCodeError, CodeIsExpiredError } from '@/application/usecases/errors'
import { ValidateEmailCode } from '@/application/usecases/validators'

import { HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateEmailCode
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.temporary.tempEmail = 'any_email@mail.com'
  fakeUser.temporary.tempEmailCode = 'abcde'
  fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() + 10 * 60 * 1000)
  const request: HttpRequest = {
    body: {
      email: fakeUser.personal.email,
      tempEmailCode: fakeUser.temporary.tempEmailCode
    }
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ValidateEmailCode(userDbRepositoryStub)

  return { fakeUser, request, sut, userDbRepositoryStub }
}

describe('validateEmailCode', () => {
  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(request.body)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return an InvalidCodeError if email code is not valid', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.tempEmailCode = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
  })

  it('should return an InvalidCode if there is no temporary email', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmail = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
  })

  it('should return a CodeIsExpiredError if temporary email code is expired', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() - 1000)

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new CodeIsExpiredError())
  })

  it('should return an InvalidCodeError if there is no tempCodeExpiration', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut } = makeSut()
    fakeUser.temporary.tempEmailCodeExpiration = null

    const value = await sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidCodeError())
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
