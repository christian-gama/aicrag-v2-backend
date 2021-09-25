import { IUser } from '@/domain'

import { EncrypterProtocol, DecoderProtocol } from '@/application/protocols/cryptography'
import { IRefreshToken, VerifyTokenProtocol } from '@/application/protocols/providers'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { RefreshTokenMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/main/factories/helpers'

import {
  makeFakeRefreshToken,
  makeFakeUser,
  makeJwtAdapterStub,
  makeVerifyTokenStub
} from '@/tests/__mocks__'

interface SutTypes {
  sut: RefreshTokenMiddleware
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol & DecoderProtocol
  request: HttpRequest
  verifyRefreshTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAdapterStub()
  const request: HttpRequest = { cookies: { refreshToken: 'any_token' } }
  const verifyRefreshTokenStub = makeVerifyTokenStub()

  const sut = new RefreshTokenMiddleware(httpHelper, jwtAccessToken, verifyRefreshTokenStub)

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    jwtAccessToken,
    request,
    verifyRefreshTokenStub
  }
}

describe('RefreshTokenMiddleware', () => {
  it('Should call verify with token', async () => {
    const { sut, request, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('Should return unauthorized if response is instance of Error', async () => {
    const { sut, httpHelper, request, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new Error()))
  })

  it('Should call jwtAccessToken with correct values', async () => {
    const { sut, fakeUser, jwtAccessToken, request, verifyRefreshTokenStub } = makeSut()
    const encryptSpy = jest.spyOn(jwtAccessToken, 'encrypt')
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(fakeUser))

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith({ userId: fakeUser.personal.id })
  })

  it('Should return ok if succeds', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({ refreshToken: request.cookies?.refreshToken, accessToken: 'any_token' })
    )
  })
})
