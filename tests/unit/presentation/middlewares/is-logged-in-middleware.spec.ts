import { IUser } from '@/domain'
import { IRefreshToken, VerifyTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'
import { IsLoggedInMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeRefreshToken,
  makeFakeUser,
  makeUserRepositoryStub,
  makeVerifyTokenStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: IsLoggedInMiddleware
  verifyRefreshTokenStub: VerifyTokenProtocol
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { cookies: { refreshToken: 'any_token' } }
  const verifyRefreshTokenStub = makeVerifyTokenStub(fakeUser)
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new IsLoggedInMiddleware(httpHelper, userRepositoryStub, verifyRefreshTokenStub)

  return {
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    request,
    sut,
    userRepositoryStub,
    verifyRefreshTokenStub
  }
}

describe('isLoggedInMiddleware', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call verify with correct token', async () => {
    expect.hasAssertions()

    const { request, sut, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('should return ok with undefined user if fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: undefined }))
  })

  it('should call updateUser with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.lastSeenAt': new Date(Date.now())
    })
  })

  it('should return ok if succeeds', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: fakeUser }))
  })
})
