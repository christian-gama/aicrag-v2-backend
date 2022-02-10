import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import { makeFakeUser, makeFilterUserDataStub, makeVerifyTokenStub } from '@/tests/__mocks__'
import { GetAuthenticationController } from '..'

interface SutTypes {
  filterUserDataStub: IFilterUserData
  generateAccessTokenStub: IGenerateToken
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: GetAuthenticationController
  verifyAccessTokenStub: IVerifyToken
  verifyRefreshTokenStub: IVerifyToken
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const generateAccessTokenStub = makeGenerateAccessToken()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const request: HttpRequest = {
    headers: { 'x-access-token': 'any_token', 'x-refresh-token': 'any_token' }
  }

  const verifyAccessTokenStub = makeVerifyTokenStub(fakeUser)
  const verifyRefreshTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new GetAuthenticationController(
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  )

  return {
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    request,
    sut,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  }
}

describe('getAuthentication', () => {
  it('should return authentication equal to none if user is not logged in', async () => {
    const { httpHelper, request, sut, verifyRefreshTokenStub, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockImplementation(async () => new Error())
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockImplementation(async () => new Error())

    const promise = await sut.handle(request)

    expect(promise).toStrictEqual(httpHelper.ok({ authentication: 'none' }))
  })

  it('should return authentication equal to partial if user is not logged in', async () => {
    const { httpHelper, request, sut, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockImplementation(async () => new Error())

    const promise = await sut.handle(request)

    expect(promise).toStrictEqual(httpHelper.ok({ accessToken: 'any_token', authentication: 'partial' }))
  })

  it('should return authentication equal to protected if succeeds', async () => {
    const { filterUserDataStub, httpHelper, request, sut } = makeSut()
    request.user = makeFakeUser()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        accessToken: 'any_token',
        authentication: 'protected',
        refreshToken: 'any_token',
        user: filterUserDataStub.filter(request.user)
      })
    )
  })

  it('should call generate if access token was expired', async () => {
    const { generateAccessTokenStub, sut, verifyAccessTokenStub, request } = makeSut()
    const error = new Error()
    error.name = 'ExpiredTokenError'
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValue(Promise.resolve(error))
    jest.spyOn(generateAccessTokenStub, 'generate').mockReturnValue('any_token')

    await sut.handle(request)

    expect(generateAccessTokenStub.generate).toHaveBeenCalled()
  })
})
