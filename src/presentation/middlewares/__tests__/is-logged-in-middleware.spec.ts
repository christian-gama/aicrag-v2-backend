import { IUser } from '@/domain'
import { IRefreshToken, IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { IsLoggedInMiddleware } from '@/presentation/middlewares'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeRefreshToken, makeFakeUser, makeUserRepositoryStub, makeVerifyTokenStub } from '@/tests/__mocks__'
import MockDate from 'mockdate'

interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: IsLoggedInMiddleware
  verifyRefreshTokenStub: IVerifyToken
  userRepositoryStub: IUserRepository
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
    const { request, sut, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('should return ok with undefined user if fails', async () => {
    const { httpHelper, request, sut, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ user: undefined }))
  })

  it('should call updateById with correct values', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.lastSeenAt': new Date(Date.now())
    })
  })

  it('should return ok if succeeds', async () => {
    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ user: fakeUser }))
  })
})
