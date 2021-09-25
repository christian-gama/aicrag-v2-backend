import { IUser } from '@/domain'

import { VerifyTokenProtocol } from '@/application/protocols/providers'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { AccessTokenMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: AccessTokenMiddleware
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  verifyAccessTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { cookies: { accessToken: 'any_token' } }
  const verifyAccessTokenStub = makeVerifyTokenStub()

  const sut = new AccessTokenMiddleware(httpHelper, verifyAccessTokenStub)

  return {
    sut,
    fakeUser,
    httpHelper,
    request,
    verifyAccessTokenStub
  }
}

describe('AccessTokenMiddleware', () => {
  it('Should call verify with token', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.accessToken)
  })

  it('Should return unauthorized if response is instance of Error', async () => {
    const { sut, httpHelper, request, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new Error()))
  })

  it('Should return ok if succeds', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ accessToken: 'any_token' }))
  })
})
