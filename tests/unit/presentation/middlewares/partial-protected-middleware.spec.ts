import { IUser } from '@/domain'

import { IRefreshToken, VerifyTokenProtocol } from '@/application/protocols/providers'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { PartialProtectedMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeRefreshToken, makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: PartialProtectedMiddleware
  verifyAccessTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { cookies: { accessToken: 'any_token' } }
  const verifyAccessTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new PartialProtectedMiddleware(httpHelper, verifyAccessTokenStub)

  return {
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    request,
    sut,
    verifyAccessTokenStub
  }
}

describe('partialProtectedMiddleware', () => {
  it('should call verify with token', async () => {
    expect.hasAssertions()

    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.accessToken)
  })

  it('should return unauthorized if response is instance of Error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.unauthorized(new Error()))
  })

  it('should return ok if succeds', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ accessToken: 'any_token' }))
  })
})
