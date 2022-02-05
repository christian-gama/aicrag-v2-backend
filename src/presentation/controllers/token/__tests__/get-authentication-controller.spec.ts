import { IEncrypter } from '@/domain/cryptography'
import { IVerifyToken } from '@/domain/providers'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeAccessTokenEncrypter } from '@/main/factories/cryptography'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'
import { GetAuthenticationController } from '..'

interface SutTypes {
  accessTokenEncrypterStub: IEncrypter
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: GetAuthenticationController
  verifyAccessTokenStub: IVerifyToken
  verifyRefreshTokenStub: IVerifyToken
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const accessTokenEncrypterStub = makeAccessTokenEncrypter()
  const request: HttpRequest = {
    headers: { 'x-access-token': 'any_token', 'x-refresh-token': 'any_token' }
  }

  const verifyAccessTokenStub = makeVerifyTokenStub(fakeUser)
  const verifyRefreshTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new GetAuthenticationController(
    accessTokenEncrypterStub,
    httpHelper,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  )

  return { accessTokenEncrypterStub, httpHelper, request, sut, verifyAccessTokenStub, verifyRefreshTokenStub }
}

describe('getAuthentication', () => {
  it('should return authentication equal to none if user is not logged in', async () => {
    const { httpHelper, request, sut, verifyRefreshTokenStub, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockImplementation(async () => new Error())
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockImplementation(async () => new Error())

    const promise = await sut.handle(request)

    expect(promise).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', authentication: 'none', refreshToken: 'any_token' })
    )
  })

  it('should return authentication equal to partial if user is not logged in', async () => {
    const { httpHelper, request, sut, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockImplementation(async () => new Error())

    const promise = await sut.handle(request)

    expect(promise).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', authentication: 'partial', refreshToken: 'any_token' })
    )
  })

  it('should return authentication equal to protected if succeeds', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', authentication: 'protected', refreshToken: 'any_token' })
    )
  })
})
