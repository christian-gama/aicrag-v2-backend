import { IUser } from '@/domain'

import { EncrypterProtocol, DecoderProtocol } from '@/application/protocols/cryptography'
import { IRefreshToken, VerifyTokenProtocol } from '@/application/protocols/providers'
import {
  ExpiredTokenError,
  InvalidTokenError,
  TokenMissingError
} from '@/application/usecases/errors'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { ProtectedMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/main/factories/helpers'

import {
  makeFakeRefreshToken,
  makeFakeUser,
  makeJwtAdapterStub,
  makeVerifyTokenStub
} from '@/tests/__mocks__'

interface SutTypes {
  sut: ProtectedMiddleware
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol & DecoderProtocol
  request: HttpRequest
  verifyAccessTokenStub: VerifyTokenProtocol
  verifyRefreshTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAdapterStub()
  const request: HttpRequest = { cookies: { accessToken: 'any_token', refreshToken: 'any_token' } }
  const verifyAccessTokenStub = makeVerifyTokenStub()
  const verifyRefreshTokenStub = makeVerifyTokenStub()

  const sut = new ProtectedMiddleware(
    httpHelper,
    jwtAccessToken,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  )

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    jwtAccessToken,
    request,
    verifyAccessTokenStub,
    verifyRefreshTokenStub
  }
}

describe('ProtectedMiddleware', () => {
  it('Should call verify with token', async () => {
    const { sut, request, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('Should return unauthorized if refresh token response is instance of InvalidTokenError', async () => {
    const { sut, httpHelper, request, verifyAccessTokenStub } = makeSut()
    jest
      .spyOn(verifyAccessTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('Should return unauthorized if access token response is instance of TokenMissingError', async () => {
    const { sut, httpHelper, request, verifyAccessTokenStub } = makeSut()
    jest
      .spyOn(verifyAccessTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new TokenMissingError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should return ok if succeds', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({ refreshToken: request.cookies?.refreshToken, accessToken: 'any_token' })
    )
  })

  it('Should call encrypt if response is instance of ExpiredTokenError', async () => {
    const {
      sut,
      fakeUser,
      jwtAccessToken,
      request,
      verifyAccessTokenStub,
      verifyRefreshTokenStub
    } = makeSut()
    const encryptSpy = jest.spyOn(jwtAccessToken, 'encrypt')
    jest
      .spyOn(verifyAccessTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new ExpiredTokenError()))
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(fakeUser))

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith({ userId: fakeUser.personal.id })
  })

  it('Should call verify with token', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.accessToken)
  })
})
