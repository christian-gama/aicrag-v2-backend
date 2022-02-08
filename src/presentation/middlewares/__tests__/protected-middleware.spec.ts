import { IUser } from '@/domain'
import { IGenerateToken, IRefreshToken, IVerifyToken } from '@/domain/providers'
import { ExpiredTokenError, InvalidTokenError, TokenMissingError } from '@/application/errors'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { ProtectedMiddleware } from '@/presentation/middlewares'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import { makeFakeRefreshToken, makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  generateAccessTokenStub: IGenerateToken
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: ProtectedMiddleware
  verifyAccessTokenStub: IVerifyToken
  verifyRefreshTokenStub: IVerifyToken
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const generateAccessTokenStub = makeGenerateAccessToken()
  const request: HttpRequest = { cookies: { accessToken: 'any_token', refreshToken: 'any_token' } }
  const verifyAccessTokenStub = makeVerifyTokenStub(fakeUser)
  const verifyRefreshTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new ProtectedMiddleware(
    generateAccessTokenStub,
    httpHelper,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  )

  return {
    fakeRefreshToken,
    fakeUser,
    generateAccessTokenStub,
    httpHelper,
    request,
    sut,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  }
}

describe('protectedMiddleware', () => {
  it('should call refresh token verify with correct token', async () => {
    const { request, sut, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('should return unauthorized if refresh token response is instance of InvalidTokenError', async () => {
    const { httpHelper, request, sut, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should return unauthorized if access token response is instance of InvalidTokenError', async () => {
    const { httpHelper, request, sut, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should return unauthorized if access token response is instance of TokenMissingError', async () => {
    const { httpHelper, request, sut, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new TokenMissingError()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('should return ok if succeeds', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', refreshToken: request.cookies?.refreshToken })
    )
  })

  it('should call generate if response is instance of ExpiredTokenError', async () => {
    const { sut, fakeUser, generateAccessTokenStub, request, verifyAccessTokenStub } = makeSut()
    const encryptSpy = jest.spyOn(generateAccessTokenStub, 'generate')
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new ExpiredTokenError()))

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call access token verify with correct token', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.accessToken)
  })
})
