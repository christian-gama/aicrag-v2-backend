import { IUser } from '@/domain'
import { IRefreshToken, IVerifyToken } from '@/domain/providers'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { PartialProtectedMiddleware } from '@/presentation/middlewares'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeRefreshToken, makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: PartialProtectedMiddleware
  verifyAccessTokenStub: IVerifyToken
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
    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.cookies?.accessToken)
  })

  it('should return unauthorized if response is instance of Error', async () => {
    const { httpHelper, request, sut, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new Error()))
  })

  it('should return ok if succeeds', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ accessToken: 'any_token' }))
  })
})
