import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { AccessToken } from '@/presentation/middlewares/authentication/access-token'
import { makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: AccessToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequestToken
  verifyAccessTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { accessToken: 'any_token' }
  const verifyAccessTokenStub = makeVerifyTokenStub()

  const sut = new AccessToken(httpHelper, verifyAccessTokenStub)

  return {
    sut,
    fakeUser,
    httpHelper,
    request,
    verifyAccessTokenStub
  }
}

describe('AccessToken', () => {
  it('Should call verify with token', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()

    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.accessToken)
  })

  it('Should return unauthorized if response is instance of Error', async () => {
    const { sut, request, httpHelper, verifyAccessTokenStub } = makeSut()

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
