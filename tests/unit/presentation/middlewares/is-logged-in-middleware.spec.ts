import { IUser } from '@/domain'

import { IRefreshToken, VerifyTokenProtocol } from '@/application/protocols/providers'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { IsLoggedInMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeRefreshToken, makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: IsLoggedInMiddleware
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  verifyRefreshTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { cookies: { refreshToken: 'any_token' } }
  const verifyRefreshTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new IsLoggedInMiddleware(httpHelper, verifyRefreshTokenStub)

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    request,
    verifyRefreshTokenStub
  }
}

describe('IsLoggedInMiddleware', () => {
  it('Should call verify with correct token', async () => {
    const { sut, request, verifyRefreshTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.refreshToken)
  })

  it('Should return ok with undefined user if fails', async () => {
    const { sut, httpHelper, request, verifyRefreshTokenStub } = makeSut()
    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ user: undefined }))
  })

  it('Should return ok if succeds', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ user: fakeUser }))
  })
})
