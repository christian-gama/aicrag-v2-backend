import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { InvalidTokenError } from '@/application/usecases/errors'
import { makeHttpHelper } from '@/main/factories/helpers'
import { VerifyTokenUrlController } from '@/presentation/controllers/token/verify-token-url-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyTokenUrlController
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  verifyAccessTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const request = { param: { token: 'any_token' } }
  const verifyAccessTokenStub = makeVerifyTokenStub()

  const sut = new VerifyTokenUrlController(httpHelper, verifyAccessTokenStub)

  return { sut, httpHelper, request, verifyAccessTokenStub }
}

describe('VerifyTokenUrlController', () => {
  it('Should call verify with correct values', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return unauthorized if does not find a user', async () => {
    const { sut, httpHelper, request, verifyAccessTokenStub } = makeSut()
    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })
})
