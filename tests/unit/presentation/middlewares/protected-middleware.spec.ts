import { IUser } from '@/domain'
import { EncrypterProtocol } from '@/domain/cryptography'
import { IRefreshToken, VerifyTokenProtocol } from '@/domain/providers'

import { ExpiredTokenError, InvalidTokenError, TokenMissingError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'
import { ProtectedMiddleware } from '@/presentation/middlewares'

import {
  makeEncrypterStub,
  makeFakeRefreshToken,
  makeFakeUser,
  makeVerifyTokenStub
} from '@/tests/__mocks__'

import { makeHttpHelper } from '@/factories/helpers'

interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  refreshTokenEncrypter: EncrypterProtocol
  request: HttpRequest
  sut: ProtectedMiddleware
  verifyAccessTokenStub: VerifyTokenProtocol
  verifyRefreshTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const refreshTokenEncrypter = makeEncrypterStub()
  const request: HttpRequest = { cookies: { accessToken: 'any_token', refreshToken: 'any_token' } }
  const verifyAccessTokenStub = makeVerifyTokenStub(fakeUser)
  const verifyRefreshTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new ProtectedMiddleware(
    httpHelper,
    refreshTokenEncrypter,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  )

  return {
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    refreshTokenEncrypter,
    request,
    sut,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  }
}

describe('protectedMiddleware', () => {
  it('should call refresh token verify with correct token', async () => {
    expect.hasAssertions()

    const { request, sut, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('should return unauthorized if refresh token response is instance of InvalidTokenError', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, verifyRefreshTokenStub } = makeSut()
    jest
      .spyOn(verifyRefreshTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should return unauthorized if access token response is instance of InvalidTokenError', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, verifyAccessTokenStub } = makeSut()
    jest
      .spyOn(verifyAccessTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should return unauthorized if access token response is instance of TokenMissingError', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, verifyAccessTokenStub } = makeSut()
    jest
      .spyOn(verifyAccessTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new TokenMissingError()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('should return ok if succeeds', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', refreshToken: request.cookies?.refreshToken })
    )
  })

  it('should call encrypt if response is instance of ExpiredTokenError', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, refreshTokenEncrypter, request, verifyAccessTokenStub } = makeSut()
    const encryptSpy = jest.spyOn(refreshTokenEncrypter, 'encrypt')
    jest
      .spyOn(verifyAccessTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new ExpiredTokenError()))

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith({ userId: fakeUser.personal.id })
  })

  it('should call access token verify with correct token', async () => {
    expect.hasAssertions()

    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.accessToken)
  })
})
